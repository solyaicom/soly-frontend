<script setup lang="ts">
import { fetchTokenAssets } from "~/services/solana/helius-api";

const props = defineProps<{ output: any; inputs: any; token: any }>();

const token = ref<any>(props.token);
const usdPrice = convertToolOutput(props.output).usd_price;

onMounted(async () => {
  if (!token.value) {
    const _token = await fetchTokenAssets([props.inputs.address]);
    token.value = _token[0];
  }
});

function viewScanner(address: string) {
  window.open("https://gmgn.ai/sol/token/" + address, "_blank");
}
</script>

<template>
  <div v-if="token" class="row-center p-3 cursor-pointer">
    <div v-if="token.imageUrl" class="w-[48px] h-[48px] mr-2">
      <img :src="token.imageUrl" class="w-full h-full rounded-full" />
    </div>
    <div class="flex-1 flex flex-col items-start">
      <div class="row-center">
        <p class="text-[#cacaca] font-[600]">
          {{ token.name }} <span class="text-[#656565] text-[12px]">({{ token.symbol }})</span>
        </p>
      </div>
      <div class="row-center cursor-pointer w-auto" @click.stop="viewScanner(token.address)">
        <p class="text-[#979797]">{{ shortAddress(token.address) }}</p>
        <NuxtIcon name="icon-scanner" class="ml-1 text-[#979797]" />
      </div>
    </div>
    <div>
      <p class="text-[#cacaca] font-[600] text-[20px]">${{ formatNumber(usdPrice) }}</p>
    </div>
  </div>
</template>
