<script setup lang="ts">
import { createNewConversation } from "~/services/api/chat/api";

const conv = ref<any>(null);
const route = useRoute();

onMounted(async () => {
  console.log("route.params", route.query);
  if (!conv.value) {
    conv.value = await createNewConversation();
    console.log("conv.value", conv.value);
  }
});
</script>

<template>
  <section class="flex flex-row w-full h-full"></section>
</template>
