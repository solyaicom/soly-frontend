import { defineStore } from "pinia";
import { Token, WalletPortfolio } from "~/services/solana/portfolio";
import { getSolBalance, getWalletPortfolio } from "~/services/solana/utils";

const DURATION_CACHE = 1000 * 60 * 5;

const DURATION_STORE_KEY = "solana-data-to-cache";

export const useSolana = defineStore("solana-store", {
  state: () => ({
    balance: 0,
    portfolio: {
      address: "",
      tokens: [] as Token[],
      nfts: [] as any[],
      totalBalance: 0,
    } as WalletPortfolio,
    totalBalance: 0,
    init_done: false,
  }),
  actions: {
    async init(force?: boolean) {
      const dataCache = JSON.parse(localStorage.getItem(DURATION_STORE_KEY) || "{}");
      const now = Date.now();
      if (dataCache.timestamp && Number(dataCache.timestamp || 0) + DURATION_CACHE > now && !force) {
        this.balance = Number(dataCache.balance || 0);
        this.totalBalance = Number(dataCache.totalBalance || 0);
        return;
      }
      const { getUser } = useAuthStore();
      const address = getUser()?.wallet?.address;
      if (!address) return;
      this.init_done = false;

      this.portfolio = await getWalletPortfolio(address);
      this.totalBalance = this.portfolio.totalBalance;
      this.balance = this.portfolio.tokens[0]?.balance || 0;
      localStorage.setItem(
        DURATION_STORE_KEY,
        JSON.stringify({
          timestamp: Date.now(),
          balance: this.balance,
          totalBalance: this.portfolio.totalBalance,
        })
      );
      this.init_done = true;
    },
    async refresh() {
      this.init(true);
    },
  },
});
