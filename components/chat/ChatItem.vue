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
const {getUser} = useAuthStore()

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
  <div class="w-full row-center mt-8 px-3" :class="{ 'justify-end ': item.role === 'user' }">
   <div class="w-[80%] row-center " :class="{'justify-end': item.role === 'user'}" >
    <div class="flex flex-row" :class="{ 'py-2 px-4 rounded-[20px]  bg-[#323232d9]': item.role === 'user' }">
      <div v-if="item.role === 'assistant'" class="w-[40px] h-[40px] border-[1px] border-app-line1  mr-2 rounded-full">
        <img src="/images/icon-logo-mask.svg" class="ml-[-2px]" />
      </div>
      <div ref="contentRef" class="text-[#ececec] text-[16px] flex-1 break-all text-start " :class="{ 'text-[#efefef] mt-0  ': item.role === 'user', 'mt-[2px]': item.role === 'assistant' }"></div>
     
    </div>
    <div v-if="item.role === 'user' && getUser().email" class="w-[36px] h-[36px] flex-shrink-0  mr-2 rounded-full overflow-hidden ml-2">
        <img :src="getUser().avatar_url" class="w-full h-full" />
      </div>
   </div>
  </div>
</template>
