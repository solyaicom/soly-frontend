<script setup lang="ts">
import { IObservation } from "~/services/api/chat/type";
import ItemTool from "./ItemTool.vue";

const props = defineProps<{ observations: IObservation[] }>();
onMounted(() => {
  console.log("search token address");
});
</script>

<template>
  <div v-for="(obs, idx1) in props.observations" :key="idx1" class="w-[370px] md:w-[450px]">
    <div v-for="(item, idx2) in obs.tools || []" :key="idx2">
      <ItemTool :item="item" />
    </div>
  </div>
</template>
