<script setup lang="ts">
import {formatDate}     from "@vueuse/shared";
import {useMarkdownIt}  from "~/composables/useMarkdownIt";
import { IChatMessage } from "~/services/api/chat/type";
import ChatObservation  from "./ChatObservation.vue";
import ItemActions      from "./ItemActions.vue";
const md = useMarkdownIt()

const openPreview = ref(false);

const props = defineProps<{
  item: IChatMessage;
  thinking?: boolean;
  showPreDate?: boolean;
}>();
const conversationStore = useConversationStore();
const app = useAppSetting();

const currentConversation = computed(() => conversationStore.conv);
const isChannel = computed(() => !!currentConversation.value?.is_readonly)

const currentAgent = computed(() => {
  return conversationStore.conv?.agent || app.agents[0];
});

function getMessageTime(item: IChatMessage): string {
  if (!isChannel.value) {
    return ''
  }
  return `<p data-message-time title="${formatDate(new Date(item.created_at), 'YYYY-MM-DD HH:mm')}">${formatDate(new Date(item.created_at), 'HH:mm')}</p>`
}
</script>

<template>
  <div v-if="isChannel && showPreDate" class="flex justify-center">
    <div  class="mt-3 rounded-2xl bg-app-card2 inline-block px-3 py-1">{{ formatDate(new Date(item.created_at), 'YYYY-MM-DD') }}</div>
  </div>
  <div class="w-full row-center px-3" :class="{ 'justify-end ': item.role === 'user', 'mt-6': !showPreDate, 'mt-3': showPreDate }">
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
            <div class="dots h-6 w-10 rounded-full flex items-center justify-center flex-nowrap">
              <div class="dot h-2 w-2 mx-0.5 rounded-full bg-slate-600" />
              <div class="dot h-2 w-2 mx-0.5 rounded-full bg-slate-600" />
              <div class="dot h-2 w-2 mx-0.5 rounded-full bg-slate-600" />
            </div>
          </div>
          <div
            v-else
            class="markdown"
            :class="{
              'bg-app-card2 p-3 rounded-[8px] w-full': isChannel,
            }"
            :style="{ maxWidth: item.role === 'assistant' ? 'calc(100% - 38px)' : 'none' }"
          >
            <div
              v-if="item.data.reply_message"
              class="row-center bg-[#404040] px-3 pr-1 py-1 rounded-[6px] mb-2 border-l-[3px] border-l-[#fff]"
              @click="openPreview = true"
            >
              <div class="markdown flex-1 overflow-hidden line-clamp-2">
                <div
                  v-html="
                    md.render(item.data.reply_message.content)
                  "
                  class="text-[#ececec] text-[16px] break-words text-start w-full"
                  :class="{
                    'text-[#efefef] mt-0  ': item.role === 'user',
                    'mt-[2px]': item.role === 'assistant',
                  }"
                ></div>
              </div>
              <button class="row-center ml-6">
                SEE MORE
                <img src="/images/icon-chevron-right-light.svg" class="ml-1" />
              </button>
            </div>
            <div
              v-html="md.render(item.content) + getMessageTime(item)"
              class="text-[#ececec] text-[16px] break-words text-start"
              :class="{
                'text-[#efefef] mt-0  ': item.role === 'user',
                'mt-[2px]': item.role === 'assistant',
              }"
            />
          </div>
          <ItemActions v-if="item.role === 'assistant' && item.data?.actions" :actions="item.data.actions" />
        </div>
      </div>
    </div>
    <Dialog v-if="item.data.reply_message" v-model:open="openPreview">
      <DialogContent class="bg-[#141414] py-3 px-3 border-none max-h-[calc(100vh-100px)] overflow-scroll">
        <div class="flex-1 flex flex-col items-start" :style="{ maxWidth: item.role === 'assistant' ? 'calc(100% - 38px)' : 'none' }">
          <ChatObservation v-if="item.data.reply_message.data.observations" :observations="item.data.reply_message.data.observations" />

          <div class="markdown" :style="{ maxWidth: item.role === 'assistant' ? 'calc(100%-38px)' : 'none' }">
            <div
              v-html="md.render(item.data.reply_message.content)"
              class="text-[#ececec] text-[16px] break-words text-start w-full"
              :class="{
                'text-[#efefef] mt-0  ': item.role === 'user',
                'mt-[2px]': item.role === 'assistant',
              }"
            ></div>
          </div>
          <ItemActions v-if="item.role === 'assistant' && item.data.reply_message.data?.actions" :actions="item.data.reply_message.data.actions" />
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>
