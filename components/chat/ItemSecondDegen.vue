<script setup lang="ts">
const props = defineProps<{
  input: any;
}>();
</script>

<template>
  <div class="bg-[url(/images/item-degen-background.png)] overflow-hidden bg-cover py-12 flex flex-col items-center rounded-[6px]">
    <p
      class="text-[40px] md:text-[56px] font-extrabold bg-gradient-to-r from-[#FFFEB4] from-[1%] via-[#F7E494] via-[30%] to-[#9D6C28] bg-clip-text text-transparent"
    >
      {{ formatNotationNumber(props.input.multiply, 2) }}x
    </p>
    <p class="font-extrabold bg-gradient-to-r from-[#9A9A9ADB] from-[1%] via-[#FFFFFFEE] via-[30%] to-[#9C9C9C] bg-clip-text text-transparent">
      To the Moon
    </p>
    <p class="font-[500] bg-gradient-to-r from-[#9A9A9ADB] from-[1%] via-[#FFFFFFEE] via-[30%] to-[#9C9C9C] bg-clip-text text-transparent">
      Market Cap rising from {{ formatNotationNumber(props.input.first_market_cap, 0) }} to
      {{ formatNotationNumber(props.input.token_info?.usd_market_cap, 0) }}
    </p>
  </div>
</template>
