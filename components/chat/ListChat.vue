<script setup lang="ts">
import { IChatMessage } from "~/services/api/chat/type";

defineProps<{
  messages: IChatMessage[];
}>();
</script>

<template>
  <div class="w-full">
    <ChatItem v-for="item in messages" :key="item.id" :item="item" />
  </div>
</template>
