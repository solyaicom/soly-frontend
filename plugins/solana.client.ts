import "solana-wallets-vue/styles.css";
import SolanaWallets from "solana-wallets-vue";
import { PhantomWalletAdapter } from "~/lib/wallets/phantom";

export default defineNuxtPlugin(() => {
  const walletOptions = {
    wallets: [new PhantomWalletAdapter()],
    autoConnect: true,
  };

  const wallet = SolanaWallets.install(useNuxtApp().vueApp, walletOptions as any);

  return {
    provide: {
      wallet,
    },
  };
});
