<script setup lang="ts">
defineProps<{
  inputs: any;
  created_at: any;
}>();
</script>

<template>
  <div class="bg-app-card2">
    <div class="row-center justify-between">
      <img src="/images/icon-degen-tag.svg" />
      <span class="text-app-text2">{{ getTimeLabel(new Date(created_at).getTime()) }}</span>
    </div>
    <p class="text-app-text1 mt-1">
      🚀 ${{ inputs.token_info?.symbol }} has increased <strong>{{ formatNotationNumber(inputs.multiply, 2) }}x</strong> in
      {{
        inputs.first_message_time
          ? getTimeDurationLabel((new Date(created_at).getTime() - new Date(inputs.first_message_time).getTime()) / 1000, true)
          : ""
      }}, with market cap rising from
      <strong>{{ formatNotationNumber(inputs.first_market_cap, 0) }}</strong>
      to <strong>{{ formatNotationNumber(inputs.token_info?.usd_market_cap, 0) }}</strong>
    </p>
    <div class="bg-[url(/images/item-degen-background.png)] overflow-hidden bg-cover py-12 flex flex-col items-center rounded-[6px] mt-3">
      <p
        class="text-[40px] md:text-[56px] font-extrabold bg-gradient-to-r from-[#FFFEB4] from-[1%] via-[#F7E494] via-[30%] to-[#9D6C28] bg-clip-text text-transparent"
      >
        {{ formatNotationNumber(inputs.multiply, 2) }}x
      </p>
      <p class="font-extrabold bg-gradient-to-r from-[#9A9A9ADB] from-[1%] via-[#FFFFFFEE] via-[30%] to-[#9C9C9C] bg-clip-text text-transparent">
        To the Moon
      </p>
      <p class="font-[500] bg-gradient-to-r from-[#9A9A9ADB] from-[1%] via-[#FFFFFFEE] via-[30%] to-[#9C9C9C] bg-clip-text text-transparent">
        Market Cap rising from {{ formatNotationNumber(inputs.first_market_cap, 0) }} to
        {{ formatNotationNumber(inputs.token_info?.usd_market_cap, 0) }}
      </p>
    </div>
  </div>
</template>
