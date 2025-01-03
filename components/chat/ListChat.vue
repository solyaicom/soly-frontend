<script setup lang="ts">
import {formatDate}     from "@vueuse/shared";
import { IChatMessage } from "~/services/api/chat/type";

defineProps<{
  messages: IChatMessage[];
}>();

function isSameDate(a: string, b: string): boolean {
  return formatDate(new Date(a), 'YYYY-MM-DD') == formatDate(new Date(b), 'YYYY-MM-DD')
}

</script>

<template>
  <div class="w-full">
    <ChatItem v-for="(item, index) in messages" :key="item.id" :item="item" :show-pre-date="index == 0 || !isSameDate(messages[index - 1].created_at, item.created_at)" />
  </div>
</template>
