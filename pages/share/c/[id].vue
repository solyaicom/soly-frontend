<script setup lang="ts">
import BotButton from "~/components/conversation/BotButton.vue";
import { toast } from "~/components/ui/toast";
import { fetchPublicChatHistory, findPublicConversationById } from "~/services/api/chat/api";

const messages = ref<any[]>([]);
const fetching = ref(true);
const finish = ref(false);
const loadMore = ref(false);
const scrollArea = ref<HTMLDivElement | null>(null);
const currentScrollHeight = ref(0);
const route = useRoute();
const conversationStore = useConversationStore();

async function init() {
  if (finish.value) return;
  if (loadMore.value) return;
  loadMore.value = true;
  if (scrollArea.value) {
    currentScrollHeight.value = scrollArea.value?.scrollHeight;
  }
  const shareId = route.params.id;

  const msgs = shareId ? await fetchPublicChatHistory(shareId as string, { first_message_id: messages.value[0]?.id }) : [];
  if (msgs.length < 20) {
    finish.value = true;
  }

  messages.value.unshift(...msgs);
  fetching.value = false;
  nextTick(() => {
    loadMore.value = false;

    if (scrollArea.value) {
      scrollArea.value.scrollTop = scrollArea.value?.scrollHeight - currentScrollHeight.value;
    }
  });
}

async function getConversation() {
  const conv = await findPublicConversationById(route.params.id as string);
  if (!conv) {
    return toast({
      description: "Conversation not found",
      duration: 3000,
    });
  }
  conversationStore.setCurrentAgent(conv?.agent);
  conversationStore.conv = conv;
}

onMounted(async () => {
  await getConversation();
  init();
});
</script>

<template>
  <section class="flex flex-row w-full h-full">
    <div class="h-full w-[0px] flex-col hidden lg:flex lg:w-64 overflow-hidden">
      <PartialsMenuConversation />
    </div>
    <section class="flex-1 h-full flex flex-col bg-[#1e1e1e] overflow-hidden">
      <BotButton />

      <div class="flex-1 overflow-hidden flex flex-col items-center">
        <div class="flex-1 flex flex-col items-center w-full md:w-[90%] overflow-hidden md:max-w-[768px] 2xl:max-w-[900px]">
          <div class="flex-1 flex flex-col justify-center w-full overflow-hidden">
            <div v-if="fetching" class="flex-1 flex flex-col items-center justify-center">
              <img src="/images/icon-loading.gif" class="w-[24px]" />
            </div>
            <div ref="scrollArea" v-else-if="messages.length > 0" class="h-full w-full pt-4 pb-[100px] overflow-y-auto relative">
              <div class="flex-1 flex flex-col items-center justify-center mb-3" :class="loadMore ? 'opacity-1' : 'opacity-0'">
                <img src="/images/icon-loading.gif" class="w-[24px]" />
              </div>
              <ChatListChat :messages="messages" />
            </div>
          </div>
        </div>
      </div>
    </section>
  </section>
</template>
