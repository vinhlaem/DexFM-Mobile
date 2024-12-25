type BlockTime = number;

export interface Status {
  Ok: null;
}

export interface PublicKeyInfo {
  pubkey: string;
  signer: boolean;
  source: string;
  writable: boolean;
}

export interface Info {
  destination: string;
  lamports: number;
  source: string;
}
export interface Parsed {
  info: Info;
  type: string;
}

export interface Instruction {
  parsed: Parsed;
  program: string;
  programId: string;
  stackHeight: null | number;
}

export interface Message {
  accountKeys: PublicKeyInfo[];
  instructions: Instruction[];
  recentBlockhash: string;
}

export interface Meta {
  computeUnitsConsumed: number;
  err: null;
  fee: number;
  innerInstructions: any[];
  logMessages: string[];
  postBalances: number[];
  postTokenBalances: any[];
  preBalances: number[];
  preTokenBalances: any[];
  rewards: any[];
  status: Status;
}

export interface TransactionType {
  message: Message;
  signatures: string[];
}

export interface TransactionObject {
  blockTime: BlockTime;
  meta: Meta;
  slot: number;
  transaction: TransactionType;
}
