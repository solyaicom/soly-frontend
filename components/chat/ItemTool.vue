<script setup lang="ts">
import { IObservation, ITool, TToolID } from "~/services/api/chat/type";
import ItemTokenSearch from "./ItemTokenSearch.vue";
import ItemTokenPrice from "./ItemTokenPrice.vue";
import { convertTokenOutput } from "~/utils";
import ItemSwapPreview from "./ItemSwapPreview.vue";
import ItemBalanceGet from "./ItemBalanceGet.vue";
import { MAPPING_TOOL_NAME } from "~/constants/chat-tool-mapping";
import ItemSwapResult from "./ItemSwapResult.vue";
import ItemTopHolder from "./ItemTopHolder.vue";
import ItemDevCheck from "./ItemDevCheck.vue";
import ItemTokenHoldingByHolder from "./ItemTokenHoldingByHolder.vue";
import ItemTopToken from "./ItemTopToken.vue";

const props = defineProps<{ tools: ITool[]; token?: any; completed?: boolean }>();

function checkError(output: string) {
  if (!props.completed) return false;
  if (!output || output?.includes("error:")) return true;

  if (output.includes('"error')) return true;
  return false;
}

function getTaskName(id: TToolID) {
  const taskName = MAPPING_TOOL_NAME[id];
  return taskName || "";
}
</script>

<template>
  <div v-for="(item, idx) in props.tools" :key="idx">
    <div v-if="!!getTaskName(item.id)" class="bg-[#141414] rounded-[6px] mb-2 w-full lg:w-[90%]">
      <div class="row-center p-2">
        <div class="w-[10px] h-[10px] mr-2">
          <img v-if="completed" :src="checkError(item.outputs) ? '/images/icon-task-failer.svg' : '/images/icon-task.svg'" class="w-full h-full" />
          <img v-else src="/images/icon-loading.gif" class="w-[14px]" />
        </div>
        <p class="font-[600] text-[#cacaca]">{{ getTaskName(item.id) }}</p>
      </div>
      <div v-if="completed" class="border-t-[1px] border-t-[#FFFFFF1A]">
        <div v-if="checkError(item.outputs)" class="row-center p-3">
          <div class="h-[48px] w-[48px] rounded-[6px] flex items-center justify-center bg-[#242424]">
            <img src="/images/icon-error.svg" class="w-[24px] h-[24px]" />
          </div>
          <p class="text-[#CACACA] font-[600] ml-2">Error</p>
        </div>
        <div v-else>
          <ItemTokenSearch v-if="item.id === 'dataset_4f7c1e48-f62d-4f75-bf3b-80d4167a50a9' && !!item.outputs" :output="item.outputs" />
          <ItemTokenPrice v-if="item.id === 'tokensaddressprice_get'" :token="token" :output="item.outputs" :inputs="item.inputs" />
          <ItemSwapPreview v-if="item.id === 'solyAiTradingQuoteAPIPost' && !!item.outputs" :output="item.outputs" />
          <ItemBalanceGet v-if="item.id === 'solyAiTradingBalanceGet' && !!item.outputs" :item="item" />
          <ItemSwapResult v-if="item.id === 'solyAiTradingQuoteExecutePost' && !!item.outputs" :output="item.outputs" />
          <ItemTopHolder v-if="item.id === 'tokensaddressaggtop-holders_get' && !!item.outputs" :output="item.outputs" />
          <ItemDevCheck v-if="item.id === 'tokensaddressaggdev-check_get' && !!item.outputs" :output="item.outputs" />
          <ItemTokenHoldingByHolder v-if="item.id === 'tokensaddressaggtop-holdersportfolio_get' && !!item.outputs" :output="item.outputs" />
          <ItemTopToken v-if="item.id === 'tokenstop_get' && !!item.outputs" :output="item.outputs" />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
thead td {
  padding-top: 8px;
  padding-bottom: 8px;
}
tbody td {
  border-top-width: 1px;
  border-top-color: rgba(255, 255, 255, 0.1);
  padding-top: 8px;
  padding-bottom: 8px;
}
</style>
