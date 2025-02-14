export interface IAuthLimit {
  access_token: string;
  id: string;
  next_href?: string;
  status?: number;
}

export interface IWalletInfor {
  address: string;
}

export interface IUserProfile {
  id: string;
  name: string;
  email: string;
  username: string;
  wallet: IWalletInfor;
  avatar_url: string;
  privy_wallet: IWalletInfor;
  subscription: {
    expire_at: string;
    data?: {
      payment_id: string;
      tx_signature: string;
    };
    status: "not_subscribed" | "active" | "pending";
  };
}
