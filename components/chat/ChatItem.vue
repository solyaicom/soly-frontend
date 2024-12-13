<script setup lang="ts">
import { IChatMessage } from "~/services/api/chat/type";
import markdownit from "markdown-it";
const md = markdownit("commonmark", {
  html: true,
  breaks: true,
  linkify: true,
});

const contentRef = ref<any>(null);

const props = defineProps<{
  item: IChatMessage;
}>();

watch(
  [() => props.item.content, () => contentRef.value],
  () => {
    if (!props.item.content || !contentRef.value) return;
    const txt = md.render(props.item.content);
    contentRef.value.innerHTML = txt;
  },
  {
    immediate: true,
  }
);
</script>

<template>
  <div class="w-full flex flex-col mt-8 px-3" :class="{ 'items-end ': item.role === 'user' }">
    <div class="flex flex-row" :class="{ 'py-3 px-4 rounded-[45px] border-[1px] border-[#FFFFFF1A]': item.role === 'user' }">
      <div v-if="item.role === 'assistant'" class="w-[32px] h-[32px] bg-[#FFFFFFCC] mr-2 rounded-full"></div>
      <div ref="contentRef" class="text-[#979797] text-[16px] mt-[2px] flex-1" :class="{ 'text-[#CACACA] mt-0': item.role === 'user' }"></div>
    </div>
  </div>
</template>
