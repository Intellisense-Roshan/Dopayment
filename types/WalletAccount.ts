export interface WalletAccount {
  id: string;
  provider: string;
  email: string;
  accountNumber?: string;
  balance: number;
  currency: string;
  isVerified: boolean;
  isPrimary: boolean;
  logo?: string;
}