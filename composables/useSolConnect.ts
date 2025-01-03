import { useWallet } from "solana-wallets-vue";
import * as anchor from "@coral-xyz/anchor";
import base58 from "bs58";
import { PublicKey } from "@solana/web3.js";
import { CONNECTION_CONFIG, SIGN_MESSAGE_DESCRIPTION } from "~/constants";

export const connection = new anchor.web3.Connection(CONNECTION_CONFIG.mainnet, "confirmed");

export function useSolConnect() {
  // const authStore = useAuthStore();
  // const accessToken = useStorage(StorageKeys.accessToken, "");

  const {
    connected,
    connecting,
    disconnecting,
    wallet,
    wallets,
    publicKey,
    readyState,
    signMessage,
    signTransaction,
    select,
    connect,
    disconnect,
    sendTransaction,
  } = useWallet();

  const address = computed(() => publicKey.value?.toBase58());

  function selectWallet(walletName: any) {
    if (connected.value || wallet.value) {
      return;
    }
    select(walletName);
  }

  async function handleSignMessage(message = SIGN_MESSAGE_DESCRIPTION): Promise<string> {
    const signMessageFn = signMessage.value;
    if (!signMessageFn) {
      return "";
    }
    const uint8array = new TextEncoder().encode(message);

    const signatureBuffer = await signMessageFn(uint8array);
    return base58.encode(signatureBuffer);
  }

  async function handleSignMessageAndLinkWallet(address: string, message = SIGN_MESSAGE_DESCRIPTION) {
    if (!address) {
      return;
    }
    const signature = await handleSignMessage(message);
    if (signature) {
      // const res = await authStore.linkWallet({
      //   message,
      //   wallet: address,
      //   signature,
      // })
      // return res
    }
  }

  async function getSolBalance(pk: string) {
    try {
      const wallet = new PublicKey(pk);
      const balance = await connection.getBalance(wallet);
      return balance;
    } catch {
      return 0;
    }
  }

  async function checkSignature(sig: string) {
    let retries = 0;
    let result = null;
    const maxRetries = 20;

    while (retries < maxRetries || result === null) {
      try {
        result = await connection.getSignatureStatus(sig, {
          searchTransactionHistory: true,
        });
        if (result.value && !result.value?.err) {
          result = true;
          return result;
        }
        await sleep(1000);
        retries++;
      } catch (error) {
        console.error("Error confirming transaction:", error);
        retries++;
        if (retries === maxRetries) {
          return false;
        }
        await sleep(500);
      }
    }
  }

  return {
    wallets,
    address,
    publicKey,
    connected,
    connecting,
    readyState,
    signMessage,
    disconnecting,
    signTransaction,
    connect,
    disconnect,
    selectWallet,
    getSolBalance,
    checkSignature,
    sendTransaction,
    handleSignMessage,
    handleSignMessageAndLinkWallet,
  };
}
