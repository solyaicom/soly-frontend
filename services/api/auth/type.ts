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
}
