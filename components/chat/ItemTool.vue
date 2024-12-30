<script setup lang="ts">
import { IObservation, ITool } from "~/services/api/chat/type";
import ItemTokenSearch from "./ItemTokenSearch.vue";
import ItemTokenPrice from "./ItemTokenPrice.vue";
import ItemTokenInformation from "./ItemTokenInformation.vue";
import { convertTokenOutput } from "~/utils";

const props = defineProps<{ tools: ITool[]; token?: any }>();

function getTaskName(name: string) {
  if (name === "tokensaddressinfo_get") {
    return "Search Token Address";
  }
  if (name === "tokensaddressprice_get") {
    return "Search Token Price";
  }
  return "Search Token Information";
}
</script>

<template>
  <div v-for="(item, idx) in props.tools" :key="idx">
    <div class="bg-[#141414] rounded-[6px] mb-2 w-[80%]">
      <div class="row-center border-b-[1px] border-b-[#FFFFFF1A] p-2">
        <div class="w-[10px] h-[10px] mr-2">
          <img src="/images/icon-task.svg" class="w-full h-full" />
        </div>
        <p class="font-[600] text-[#cacaca]">{{ getTaskName(item.name) }}</p>
      </div>
      <div>
        <ItemTokenSearch v-if="item.name.includes('dataset_') && !!item.outputs" :output="item.outputs" />
        <ItemTokenPrice v-if="item.name === 'tokensaddressprice_get'" :token="token" :output="item.outputs" :inputs="item.inputs" />
        <ItemTokenInformation v-if="item.name === 'tokensaddressinfo_get' && !!item.outputs" :token="token" :output="item.outputs" />
      </div>
    </div>
  </div>
</template>
