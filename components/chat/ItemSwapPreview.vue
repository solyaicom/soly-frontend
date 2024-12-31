<script setup lang="ts">
import { fetchTokenAssets } from "~/services/solana/helius-api";
import { IFullToken } from "~/services/solana/type";

const props = defineProps<{ output: string; error?: boolean }>();
const inputToken = ref<IFullToken | null>(null);
const outputToken = ref<IFullToken | null>(null);
const quoteId = ref<string>("");
const plans = ref<any[]>([]);
const listOutToken = ref<IFullToken[]>([]);

onMounted(async () => {
  if (props.output) {
    let outputStr = props.output || "";
    if (outputStr.endsWith(".")) {
      outputStr = outputStr.slice(0, -1);
    }
    const [outputStrReal] = outputStr.split("tool response: ");

    const outputs = JSON.parse(outputStrReal).output;
    const expire = outputs.expire_at;
    const _plans = outputs.plans || ([] as any[]);
    const mints = _plans.map((pl: any) => pl.output_mint);
    const tokens = await fetchTokenAssets([_plans[0].input_mint, ...mints]);
    inputToken.value = tokens[0];
    outputToken.value = tokens[tokens.length - 1];
    listOutToken.value = tokens;
    plans.value = _plans;
  }
});
</script>

<template>
  <div class="flex items-center justify-center">
    <div v-if="!inputToken || !outputToken" class="p-3">
      <img src="/images/icon-loading.gif" class="w-[24px] h-[24px]" />
    </div>
    <div v-else class="bg-[#141414] p-3 rounded-[6px] w-full">
      <div class="flex flex-col items-center justify-center">
        <div class="row-center bg-[#1a1a1a] p-4 rounded-[12px] w-full justify-between">
          <p class="text-[20px] md:text-[24px] font-[600]">{{ plans[0].in_amount_float }} {{ inputToken?.symbol }}</p>
          <div class="w-[30px] md:w-[40px] rounded-full overflow-hidden">
            <img :src="inputToken?.imageUrl" class="h-full w-full" />
          </div>
        </div>
        <div class="row-center bg-[#1a1a1a] p-4 mt-3 rounded-[12px] w-full justify-between">
          <p class="text-[20px] md:text-[24px] font-[600]">{{ formatNumber(plans[plans.length - 1].out_amount_float) }} {{ outputToken?.symbol }}</p>
          <div class="w-[30px] md:w-[40px] rounded-full overflow-hidden">
            <img :src="outputToken?.imageUrl" class="h-full w-full" />
          </div>
        </div>
        <div class="absolute z-[1]">
          <img src="/images/icon-swap.svg" />
        </div>
      </div>
      <div class="mt-4 space-y-3 text-[#cacaca]">
        <div class="row-center justify-between">
          <p>Gas Fee</p>
          <p class="text-[#b0b0b0]">~0.00005 SOL</p>
        </div>
        <div class="row-center justify-between">
          <p>Slippage</p>
          <p class="text-[#b0b0b0]">0.5%</p>
        </div>
        <div class="row-center justify-between">
          <p>Exchange</p>
          <div class="row-center">
            <span class="ml-[2px] text-[#b0b0b0]">{{ plans[0].label }}</span>
          </div>
        </div>
        <div class="row-center justify-between">
          <p>Router</p>
          <p class="text-[#b0b0b0]">{{ listOutToken.map((t) => t.symbol).join(" > ") }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
