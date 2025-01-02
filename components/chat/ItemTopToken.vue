<script setup lang="ts">
const props = defineProps<{ output: string }>();
const data = JSON.parse(props.output).data;

function viewScanner(address: string) {
  window.open("https://solscan.io/address/" + address, "_blank");
}
</script>

<template>
  <div class="p-3 bg-app-card1 rounded-b-[6px]">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div v-for="(token, index) in data.items" :key="index" class="rounded-[6px] border-[1px] border-app-line2 pb-3">
        <div class="row-center mt-3 px-4">
          <img :src="token.image_url" class="w-[32px] rounded-full" />
          <div class="flex-1 ml-2">
            <div>
              <span class="text-app-text1 font-[600]">{{ token.name }}</span>
              <span class="ml-1 text-app-text3 text-[12px]">{{ token.symbol }}</span>
            </div>
            <div class="row-center text-app-text2 cursor-pointer" @click="viewScanner(token.address)">
              <p>{{ shortAddress(token.address) }}</p>
              <NuxtIcon name="icon-scanner" class="text-[14px] ml-1" />
            </div>
          </div>
          <!-- <div class="row-center">
            <img src="/images/icon-up.svg" />
            <span class="text-app-green2">{{ formatNotationNumber("120") }}%</span>
          </div> -->
        </div>
        <!-- <div class="row-center grid grid-cols-2 mt-3 px-4 py-3 bg-app-background">
          <div class="text-center">
            <p class="text-app-text3 text-[12px]">Market Cap</p>
            <p class="mt-1 text-app-text1 font-[600]">$3.43M</p>
          </div>
          <div class="text-center border-l-[1px] border-l-app-line1">
            <p class="text-app-text3 text-[12px]">24h Volume</p>
            <p class="mt-1 text-app-text1 font-[600]">$3.43M</p>
          </div>
        </div>
        <div class="row-center grid grid-cols-3 mt-3">
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
