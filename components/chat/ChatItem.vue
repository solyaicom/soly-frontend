<script setup lang="ts">
import { IChatMessage } from "~/services/api/chat/type";

defineProps<{
  item: IChatMessage;
}>();
</script>

<template>
  <div class="w-full flex flex-col mt-8 px-3" :class="{ 'items-end ': item.role === 'user' }">
    <div class="flex flex-row" :class="{ 'py-3 px-4 rounded-[45px] border-[1px] border-[#FFFFFF1A]': item.role === 'user' }">
      <div v-if="item.role === 'assistant'" class="w-[32px] h-[32px] bg-[#FFFFFFCC] mr-2 rounded-full"></div>
      <div class="text-[#979797] text-[16px] mt-[2px] flex-1" :class="{ 'text-[#CACACA] mt-0': item.role === 'user' }">
        {{ item.content }}
      </div>
    </div>
  </div>
</template>
