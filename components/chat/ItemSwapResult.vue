<script setup lang="ts">
const props = defineProps<{ output: string }>();
function onViewScanner() {
  const data = convertToolOutput(props.output);
  const txhash = data.tx_signature;

  window.open(`https://solscan.io/tx/${txhash}`, "_blank");
}
</script>

<template>
  <div class="flex items-center cursor-pointer p-3" @click="onViewScanner">
    <div class="w-[48px] h-[48px] rounded-[6px] flex items-center justify-center bg-[#242424]">
      <img src="/images/icon-swap-done.svg" class="w-[24px] h-[24px]" />
    </div>
    <div class="ml-2">
      <p class="font-[600] text-[#cacaca]">Transaction Sent</p>
      <div class="row-center text-[#979797]">
        <p>View details on Solcan</p>
        <NuxtIcon name="icon-scanner" class="text-[14px] ml-1" />
      </div>
    </div>
  </div>
</template>
