<script setup lang="ts">
import { IObservation } from "~/services/api/chat/type";
import ItemTool from "./ItemTool.vue";

const props = defineProps<{ observations: IObservation[]; created_at: string; isPreview?: boolean }>();

const token = computed(() => {
  let findOutputToken = "";
  props.observations.forEach((item) => {
    item.tools?.forEach((tool) => {
      if (tool.name.includes("dataset_")) {
        findOutputToken = tool.outputs;
      }
    });
  });
  if (!findOutputToken) return null;
  const _token = convertToolOutput(findOutputToken);
  return _token.map((item: any) => ({
    ...item,
    imageUrl: item.icon,
  }));
});
</script>

<template>
  <div v-for="(obs, idx1) in props.observations" :key="idx1" class="w-full space-y-2" :class="{ 'min-w-[250px]': !isPreview }">
    <ItemTool :tools="obs.tools" :token="token?.[0]" :completed="obs.completed" :created_at="created_at" :is-preview="isPreview" />
  </div>
</template>
