<script setup lang="ts">
const props = defineProps<{ output: string }>();
const data = JSON.parse(props.output).data;
console.log(data);
function viewScanner(address: string) {
  window.open("https://gmgn.ai/sol/token/" + address, "_blank");
}
</script>

<template>
  <div class="p-3 bg-app-card1 rounded-b-[6px]">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div v-for="(token, index) in data.items" :key="index" class="rounded-[6px] border-[1px] border-app-line2 pb-3">
        <div class="row-center mt-3 px-4">
          <img :src="token.image_url" class="w-[32px] rounded-full" />
          <div class="flex-1 ml-2">
            <div>
              <span class="text-app-text1 font-[600]">{{ token.name }}</span>
              <span class="ml-1 text-app-text3 text-[12px]">{{ token.symbol }}</span>
            </div>
            <a :href="`https://gmgn.ai/sol/token/${token.address}`" target="_blank" class="row-center text-app-text2">
              <p>{{ token.price ? `$${formatNotationNumber(token.price.usd)}` : shortAddress(token.address) }}</p>
              <div v-if="!!token.price" class="row-center ml-1">
                <img :src="token.price.usd_24h_change > 0 ? '/images/icon-up.svg' : '/images/icon-down.svg'" class="w-[16px]" />
                <span class="text-[12px]" :class="token.price.usd_24h_change > 0 ? 'text-app-green' : 'text-app-red'"
                  >{{ formatNotationNumber(token.price.usd_24h_change, 2) }}%</span
                >
              </div>
              <NuxtIcon name="icon-scanner" class="text-[14px] ml-1" />
            </a>
          </div>
        </div>
        <div v-if="!!token.price" class="row-center grid grid-cols-2 mt-3 px-4 py-3 bg-app-background">
          <div class="text-center">
            <p class="text-app-text3 text-[12px]">Market Cap</p>
            <p class="mt-1 text-app-text1 font-[600]">${{ formatNotationNumber(token.price.usd_market_cap) }}</p>
          </div>
          <div class="text-center border-l-[1px] border-l-app-line1">
            <p class="text-app-text3 text-[12px]">24h Volume</p>
            <p class="mt-1 text-app-text1 font-[600]">${{ formatNotationNumber(token.price.usd_24h_vol) }}</p>
          </div>
        </div>
        <!-- <div class="row-center grid grid-cols-3 mt-3">
          <div class="text-center text-[12px]">
            <p class="text-app-text3">Holders</p>
            <p class="mt-1 text-app-text2">$3.43M</p>
          </div>
          <div class="text-center text-[12px] border-l-[1px] border-l-app-line1">
            <p class="text-app-text3">Listed about</p>
            <p class="mt-1 text-app-text2">$3.43M</p>
          </div>
          <div class="text-center text-[12px] border-l-[1px] border-l-app-line1">
            <p class="text-app-text3">Txns</p>
            <p class="mt-1 text-app-text2">$3.43M</p>
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>
