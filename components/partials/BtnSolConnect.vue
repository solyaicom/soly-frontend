<script setup lang="ts">
import { WalletReadyState } from "@solana/wallet-adapter-base";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

defineProps({
  className: { type: String, default: "" },
});

const { connected, wallets, address, readyState, getSolBalance, selectWallet, disconnect } = useSolConnect();

const solBalance = ref(0);
const walletPhantom = computed(() => {
  return wallets.value[0];
});

async function toggleSOLConnectWallet() {
  if (readyState.value === WalletReadyState.NotDetected) {
    window.open("https://phantom.app/download", "_black");
    return;
  }
  if (!walletPhantom.value) {
    return;
  }
  if (address.value && connected.value) {
    await disconnect();
  } else {
    selectWallet(walletPhantom.value.adapter.name);
  }
}

watch(
  address,
  async (add) => {
    if (add) {
      solBalance.value = await getSolBalance(add);
    }
  },
  { immediate: true }
);
</script>

<template>
  <div>
    <button variant="white" class="btn__solid btn__solid-white h-9 px-4 flex flex-col" :class="className" @click="toggleSOLConnectWallet">
      <span>{{ address ? shortAddress(address) : "Connect Wallet" }}</span>
      <span v-if="address" class="text-xs">{{ formatNumber(solBalance / LAMPORTS_PER_SOL, 3) }} SOL</span>
    </button>
  </div>
</template>
