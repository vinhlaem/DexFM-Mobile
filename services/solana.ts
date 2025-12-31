import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
  Keypair,
  TransactionConfirmationStrategy,
} from "@solana/web3.js";
import uuid from "react-native-uuid";
import { validateMnemonic, mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { TransactionObject } from "@/types/solanaType";

export class SolanaService {
  private connection: Connection | null = null;
  private connectionRetries = 0;
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 2000;
  private readonly REQUEST_TIMEOUT = 5000;

  constructor(private rpcUrl: string) {
  }

  private async fetchWithTimeout(url: string, options: RequestInit): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.REQUEST_TIMEOUT);

    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timeoutId);
      return response;
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Request timed out');
      }
      throw error;
    }
  }

  private async getLatestBlockhashWithPost(): Promise<{ blockhash: string; lastValidBlockHeight: number }> {
    try {
      const response = await this.fetchWithTimeout(this.rpcUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "getLatestBlockhash",
          params: [{ commitment: "confirmed" }],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(`RPC error: ${data.error.message}`);
      }

      const result = data.result.value;
      return {
        blockhash: result.blockhash,
        lastValidBlockHeight: result.lastValidBlockHeight,
      };
    } catch (error) {
      console.error("Failed to fetch latest blockhash:", error);
      throw error;
    }
  }

  private async initializeConnection(): Promise<void> {
    try {
      this.connection = new Connection(this.rpcUrl, "confirmed");
      await this.getLatestBlockhashWithPost(); 
      this.connectionRetries = 0;
      console.log("Solana connection initialized");
    } catch (error) {
      console.error("Failed to initialize Solana connection:", error);
      if (this.connectionRetries < this.MAX_RETRIES) {
        this.connectionRetries++;
        await new Promise((resolve) => setTimeout(resolve, this.RETRY_DELAY));
        return this.initializeConnection();
      }
      this.connection = null;
      throw new Error("Failed to initialize Solana connection after retries");
    }
  }

  private async ensureConnection(): Promise<Connection> {
    if (!this.connection) {
      await this.initializeConnection();
      if (!this.connection) {
        throw new Error("Solana connection not established");
      }
    }
    return this.connection;
  }

  async destroy() {
    if (this.connection) {
      this.connection = null;
      console.log("Solana connection closed");
    }
  }

  async restoreWalletFromPhrase(mnemonicPhrase: string): Promise<Keypair> {
    try {
      if (!validateMnemonic(mnemonicPhrase)) {
        throw new Error("Invalid mnemonic phrase");
      }
      const seed = mnemonicToSeedSync(mnemonicPhrase, "");
      const path = `m/44'/501'/0'/0'`;
      const keypair = Keypair.fromSeed(
        derivePath(path, seed.toString("hex")).key
      );
      return keypair;
    } catch (error: any) {
      console.error("Failed to restore Solana wallet:", error);
      throw new Error("Failed to restore Solana wallet: " + error.message);
    }
  }

  async createWalletByIndex(phrase: string, index: number = 0) {
    try {
      if (!validateMnemonic(phrase)) {
        throw new Error("Invalid mnemonic phrase");
      }
      const seed = mnemonicToSeedSync(phrase, "");
      const path = `m/44'/501'/${index}'/0'`;
      const keypair = Keypair.fromSeed(
        derivePath(path, seed.toString("hex")).key
      );
      return {
        publicKey: keypair.publicKey.toBase58(),
        address: keypair.publicKey.toBase58(),
        derivationPath: path,
      };
    } catch (error) {
      console.error("Failed to create Solana wallet:", error);
      throw new Error("Failed to create Solana wallet: " + (error as Error).message);
    }
  }
  async getBalance(publicKeyString: string): Promise<number> {
    try {
      if (!publicKeyString) {
        throw new Error("Public key is required");
      }
      const connection = await this.ensureConnection();
      const publicKey = new PublicKey(publicKeyString);
      const balancePromise = connection.getBalance(publicKey);
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Balance fetch timed out")), this.REQUEST_TIMEOUT)
      );
      const balance = (await Promise.race([balancePromise, timeoutPromise])) as number;
      console.log(`Balance for ${publicKeyString}: ${balance / LAMPORTS_PER_SOL} SOL`);
      return balance / LAMPORTS_PER_SOL;
    } catch (error) {
      console.error("Error fetching Solana balance:", error);
      throw new Error("Failed to fetch Solana balance: " + (error as Error).message);
    }
  }

  async #fetchTransactionsSequentially(signatures: any[]): Promise<any[]> {
    const connection = await this.ensureConnection();
    const transactions = [];
    const RATE_LIMIT_DELAY = 250;

    for (const signature of signatures) {
      try {
        const transaction = await connection.getParsedTransaction(signature.signature);
        transactions.push(transaction);
      } catch (error: any) {
        if (error.message?.includes("429")) {
          console.warn("Rate limit hit, retrying after delay...");
          await new Promise((resolve) => setTimeout(resolve, RATE_LIMIT_DELAY));
          try {
            const transaction = await connection.getParsedTransaction(signature.signature);
            transactions.push(transaction);
          } catch (retryError) {
            console.error("Failed to fetch transaction after retry:", retryError);
          }
        } else {
          console.error("Failed to fetch transaction:", error);
        }
      }
    }
    return transactions;
  }

  #extractTransactionDetails(transactionObject: TransactionObject, addressOfInterest: string) {
    const transferInstruction = transactionObject.transaction.message.instructions.find(
      (instruction: any) => instruction.parsed && instruction.parsed.type === "transfer"
    );

    if (!transferInstruction) {
      return null;
    }

    const info = transferInstruction.parsed.info;
    let direction = "other";
    if (info.source === addressOfInterest) {
      direction = "sent";
    } else if (info.destination === addressOfInterest) {
      direction = "received";
    }

    const hash = transactionObject.transaction.message.recentBlockhash;
    const uniqueId = uuid.v4();
    const from = info.source;
    const to = info.destination;
    const amountSentLamports = info.lamports;
    const value = amountSentLamports / LAMPORTS_PER_SOL;
    const blockTime = transactionObject.blockTime;

    return {
      uniqueId,
      from,
      to,
      hash,
      value,
      direction,
      blockTime,
      asset: "SOL",
    };
  }

  async getTransactionsByWallet(walletAddress: string, beforeSignature?: string, limit: number = 50): Promise<any[]> {
    try {
      if (!walletAddress) {
        throw new Error("Wallet address is required");
      }
      const connection = await this.ensureConnection();
      const publicKey = new PublicKey(walletAddress);
      const signatures = await connection.getSignaturesForAddress(publicKey, {
        before: beforeSignature,
        limit,
      });
      const rawTransactions = await this.#fetchTransactionsSequentially(signatures);
      const transactions = rawTransactions
        .map((tx: any) => this.#extractTransactionDetails(tx, walletAddress))
        .filter((tx: any) => tx !== null)
        .sort((a: any, b: any) => b.blockTime - a.blockTime);
      console.log(`Fetched ${transactions.length} transactions for ${walletAddress}`);
      return transactions;
    } catch (error) {
      console.error("Failed to fetch Solana transactions:", error);
      throw new Error("Unable to fetch transactions: " + (error as Error).message);
    }
  }

  async validateAddress(addr: string): Promise<boolean> {
    try {
      const publicKey = new PublicKey(addr);
      return PublicKey.isOnCurve(publicKey.toBytes());
    } catch (err) {
      console.error("Error validating Solana address:", err);
      return false;
    }
  }

  async calculateTransactionFee(from: string, to: string, amount: number): Promise<number> {
    try {
      if (!from || !to || !amount) {
        throw new Error("Missing required parameters");
      }
      const connection = await this.ensureConnection();
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: new PublicKey(from),
          toPubkey: new PublicKey(to),
          lamports: amount * LAMPORTS_PER_SOL,
        })
      );

      const recentBlockhash = (await this.getLatestBlockhashWithPost()).blockhash;
      transaction.recentBlockhash = recentBlockhash;
      transaction.feePayer = new PublicKey(from);

      const response = await connection.getFeeForMessage(transaction.compileMessage(), "confirmed");
      return response.value || 0;
    } catch (err) {
      console.error("Error fetching Solana transaction fee:", err);
      throw new Error("Failed to fetch transaction fee: " + (err as Error).message);
    }
  }

  async sendTransaction(secretKey: Uint8Array, to: string, amount: number): Promise<string> {
    try {
      if (!secretKey || !to || !amount) {
        throw new Error("Missing required transaction parameters");
      }
      const connection = await this.ensureConnection();
      const keyPair = Keypair.fromSecretKey(secretKey);
      const balance = await connection.getBalance(keyPair.publicKey);

      if (balance < amount * LAMPORTS_PER_SOL) {
        throw new Error("Insufficient funds for the transaction");
      }

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: keyPair.publicKey,
          toPubkey: new PublicKey(to),
          lamports: amount * LAMPORTS_PER_SOL,
        })
      );

      const recentBlockhash = (await this.getLatestBlockhashWithPost()).blockhash;
      transaction.recentBlockhash = recentBlockhash;
      transaction.feePayer = keyPair.publicKey;

      const signature = await sendAndConfirmTransaction(connection, transaction, [keyPair]);
      console.log(`Transaction sent: ${signature}`);
      return signature;
    } catch (err) {
      console.error("Error sending Solana transaction:", err);
      throw new Error("Failed to send transaction: " + (err as Error).message);
    }
  }

  async derivePrivateKeysFromPhrase(mnemonicPhrase: string, path: string): Promise<Uint8Array> {
    try {
      if (!mnemonicPhrase) {
        throw new Error("Empty mnemonic phrase");
      }
      if (!validateMnemonic(mnemonicPhrase)) {
        throw new Error("Invalid mnemonic phrase");
      }
      const seed = mnemonicToSeedSync(mnemonicPhrase, "");
      const keypair = Keypair.fromSeed(derivePath(path, seed.toString("hex")).key);
      return keypair.secretKey;
    } catch (error) {
      console.error("Failed to derive private keys:", error);
      throw new Error("Failed to derive wallet from mnemonic: " + (error as Error).message);
    }
  }

  async findNextUnusedWalletIndex(mnemonicPhrase: string, indexOffset: number = 0): Promise<number> {
    try {
      if (!mnemonicPhrase) {
        throw new Error("Empty mnemonic phrase");
      }
      if (!validateMnemonic(mnemonicPhrase)) {
        throw new Error("Invalid mnemonic phrase");
      }
      const seed = mnemonicToSeedSync(mnemonicPhrase, "");
      let currentIndex = indexOffset;
      const connection = await this.ensureConnection();

      while (true) {
        const path = `m/44'/501'/${currentIndex}'/0'`;
        const keypair = Keypair.fromSeed(derivePath(path, seed.toString("hex")).key);
        const publicKey = keypair.publicKey;
        const signatures = await connection.getSignaturesForAddress(publicKey, { limit: 1 });

        if (signatures.length === 0) {
          break;
        }
        currentIndex += 1;
      }

      return currentIndex > 0 ? currentIndex + 1 : 0;
    } catch (error) {
      console.error("Failed to find unused wallet index:", error);
      throw new Error("Failed to find unused wallet index: " + (error as Error).message);
    }
  }

  async collectedUsedAddresses(mnemonicPhrase: string, unusedIndex: number): Promise<any[]> {
    try {
      const startingIndex = unusedIndex > 0 ? unusedIndex - 1 : unusedIndex;
      const seed = mnemonicToSeedSync(mnemonicPhrase, "");
      const keyPairsUsed = [];

      for (let i = 0; i <= startingIndex; i++) {
        const path = `m/44'/501'/${i}'/0'`;
        const keypair = Keypair.fromSeed(derivePath(path, seed.toString("hex")).key);
        const normalizedKeyPair = {
          publicKey: keypair.publicKey.toBase58(),
        };
        const keypairWithDetails = {
          ...normalizedKeyPair,
          derivationPath: path,
        };
        keyPairsUsed.push(keypairWithDetails);
      }

      return keyPairsUsed;
    } catch (error) {
      console.error("Failed to collect used addresses:", error);
      throw new Error("Failed to collect used addresses: " + (error as Error).message);
    }
  }

  async importAllActiveAddresses(mnemonicPhrase: string, offsetIndex?: number): Promise<any[]> {
    try {
      if (offsetIndex) {
        return await this.collectedUsedAddresses(mnemonicPhrase, offsetIndex);
      }
      const unusedAddressIndex = await this.findNextUnusedWalletIndex(mnemonicPhrase);
      return await this.collectedUsedAddresses(mnemonicPhrase, unusedAddressIndex);
    } catch (error) {
      console.error("Failed to import active addresses:", error);
      throw new Error("Unable to import active addresses: " + (error as Error).message);
    }
  }

  async confirmTransaction(signature: string): Promise<boolean> {
    try {
      if (!signature) {
        throw new Error("Signature is required");
      }
      const connection = await this.ensureConnection();
      const latestBlockhash = await this.getLatestBlockhashWithPost();

      const strategy: TransactionConfirmationStrategy = {
        signature,
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
      };

      const result = await connection.confirmTransaction(strategy);
      console.log(`Transaction confirmation status for ${signature}: ${result.value.err === null}`);
      return result.value.err === null;
    } catch (error) {
      console.error("Error confirming Solana transaction:", error);
      throw new Error("Failed to confirm transaction: " + (error as Error).message);
    }
  }
}