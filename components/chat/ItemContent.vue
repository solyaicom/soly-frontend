<script setup lang="ts">
import { formatDate } from "@vueuse/shared";
import { useMarkdownIt } from "~/composables/useMarkdownIt";
import { IChatMessage } from "~/services/api/chat/type";
import ChatObservation from "./ChatObservation.vue";
import ItemActions from "./ItemActions.vue";
const md = useMarkdownIt();

defineProps<{
  item: IChatMessage;
  thinking?: boolean;
  showPreDate?: boolean;
  isPreview?: boolean;
}>();
const conversationStore = useConversationStore();

const currentConversation = computed(() => conversationStore.conv);
const isChannel = computed(() => !!currentConversation.value?.id.endsWith("-channel"));

function getMessageTime(item: IChatMessage): string {
  if (!isChannel.value) {
    return "";
  }
  return `<p data-message-time title="${formatDate(new Date(item.created_at), "YYYY-MM-DD HH:mm")}">${getTimeLabel(
    new Date(item.created_at).getTime()
  )}</p>`;
}
</script>

<template>
  <div class="flex-1 flex flex-col items-start">
    <div class="flex-1 flex flex-col items-start max-w-full space-y-2" :class="{ 'bg-app-card2 p-3 rounded-[8px] w-full': isChannel && !isPreview }">
      <ChatObservation v-if="item.data.observations" :observations="item.data.observations" :created_at="item.created_at" :is-preview="isPreview" />

      <div v-if="(thinking || (!item.content && !item.completed)) && item.role === 'assistant'" class="bg-[#323232d9] p-2 rounded-[8px]">
        <div class="dots h-6 w-10 rounded-full flex items-center justify-center flex-nowrap">
          <div class="dot h-2 w-2 mx-0.5 rounded-full bg-slate-600" />
          <div class="dot h-2 w-2 mx-0.5 rounded-full bg-slate-600" />
          <div class="dot h-2 w-2 mx-0.5 rounded-full bg-slate-600" />
        </div>
      </div>
      <div
        v-else-if="item.content"
        class="markdown max-w-full"
        :class="{
          'w-full ': isChannel,
        }"
      >
        <div
          v-html="md.render(item.content) + getMessageTime(item)"
          class="text-[#ececec] text-[16px] break-words text-start"
          :class="{
            'text-[#efefef] mt-0  ': item.role === 'user',
            'mt-[2px]': item.role === 'assistant',
          }"
        />
      </div>
    </div>
    <ItemActions v-if="item.role === 'assistant' && item.data?.actions" :actions="item.data.actions" />
  </div>
</template>
