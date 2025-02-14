import { defineStore } from "pinia";

interface IPrivyWallet {
  address: string;
  chainType: "solana";
  connectorType: string;
  delegated: boolean;
  imported: boolean;
  walletIndex: number;
}

interface IPrivyUser {
  id: string;
  email: string;
  linkedAccounts: any[];
  wallet: IPrivyWallet;
}

export const useVuePrivy = defineStore("vue-privy-store", {
  state: () => ({
    privy: {},
    user: {} as IPrivyUser,
  }),
  actions: {
    setPrivyUser(user: IPrivyUser) {
      this.user = user;
    },
    setPrivyData(data: any) {
      this.privy = data;
    },
    request(method: "export" | "delegate" | "revoke_delegate" | "deposit", params?: any) {
      window.postMessage({
        origin: "request_privy",
        method,
        params,
      });
    },
  },
});
