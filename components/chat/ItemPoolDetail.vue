<script setup lang="ts">
import { fetchTokenAssets } from "~/services/solana/helius-api";
import { IFullToken } from "~/services/solana/type";

const props = defineProps<{ output: string }>();
const data = convertToolOutput(props.output);
const tokens = ref<IFullToken[]>([]);

onMounted(async () => {
  if (data.mint_x && data.mint_y) {
    tokens.value = await fetchTokenAssets([data.mint_x, data.mint_y]);
  }
});
</script>

<template>
  <div class="p-3 bg-[#2f2f2f] rounded-b-[6px]">
    <div class="row-center justify-between">
      <div class="row-center justify-between">
        <div class="relative w-[64px] md:w-[78px] h-[44px]">
          <img :src="tokens[0]?.imageUrl" class="w-[32px] md:w-[44px] rounded-full" />
          <img :src="tokens[1]?.imageUrl" class="w-[32px] md:w-[44px] absolute right-0 top-0 rounded-full" />
        </div>
        <div class="ml-2">
          <div class="md:row-center">
            <p class="text-[16px] font-[600]">{{ data.name }}</p>
            <div class="row-center ml-2 text-[12px]">
              <div class="row-center">
                <p class="text-app-text3">Bin Step</p>
                <span class="ml-1">{{ data.bin_step }}</span>
              </div>
              <div class="row-center ml-2">
                <p class="text-app-text3">Fee</p>
                <span class="ml-1">{{ formatNotationNumber(data.base_fee_percentage, 2) }}%</span>
              </div>
            </div>
          </div>
          <div class="py-1 px-[6px] border-[1px] border-app-line2 mt-1 text-app-text2 md:font-[600] text-[10px] md:text-[12px] rounded-[12px] w-fit">
            DLMM POOL
          </div>
        </div>
      </div>
      <a :href="`https://app.meteora.ag/dlmm/${data.address}`" target="_blank" class="text-blue-500 text-end"> View on Meteora </a>
    </div>
    <div class="bg-app-card1 mt-3 grid grid-cols-3 p-3 rounded-[6px] text-center">
      <div>
        <p class="text-app-text3 text-[12px]">Liquidity</p>
        <p class="text-app-text1 font-[600]">
          ${{ Number(data.liquidity) > 1e9 ? formatNotationNumber(data.liquidity, 2) : formatNumber(data.liquidity, 0) }}
        </p>
      </div>
      <div class="border-l-[1px] border-l-app-line1">
        <p class="text-app-text3 text-[12px]">Fee (24h)</p>
        <p class="text-app-text1 font-[600]">
          ${{ Number(data.fees_24h) > 1e9 ? formatNotationNumber(data.fees_24h, 2) : formatNumber(data.fees_24h, 0) }}
        </p>
      </div>
      <div class="border-l-[1px] border-l-app-line1">
        <p class="text-app-text3 text-[12px]">24h fee / TVL</p>
        <p class="text-app-text1 font-[600]">{{ formatNotationNumber(data.apr, 2) }}%</p>
      </div>
    </div>
    <div class="mt-3">
      <p class="text-app-text2">Pool Tokens</p>
      <div class="space-y-3 mt-3">
        <div v-for="(token, idx) in tokens" :key="token.address" class="row-center justify-between">
          <div class="row-center">
            <img :src="token.imageUrl" class="w-8 rounded-full" />
            <div class="ml-2">
              <div class="row-center">
                <p class="text-app-text1 font-[600]">{{ token.name }}</p>
                <p class="ml-1 text-app-text3 text-[12px]">{{ token.symbol }}</p>
              </div>
              <div class="row-center cursor-pointer" @click="copyToClipboard(token.address)">
                <p class="text-[12px] text-app-text2">{{ shortAddress(token.address) }}</p>
                <NuxtIcon name="icon-copy" class="text-app-text2 ml-1" />
              </div>
            </div>
          </div>
          <p class="text-app-text1">{{ formatNumber(data[`reserve_${idx === 0 ? "x" : "y"}_amount`] / Math.pow(10, token.decimals), 2) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
