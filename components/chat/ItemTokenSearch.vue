<script setup lang="ts">
import { convertTokenOutput } from "~/utils";

const props = defineProps<{ output: string }>();
const data = computed(() => convertTokenOutput(props.output));

function onCopy(address: string) {
  copyToClipboard(address);
}

function viewScanner(address: string) {
  window.open("https://solscan.io/address/" + address, "_blank");
}
</script>

<template>
  <div>
    <div
      v-for="(token, idx) in data"
      :key="idx"
      class="row-center border-t-[1px] border-t-transparent p-3 cursor-pointer"
      :class="{ 'border-t-[#FFFFFF1A]': idx !== 0 }"
      @click="onCopy(token.address)"
    >
      <div v-if="token.icon" class="w-[48px] h-[48px] mr-2">
        <img :src="token.icon" class="w-full h-full rounded-full" />
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
        <NuxtIcon name="icon-copy" class="text-[#979797]" />
      </div>
    </div>
  </div>
</template>
