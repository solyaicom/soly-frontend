<script setup lang="ts">
import { IChatMessage } from "~/services/api/chat/type";
import markdownit from "markdown-it";
import ChatObservation from "./ChatObservation.vue";
import ItemActions from "./ItemActions.vue";
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
console.log(props.item);
const { getUser } = useAuthStore();
const conversationStore = useConversationStore();
const app = useAppSetting();

const currentAgent = computed(() => {
  return conversationStore.conv?.agent || app.agents[0];
});
</script>

<template>
  <div class="w-full row-center mt-8 px-3" :class="{ 'justify-end ': item.role === 'user' }">
    <div class="w-[94%] row-center overflow-hidden" :class="{ 'justify-end': item.role === 'user' }">
      <div
        class="flex flex-row max-w-full items-start"
        :class="{ 'py-2 px-4 rounded-[20px]  bg-[#323232d9]': item.role === 'user', 'w-full': item.role === 'assistant' }"
      >
        <div v-if="item.role === 'assistant'" class="w-[30px] h-[30px] md:w-[40px] md:h-[40px] mr-2 rounded-full overflow-hidden flex-shrink-0">
          <img :src="currentAgent?.avatar_url || '/images/icon-logo-mask.svg'" class="w-full" />
        </div>
        <div class="flex-1 flex flex-col items-start" :style="{ maxWidth: item.role === 'assistant' ? 'calc(100% - 38px)' : 'none' }">
          <ChatObservation v-if="item.data.observations" :observations="item.data.observations" />

          <div v-if="(thinking || !item.content) && item.role === 'assistant'" class="bg-[#323232d9] p-2 rounded-[8px]">
            <div className="dots h-6 w-10 rounded-full flex items-center justify-center flex-nowrap">
              <div className="dot h-2 w-2 mx-0.5 rounded-full bg-slate-600" />
              <div className="dot h-2 w-2 mx-0.5 rounded-full bg-slate-600" />
              <div className="dot h-2 w-2 mx-0.5 rounded-full bg-slate-600" />
            </div>
          </div>
          <div
            v-else
            class="markdown"
            :class="{
              'bg-app-card2 p-3 rounded-[8px] w-full': conversationStore.conv?.is_readonly,
            }"
            :style="{ maxWidth: item.role === 'assistant' ? 'calc(100% - 38px)' : 'none' }"
          >
            <div
              ref="contentRef"
              v-html="md.render(item.content)"
              class="text-[#ececec] text-[16px] break-words text-start w-full"
              :class="{
                'text-[#efefef] mt-0  ': item.role === 'user',
                'mt-[2px]': item.role === 'assistant',
              }"
            ></div>
          </div>
          <ItemActions v-if="item.role === 'assistant' && item.data?.actions" :actions="item.data.actions" />
        </div>
      </div>
    </div>
  </div>
</template>
