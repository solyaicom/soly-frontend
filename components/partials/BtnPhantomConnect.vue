<script setup lang="ts">
import { WalletReadyState } from "@solana/wallet-adapter-base";

const props = defineProps<{ onChange: (address?: string) => void }>();

const { connected, wallets, address, readyState, selectWallet, disconnect } = useSolConnect();

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
    props.onChange(add);
  },
  { immediate: true }
);
</script>

<template>
  <div>
    <button @click="toggleSOLConnectWallet">
      {{ address ? "Disconnect" : "Connect" }}
    </button>
  </div>
</template>
