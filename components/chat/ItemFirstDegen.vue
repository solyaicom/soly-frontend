<script setup lang="ts">
defineProps<{
  inputs: any;
  created_at: any;
  isPreview?: boolean;
}>();
</script>

<template>
  <div class="p-1 rounded-[8px] w-full">
    <div class="row-center justify-between">
      <img src="/images/icon-pump.svg" />
      <span v-if="!isPreview" class="text-app-text2">{{ getTimeLabel(new Date(created_at).getTime()) }}</span>
    </div>
    <p class="mt-1 text-app-text1" :class="{ 'line-clamp-1': isPreview }">
      ${{ inputs.token_info?.symbol }} just pumped to <strong>{{ formatNotationNumber(inputs.token_info?.usd_market_cap, 0) }}</strong> USD market
      cap, with <strong>{{ inputs.token_info?.trackers?.total_buy }} SOL</strong> volume from
      <strong>{{ inputs.token_info?.trackers?.count_buy }}</strong> buyers.
    </p>
    <div class="border-[2px] border-[#404040] mt-4 rounded-[6px]">
      <div class="p-4 grid grid-cols-1 md:grid-cols-2 gap-y-2">
        <div class="row-center">
          <a :href="getTokenSolscanLink(inputs.token_info?.address)" target="_blank">
            <div class="w-[32px] h-[32px] md:w-[48px] md:h-[48px] rounded-full overflow-hidden">
              <img :src="inputs.token_info?.logo" class="w-full" />
            </div>
          </a>
          <div class="ml-2">
            <p>
              <span>{{ inputs.token_info?.name }}</span> <span class="ml-1 text-app-text3 text-[12px]">{{ inputs.token_info?.symbol }}</span>
            </p>
            <div class="row-center">
              <div class="row-center mt-1 text-app-text1 cursor-pointer" @click="copyToClipboard(inputs.token_info?.address)">
                <p>{{ shortAddress(inputs.token_info?.address) }}</p>
                <NuxtIcon name="icon-copy" class="ml-1" />
              </div>
              <a :href="getTokenExplorerLink(inputs.token_info?.address)" target="_blank" class="ml-3 mt-1 text-blue-500 underline"> GMGN </a>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-2">
          <div>
            <p class="text-app-text2">Token Age</p>
            <p class="text-app-text1 mt-1">{{ getTimeToDiff(inputs.token_info?.creation_timestamp) }}</p>
          </div>
          <a>
            <div class="flex flex-col">
              <p class="text-app-text2">Social</p>
              <div class="row-center mt-1">
                <a :href="`https://x.com/search?q=${inputs.token_info?.address}`" target="_blank" class="text-blue-500 underline">Search CA</a>
                <a v-if="inputs.token_info?.socials?.twitter" class="ml-2" :href="inputs.token_info?.socials?.twitter" target="_blank">
                  <div class="row-center text-app-text1">
                    <span class="mr-2">|</span>
                    <NuxtIcon name="icon-x" />
                  </div>
                </a>
              </div>
            </div>
          </a>
        </div>
      </div>
      <div class="bg-app-card4 p-4 grid grid-cols-2 md:grid-cols-4 gap-2">
        <div>
          <p class="text-app-text2">Market Cap</p>
          <p class="text-app-text1 mt-1">{{ formatNotationNumber(inputs.token_info?.usd_market_cap, 0) }}</p>
        </div>
        <div>
          <p class="text-app-text2">Liquidity</p>
          <p class="text-app-text1 mt-1">{{ formatNotationNumber(inputs.token_info?.liquidity, 0) }}</p>
        </div>
        <div>
          <p class="text-app-text2">Fresh Wallets</p>

          <p class="text-app-text1 mt-1">
            <span v-if="inputs.insight.fresh_wallets_count !== 0">
              {{ inputs.insight?.fresh_wallets_count }} |
              {{ formatNumber((inputs.insight?.fresh_wallets_usd / inputs.token_info?.usd_market_cap) * 100, 2) }}%</span
            >
            <span v-else>N/I</span>
          </p>
        </div>
        <div>
          <p class="text-app-text2">Insiders</p>
          <p class="text-app-text1 mt-1">
            <span v-if="inputs.insight.insiders_count !== 0">
              {{ inputs.insight?.insiders_count }} |
              {{ formatNumber((inputs.insight?.insiders_usd / inputs.token_info?.usd_market_cap) * 100, 2) }}%</span
            >
            <span v-else>N/I</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
