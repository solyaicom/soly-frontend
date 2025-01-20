<script setup lang="ts">
// const props = defineProps<{ output: string }>();
// const data = convertToolOutput(props.output);
const selectedType = ref("spot");
const openFull = ref(false);
</script>

<template>
  <div class="p-3 bg-app-card2 space-y-3">
    <div class="row-center justify-between">
      <p>Deposit Amount</p>
      <div class="p-1 text-blue-500">Edit</div>
    </div>
    <div>
      <div class="sm:row-center space-y-3 sm:space-y-0 sm:space-x-3">
        <div class="flex-1">
          <div class="flex-1 bg-app-card1 p-4 rounded-[8px] row-center">
            <img src="/images/icon-logo-black.svg" class="w-[24px] h-[24px] md:w-[40px] md:h-[40px] rounded-full" />
            <input class="flex-1 bg-transparent outline-none ml-3 text-end" placeholder="0.00" />
          </div>
          <p class="text-app-text3 text-[12px] mt-1">
            Balance <span class="text-[#fff]"> {{ formatNumber(0.34233) }}</span>
          </p>
        </div>
        <div class="flex-1">
          <div class="flex-1 bg-app-card1 p-4 rounded-[8px] row-center">
            <img src="/images/icon-logo-black.svg" class="w-[24px] h-[24px] md:w-[40px] md:h-[40px] rounded-full" />
            <input class="flex-1 bg-transparent outline-none ml-3 text-end" placeholder="0.00" />
          </div>
          <p class="text-app-text3 text-[12px] mt-1">
            Balance <span class="text-[#fff]"> {{ formatNumber(0.34233) }}</span>
          </p>
        </div>
      </div>
    </div>
    <div class="line" />
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <p class="font-[600] text-app-text1">Select Volatility Strategy</p>
        <p class="text-app-text3 mt-1">
          Spot provides a uniform distribution that is versatile and risk adjusted, suitable for any type of market and conditions. This is similar to
          setting a CLMM price range.
        </p>
      </div>
      <div class="space-x-4 row-center justify-center">
        <button
          class="p-4 border-[1px] border-[#fff] rounded-[12px]"
          :class="{ 'bg-[#000]': selectedType === 'spot' }"
          @click="selectedType = 'spot'"
        >
          <img src="/images/icon-select-spot.svg" class="w-[90px] h-[30px]" />
          <p class="mt-3">Spot</p>
        </button>
        <button
          class="p-4 border-[1px] border-[#fff] rounded-[12px]"
          :class="{ 'bg-[#000]': selectedType === 'curve' }"
          @click="selectedType = 'curve'"
        >
          <img src="/images/icon-select-curve.svg" class="w-[90px] h-[30px]" />
          <p class="mt-3">Curve</p>
        </button>
        <button class="p-4 border-[1px] border-[#fff] rounded-[12px]" :class="{ 'bg-[#000]': selectedType === 'bid' }" @click="selectedType = 'bid'">
          <img src="/images/icon-select-bid-ask.svg" class="w-[90px] h-[30px]" />
          <p class="mt-3">Bid-Ask</p>
        </button>
      </div>
    </div>
    <div class="line" />
    <p class="font-[600] text-app-text1">Select Volatility Strategy</p>
    <div class="row-center text-app-text2">
      <p>Current Price</p>
      <NuxtIcon name="icon-about" class="ml-1" />
      <p class="ml-2 text-app-text1">3100.45 ETH/USDC</p>
    </div>
    <div class="space-y-3 sm:space-y-0 sm:row-center sm:space-x-3 font-[600] lg:text-[18px] overflow-hidden">
      <div class="basis-2/5 overflow-hidden">
        <p class="text-app-text2">Min Price</p>
        <div class="w-full row-center mt-1 bg-app-card0 rounded-[12px] border-[1px] border-app-line2">
          <input class="bg-transparent text-end p-4 flex-1" placeholder="0.00" />
          <p class="p-4 border-l-[1px] border-l-app-line2 w-[80px]">1.86%</p>
        </div>
      </div>
      <div class="basis-2/5 overflow-hidden">
        <p class="text-app-text2">Max Price</p>
        <div class="w-full row-center mt-1 bg-app-card0 rounded-[12px] border-[1px] border-app-line2">
          <input class="bg-transparent text-end p-4 flex-1" value="323.23" />
          <p class="p-4 border-l-[1px] border-l-app-line2 w-[80px]">1.86%</p>
        </div>
      </div>
      <div class="basis-1/5 overflow-hidden">
        <p class="text-app-text2">Num Bins</p>
        <div class="row-center mt-1 bg-app-card0 rounded-[12px] border-[1px] border-app-line2">
          <input class="bg-transparent text-end p-4 w-full outline-none" value="323.23" />
        </div>
      </div>
    </div>
    <Collapsible v-model:open="openFull" class="border border-app-line2 rounded-[8px]">
      <CollapsibleTrigger class="w-full">
        <div class="row-center w-full justify-between text-[12px] p-3">
          <div class="row-center text-app-text3">
            <NuxtIcon name="icon-about" />
            <p class="ml-1">SOL needed to create [1] positions: 0.05234434 SOL</p>
          </div>
          <div class="row-center">
            <p>{{ openFull ? "Hide" : "Show" }} cost details</p>
            <img src="/images/icon-arrow-down.svg" class="w-[16px] ml-1 duration-200" :class="openFull ? 'rotate-180' : 'rotate-0'" />
          </div>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent class="border-t border-t-app-line2 p-3 space-y-3 text-app-text1">
        <p class="">Positions</p>
        <div>
          <p class="text-[12px] text-app-text3">Positions needed for 69 bins</p>
          <p>[1] positions</p>
          <p class="mt-2 text-app-text3 text-[12px]">Positions rent</p>
          <div class="row-center">
            <p>[1] x 0.06 SOL = [0.0565152] SOL</p>
            <div class="ml-1 bg-app-card1 p-1 rounded-full text-[12px] uppercase text-app-text2">Refundable</div>
          </div>
        </div>
        <div class="line" />
        <p class="">Bins</p>
        <div>
          <p class="text-[12px] text-app-text3">Total bins count</p>
          <p>[69] Bins</p>
          <p class="mt-2 text-app-text3 text-[12px]">New bin array needed to create</p>
          <p>0 Bins</p>
          <div class="row-center mt-2 text-app-text3 text-[12px]">
            <p class="">New bin array cost</p>
            <NuxtIcon name="icon-about" class="text-[14px] ml-1" />
          </div>
          <div class="row-center">
            <p>[1] x 0.07 SOL = [0.0565152] SOL</p>
            <div class="ml-1 bg-app-card1 p-1 rounded-full text-[12px] uppercase text-app-text2">NON-Refundable</div>
          </div>
        </div>
        <div class="line" />
        <p class="">Transaction Fee</p>
        <div>
          <p class="text-[12px] text-app-text3">Number of transaction</p>
          <p>[1] Transactions</p>
          <p class="mt-2 text-app-text3 text-[12px]">Max Transaction Fee</p>
          <p>[1]x 0.00005 SOL = [0.00005] SOL</p>
        </div>
      </CollapsibleContent>
    </Collapsible>
    <div class="px-2 py-3 rounded-[8px] bg-app-cardWarning">We recommend keeping at least 0.05 SOL for any transaction.</div>
    <div class="px-2 py-3 rounded-[8px] bg-app-cardWarning row-center">
      <img src="/images/icon-error.svg" class="w-[16px]" />
      <p class="ml-2">Insufficient balance for [Token name]</p>
    </div>
  </div>
</template>

<style lang="css" scoped>
input {
  min-width: 0px;
  outline: 0px;
}
</style>
