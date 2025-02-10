<script setup lang="ts">
import { IObservation, ITool, TToolID } from "~/services/api/chat/type";
import { MAPPING_TOOL_COMPONENT } from "~/constants/mapping-tool-component";

const props = defineProps<{ tools: ITool[]; token?: any; completed?: boolean; created_at: string; isPreview?: boolean }>();
function checkError(output: string) {
  if (!props.completed) return false;
  if (!output || output?.includes("error:")) return true;

  if (output.includes('"error')) return true;
  return false;
}

function checkHideTaskName(id: TToolID) {
  return !MAPPING_TOOL_COMPONENT[id].name;
}

function getTool(id: TToolID) {
  const tool = MAPPING_TOOL_COMPONENT[id];
  return tool;
}

function getComponentProps(id: TToolID, item: ITool) {
  const tool = MAPPING_TOOL_COMPONENT[id];

  // @ts-ignore
  const binding = tool.binding || null;
  const obj: any = {
    output: item.outputs,
  };
  if (!binding) return obj;

  Object.keys(binding).forEach((key) => {
    // @ts-ignore
    obj[key] = props[binding[key]] || item[binding[key]] || null;
  });
  return obj;
}
</script>

<template>
  <template v-for="(item, idx) in props.tools" :key="idx">
    <div v-if="!!getTool(item.id)" class="rounded-[6px] w-full" :class="{ 'bg-app-card2': !isPreview }">
      <div v-if="!checkHideTaskName(item.id)" class="row-center p-2">
        <div class="w-[10px] h-[10px] mr-2">
          <img v-if="completed" :src="checkError(item.outputs) ? '/images/icon-task-failer.svg' : '/images/icon-task.svg'" class="w-full h-full" />
          <img v-else src="/images/icon-loading.gif" class="w-[14px]" />
        </div>
        <p class="font-[600] text-[#cacaca]">{{ getTool(item.id).name }}</p>
      </div>
      <div v-if="completed" :class="{ 'border-t-[1px] border-t-[#FFFFFF1A]': !checkHideTaskName(item.id) }">
        <div v-if="checkError(item.outputs)" class="row-center p-3">
          <div class="h-[48px] w-[48px] rounded-[6px] flex items-center justify-center bg-[#242424]">
            <img src="/images/icon-error.svg" class="w-[24px] h-[24px]" />
          </div>
          <p class="text-[#CACACA] font-[600] ml-2">Error</p>
        </div>
        <div v-else-if="!!getTool(item.id)">
          <component :is="getTool(item.id).component" v-bind="getComponentProps(item.id, item)" />
        </div>
      </div>
    </div>
  </template>
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
