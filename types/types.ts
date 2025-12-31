export enum GeneralStatus {
  Idle = "idle",
  Loading = "loading",
  Failed = "failed",
  Success = "success",
}

export interface Transaction {
  uniqueId: string;
  from: string;
  to: string;
  hash: string;
  value: number;
  blockTime: number;
  asset: string;
  direction: string;
}

export interface AddressState {
  accountName: string;
  derivationPath: string;
  address: string;
  publicKey: string;
  balance: number;
  transactionMetadata?: TransactionMetadata;
  failedNetworkRequest: boolean;
  status: GeneralStatus;
  transactionConfirmations: TransactionConfirmation[];
  type: string;
}

export enum ConfirmationState {
  Pending = "pending",
  Confirmed = "confirmed",
  Failed = "failed",
}

export interface TransactionConfirmation {
  txHash: string;
  status: ConfirmationState;
  error?: string;
}

export interface TransactionMetadata {
  paginationKey: undefined | string | string[];
  transactions: Transaction[];
}


export interface WalletState {
  activeIndex: number;
  addresses: AddressState[];
}

export type OptionNetworkType = {
  name: string;
  slug: string;
  id: string;
  image: string;
  slugDextool?: string;
  symbol: string;
  isSupport: boolean;
  chain?: string
  IdMoralis?: string
  
};
