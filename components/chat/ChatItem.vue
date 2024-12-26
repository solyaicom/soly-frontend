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
  thinking?: boolean;
}>();
const { getUser } = useAuthStore();
const conversationStore = useConversationStore();
const app = useAppSetting();

const currentAgent = computed(() => {
  return conversationStore.conv?.agent || app.agents[0];
});
</script>

<template>
  <div class="w-full row-center mt-8 px-3" :class="{ 'justify-end ': item.role === 'user' }">
    <div class="w-[80%] row-center" :class="{ 'justify-end': item.role === 'user' }">
      <div class="flex flex-row" :class="{ 'py-2 px-4 rounded-[20px]  bg-[#323232d9]': item.role === 'user' }">
        <div v-if="item.role === 'assistant'" class="w-[40px] h-[40px] mr-2 rounded-full overflow-hidden flex-shrink-0">
          <img :src="currentAgent?.avatar_url || '/images/icon-logo-mask.svg'" class="w-[40px] h-[40px]" />
        </div>
        <div v-if="thinking" class="bg-[#323232d9] p-2 rounded-[8px]">
          <div className="dots h-6 w-10 rounded-full flex items-center justify-center flex-nowrap">
            <div className="dot h-2 w-2 mx-0.5 rounded-full bg-slate-600" />
            <div className="dot h-2 w-2 mx-0.5 rounded-full bg-slate-600" />
            <div className="dot h-2 w-2 mx-0.5 rounded-full bg-slate-600" />
          </div>
        </div>
        <div v-else class="markdown">
          <div
            ref="contentRef"
            v-html="md.render(item.content)"
            class="text-[#ececec] text-[16px] flex-1 break-words text-start"
            :class="{ 'text-[#efefef] mt-0  ': item.role === 'user', 'mt-[2px]': item.role === 'assistant' }"
          ></div>
        </div>
      </div>
      <div v-if="item.role === 'user' && getUser().email" class="w-[36px] h-[36px] flex-shrink-0 mr-2 rounded-full overflow-hidden ml-2">
        <img :src="getUser().avatar_url" class="w-full h-full" />
      </div>
    </div>
  </div>
</template>
