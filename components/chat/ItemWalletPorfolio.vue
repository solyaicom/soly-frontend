<script setup lang="ts">
const props = defineProps<{ output: string }>();

const solana = useSolana();
const data = convertToolOutput(props.output);
function findBalanceUSD(address: string) {
  const _token = solana.portfolio.tokens.find((token) => token.mint === address);
  return _token?.usdPrice || 0;
}
</script>

<template>
  <div>
    <div class="bg-[#141414] p-3">
      <div class="row-center justify-between cursor-pointer" @click="copyToClipboard(solana.currentAddress)">
        <div class="row-center">
          <img src="/images/icon-wallet.svg" />
          <p class="ml-1 text-[#979797]"><span class="font-[600] text-[#cacaca]">Wallet Address:</span> {{ shortAddress(solana.currentAddress) }}</p>
        </div>
        <NuxtIcon name="icon-copy" class="text-[20px] text-[#979797]" />
      </div>
      <div class="line mt-3 bg-[#2c2c2c]"></div>
      <div v-for="token in data.items" :key="token.address" class="mt-3 space-y-3">
        <div class="row-center">
          <div class="w-[28px] h-[28px] md:w-[40px] md:h-[40px] rounded-full overflow-hidden">
            <img :src="token?.logo" class="w-full h-full" />
          </div>
          <div class="flex-1 ml-2">
            <p class="text-[#cacaca] font-[600]">
              {{ token?.name }} <span class="text-[12px] text-[#656565] font-[400]">{{ token?.symbol }}</span>
            </p>
            <p class="text-[#979797]">{{ shortAddress(token?.address) }}</p>
          </div>
          <div class="text-end">
            <p class="text-[#cacaca] font-[600]">{{ formatNumber(Number(token.amount_float), 3) }} {{ token.symbol }}</p>
            <p class="text-[12px] text-[#656565] font-[400]">${{ formatNumber(findBalanceUSD(token.address), 2) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
