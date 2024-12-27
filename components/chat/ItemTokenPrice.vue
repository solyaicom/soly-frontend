<script setup lang="ts">
import { getTokenInfor } from "~/services/solana/utils";

const props = defineProps<{ output: any; inputs: any }>();

const token = ref<any>(null);
const usdPrice = computed(() => JSON.parse(props.output)?.data?.usd_price || 0);

onMounted(async () => {
  const tokenAddress = props.inputs?.address;
  if (tokenAddress) {
    token.value = await getTokenInfor(tokenAddress);
    console.log(token.value);
  }
});

function viewScanner(address: string) {
  window.open("https://solscan.io/address/" + address, "_blank");
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
