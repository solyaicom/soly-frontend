<script setup lang="ts">
import { IObservation, ITool, TToolName } from "~/services/api/chat/type";
import ItemTokenSearch from "./ItemTokenSearch.vue";
import ItemTokenPrice from "./ItemTokenPrice.vue";
import ItemTokenInformation from "./ItemTokenInformation.vue";
import { convertTokenOutput } from "~/utils";
import ItemSwapPreview from "./ItemSwapPreview.vue";
import ItemBalanceGet from "./ItemBalanceGet.vue";
import { MAPPING_TOOL_NAME } from "~/constants/chat-tool-mapping";
import ItemSwapResult from "./ItemSwapResult.vue";

const props = defineProps<{ tools: ITool[]; token?: any; completed?: boolean }>();

function checkError(output: string) {
  if (!props.completed) return false;
  if (!output || output?.includes("error:")) return true;

  if (output.includes('"error')) return true;
  return false;
}

function getTaskName(name: TToolName) {
  const taskName = MAPPING_TOOL_NAME[name];
  if (taskName) return taskName;
  if (name.includes("dataset_")) return "Search Token Address";
  return "";
}
</script>

<template>
  <div v-for="(item, idx) in props.tools" :key="idx">
    <div v-if="!!getTaskName(item.name)" class="bg-[#141414] rounded-[6px] mb-2 w-[83%]">
      <div class="row-center p-2">
        <div class="w-[10px] h-[10px] mr-2">
          <img v-if="completed" :src="checkError(item.outputs) ? '/images/icon-task-failer.svg' : '/images/icon-task.svg'" class="w-full h-full" />
          <img v-else src="/images/icon-loading.gif" class="w-[14px]" />
        </div>
        <p class="font-[600] text-[#cacaca]">{{ getTaskName(item.name) }}</p>
      </div>
      <div v-if="completed" class="border-t-[1px] border-t-[#FFFFFF1A]">
        <div v-if="checkError(item.outputs)" class="row-center p-3">
          <div class="h-[48px] w-[48px] rounded-[6px] flex items-center justify-center bg-[#242424]">
            <img src="/images/icon-error.svg" class="w-[24px] h-[24px]" />
          </div>
          <p class="text-[#CACACA] font-[600] ml-2">Error</p>
        </div>
        <div v-else>
          <ItemTokenSearch v-if="item.name.includes('dataset_') && !!item.outputs" :output="item.outputs" />
          <ItemTokenPrice v-if="item.name === 'tokensaddressprice_get'" :token="token" :output="item.outputs" :inputs="item.inputs" />
          <ItemTokenInformation v-if="item.name === 'tokensaddressinfo_get' && !!item.outputs" :token="token" :output="item.outputs" />
          <ItemSwapPreview v-if="item.name === 'solyAiTradingQuoteAPIPost' && !!item.outputs" :output="item.outputs" />
          <ItemBalanceGet v-if="item.name === 'solyAiTradingBalanceGet' && !!item.outputs" :item="item" />
          <ItemSwapResult v-if="item.name === 'solyAiTradingQuoteExecutePost' && !!item.outputs" :output="item.outputs" />
        </div>
      </div>
    </div>
  </div>
</template>
