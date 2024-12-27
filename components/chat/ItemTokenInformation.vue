<script setup lang="ts">
const props = defineProps<{ output: any }>();
console.log("item token information", props.output);
</script>

<template>
  <div>
    <div class="row-center bg-[#141414] p-3">
      <div class="w-[48px] h-[48px]"></div>
      <div class="flex-1 ml-2">
        <div class="row-center">
          <p class="text-[#cacaca] font-[600]">USDT</p>
        </div>
        <div class="row-center">
          <p class="text-[#979797]">{{ shortAddress("0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48") }}</p>
          <NuxtIcon name="icon-scanner" class="ml-1 text-[#979797]" />
        </div>
      </div>
    </div>
    <div class="row-center p-3 bg-[#1a1a1a]">
      <div class="flex-1 text-center border-r-[1px] border-r-[#FFFFFF1A]">
        <p class="text-[12px] text-[#656565]">Holders</p>
        <p class="text-[#cacaca] font-[600]">3.43M</p>
      </div>
      <div class="flex-1 text-center border-r-[1px] border-r-[#FFFFFF1A]">
        <p class="text-[12px] text-[#656565]">Total Liquidity</p>
        <p class="text-[#cacaca] font-[600]">3.43M</p>
      </div>
      <div class="flex-1 text-center">
        <p class="text-[12px] text-[#656565]">Total Supply</p>
        <p class="text-[#cacaca] font-[600]">3.43M</p>
      </div>
    </div>
  </div>
</template>
