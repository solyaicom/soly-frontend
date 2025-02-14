<script setup lang="ts">
import { IChatMessage, IConversation } from "~/services/api/chat/type";
import { toast } from "../ui/toast";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { createNewConversation, fetchChatHistory } from "~/services/api/chat/api";

import { useConversationStore } from "~/stores/conversations";
import BotButton from "../conversation/BotButton.vue";
import BalanceButton from "./BalanceButton.vue";
import { checkMessageExpired, findActionIdFromMessage, getActionByTool } from "~/services/api/chat/utils";

const currentMsg = ref<any>("");
const scrollArea = ref<HTMLDivElement | null>(null);
const loading = ref(false);
const fetching = ref(true);
const loadMore = ref(false);
const finish = ref(false);
const conversationStore = useConversationStore();
const app = useAppSetting();
const currentContent = ref<string>("");
const solana = useSolana();
const actionExpired = ref(false);

const botThinking = ref(false);
const currentConversationID = computed(() => conversationStore.convID);
const currentConversation = computed(() => conversationStore.conv);
const route = useRoute();
const autoSroll = ref(true);
const showDelegate = ref(false);

const currentAgent = computed(() => {
  return conversationStore.conv?.agent || app.agents[0] || {};
});
const currentScrollHeight = ref(0);

const messages = computed(() => conversationStore.messages);

const lastMsg = computed(() => {
  return messages.value[messages.value.length - 1];
});

watch(
  () => currentConversationID.value,
  async () => {
    loading.value = false;

    await fetchListMessage();
    checkMessageFromStore();
    setTimeout(() => {
      fetching.value = false;
    }, 150);
  },
  { immediate: true }
);

watch(
  () => conversationStore.currentMessage,
  () => {
    if (fetching.value || !conversationStore.currentMessage || !conversationStore.convID) return;
    console.log("new message");
    checkMessageFromStore();
  }
);

onMounted(() => {
  nextTick(() => checkMessageFromNewtab());
});

watch(scrollArea, () => {
  scrollArea.value && scrollArea.value?.addEventListener("scroll", handleScroll);
});

onBeforeUnmount(() => {
  scrollArea.value && scrollArea.value.removeEventListener("scroll", handleScroll);
});

async function onLoadMore() {
  if (fetching.value) return;
  if (finish.value) return;
  if (loadMore.value) return;
  if (messages.value[0].id === "") return;
  if (conversationStore.messages.length < 20) return;
  loadMore.value = true;
  if (scrollArea.value) {
    currentScrollHeight.value = scrollArea.value?.scrollHeight;
  }
  const msgs = currentConversationID.value ? await fetchChatHistory(currentConversationID.value, { first_message_id: messages.value[0].id }) : [];
  if (msgs.length < 20) {
    finish.value = true;
  }

  messages.value.unshift(...msgs);
  nextTick(() => {
    loadMore.value = false;

    if (scrollArea.value) {
      scrollArea.value.scrollTop = scrollArea.value?.scrollHeight - currentScrollHeight.value;
    }
  });
}

function handleScroll(e: any) {
  if (scrollArea.value) {
    const scrollTop = scrollArea.value.scrollTop;
    const scrollHeight = scrollArea.value?.scrollHeight;
    const windowHeight = window.innerHeight;
    // console.log("scrollTOp", scrollTop, scrollHeight, scrollArea.value.clientHeight);

    if (scrollTop < 200) onLoadMore();
    // autoSroll.value = scrollTop >= scrollHeight - scrollArea.value.clientHeight - 30;
  }
}

function scrollToEnd(smooth = false) {
  nextTick(() => {
    if (scrollArea.value && autoSroll.value) {
      if (!smooth) {
        scrollArea.value.scrollTop = scrollArea.value.scrollHeight + 300;
      } else {
        scrollArea.value.scrollTo({ top: scrollArea.value.scrollHeight, behavior: "smooth" });
      }
    }
  });
}

function checkMessageFromStore() {
  if (conversationStore.currentMessage) {
    sendContent(conversationStore.currentMessage);
    conversationStore.setCurrentMessage("");
  }
}

async function checkMessageFromNewtab() {
  if (route.query.initial_message && route.query.agent_id) {
    const _conv = await createNewConversation(route.query.agent_id.toString());
    if (_conv) {
      conversationStore.change(_conv, true);
      sendContent(route.query.initial_message!.toString());
    }
  }
}

async function fetchListMessage() {
  try {
    const convId = currentConversationID.value;
    finish.value = false;
    if (!convId) {
      finish.value = true;
      // conversationStore.setMessages([]);
      return;
    }
    if (convId && !conversationStore.currentMessage) {
      // conversationStore.setMessages([]);
      fetching.value = true;
      const msgs = convId ? await fetchChatHistory(convId) : [];
      msgs.length < 20 && (finish.value = true);
      msgs.length > 0 && conversationStore.setMessages(msgs);
    }
  } finally {
  }
}

watch(
  () => [messages.value.length, autoSroll.value, scrollArea.value],
  (newValue) => {
    scrollArea.value && !loadMore.value && autoSroll.value && scrollToEnd();
  }
);

async function onSendMessage(content: string, data?: { action?: string; params: { quote_id?: string; action_id?: string; message_id: string } }) {
  if (loading.value) return;
  actionExpired.value = false;
  loading.value = true;
  let conv = conversationStore.conv;

  conversationStore.updateCurrentChat();

  const access_token = localStorage.getItem("access_token");
  await fetchEventSource(`${AppConfig.env.API_BASE_URL}/conversations/${conv?.id || ""}/chat`, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + access_token,
    },
    body: JSON.stringify({
      content: content || "What is the weather today?",
      data,
    }),
    openWhenHidden: true,
    onmessage(ev) {
      const _currentMsg = messages.value[messages.value.length - 1];
      switch (ev.event) {
        case "error":
          toast({
            description: JSON.parse(ev.data).error,
            duration: 5000,
          });
          loading.value = false;
          break;
        case "observation":
          console.log("observation", JSON.parse(ev.data));
          if (!_currentMsg.data.observations) {
            _currentMsg.data.observations = [];
          }
          _currentMsg.data.observations.push(JSON.parse(ev.data));
          break;
        case "observation_update":
          console.log("observation_update", JSON.parse(ev.data));

          _currentMsg.data.observations?.pop();
          _currentMsg.data.observations?.push(JSON.parse(ev.data));
          break;
        case "update_title":
          const newTitle = ev.data;
          conversationStore.change({ ...conv!, name: newTitle });
          break;
        case "message":
          const msg: IChatMessage = JSON.parse(ev.data);

          currentMsg.value = msg;

          if (msg.role === "user") return;
          if (msg.role === "assistant" && !msg.id) {
            botThinking.value = true;
            break;
          }
          botThinking.value = false;

          if (msg.id) {
            currentMsg.value = null;
            messages.value.push({ ...msg });

            // printMessage(msg);
          } else {
          }

          break;
        case "delta":
          const delta = JSON.parse(ev.data);
          if (delta) _currentMsg.content += delta.value;
          break;
        case "finish":
          // messages.value.push({ ...currentMsg.value });
          currentMsg.value = null;
          loading.value = false;
          _currentMsg.completed = true;
          if (data?.action === "confirm_swap") {
            solana.refresh();
          }
          break;
      }
      scrollToEnd(true);
    },
    onclose() {
      // if the server closes the connection unexpectedly, retry:
      loading.value = false;

      return;
    },
    onerror(err) {
      toast({
        description: err.message,
        duration: 5000,
      });
      loading.value = false;

      throw err; // rethrow to stop the operation
    },
  });
}

async function sendContent(content: string) {
  if (!content) return;

  if (loading.value) return;

  let conv = conversationStore.conv;

  if (!conv?.id) {
    conversationStore.setCurrentMessage(content);

    conv = await createNewConversation(conversationStore.currentAgent?.id);

    if (!conv)
      return toast({
        description: "Failed to create new conversation",
        duration: 3000,
      });
    return conversationStore.change(conv, true);
  }
  messages.value.push({ role: "user", id: "", content: content.trim(), completed: true, data: {}, created_at: new Date().toISOString() });

  return onSendMessage(content.trim());
}

function onSendClick() {
  const el = document.getElementById("promt-area");
  const content = (el?.innerText || "").trim();
  if (!content) return;
  if (el) {
    el.innerHTML = "";
  }
  sendContent(content || "");
}

function onKeyChange(e: any) {
  const content = e.target.innerText.trim() || "";
  currentContent.value = content;
  if (e.target.innerText.trim() === "") {
    e.target.innerHTML = "";
    return;
  }

  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();

    if (loading.value) {
      return;
    }
    e.target.innerHTML = "";
    sendContent(content || "");
  }
}

function onKeyDown(e: any) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
  }
}

function makeTransactionAction(action: "confirm" | "cancel") {
  if (!lastMsg.value) return;
  const msg = lastMsg.value;
  if (checkMessageExpired(msg)) {
    actionExpired.value = true;
    return toast({
      description: "This action expired",
      duration: 5000,
    });
  }
  const actionCode = getActionByTool(msg);
  const content = action === "confirm" ? "Confirm this action" : "Cancel this action";
  const id = findActionIdFromMessage(msg);
  const msgId = msg.id;

  messages.value.push({ role: "user", id: "", content, completed: true, data: {}, created_at: new Date().toISOString() });
  onSendMessage(content, {
    action: `${action}_${actionCode}`,
    params: { message_id: msgId || "", quote_id: id, action_id: id },
  });
  if (action === "confirm") {
    setTimeout(() => {
      solana.refresh();
    }, 6000);
  }
}
</script>

<template>
  <section class="flex-1 h-full flex flex-col bg-[#1e1e1e] overflow-hidden">
    <BotButton />
    <div class="flex-1 overflow-hidden flex flex-col items-center">
      <div class="flex-1 flex flex-col items-center w-full md:w-[90%] overflow-hidden md:max-w-[768px] 2xl:max-w-[900px]">
        <div class="flex-1 flex flex-col justify-center w-full overflow-hidden">
          <div v-if="fetching || !currentAgent.id" class="flex-1 flex flex-col items-center justify-center">
            <img src="/images/icon-loading.gif" class="w-[24px]" />
          </div>
          <div ref="scrollArea" v-else-if="messages.length > 0" class="h-full w-full pt-4 pb-[100px] overflow-y-auto relative">
            <div class="flex-1 flex flex-col items-center justify-center mb-3" :class="loadMore ? 'opacity-1' : 'opacity-0'">
              <img src="/images/icon-loading.gif" class="w-[24px]" />
            </div>
            <ChatListChat :messages="messages" :thinking="botThinking" />
            <ChatItem v-if="currentMsg" :item="currentMsg" :thinking="botThinking" />
          </div>
          <div v-else class="flex-1 flex flex-col items-center justify-center">
            <div class="row-center">
              <img :src="currentAgent?.avatar_url" class="w-[40px] h-[40px] mr-2 rounded-full" />
              <p class="text-[40px] font-[500]">{{ currentAgent?.name || "Soly AI" }}</p>
            </div>
            <p class="mt-4 text-center text-[16px] text-[#CACACA] px-4">
              {{ currentAgent.description || `👋 Hi, I'm ${currentAgent.name} — Chat with me` }}
            </p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 w-full px-10">
              <div
                @click="sendContent(suggest.message)"
                v-for="(suggest, idx) in currentAgent.metadata?.suggested_messages || []"
                :key="idx"
                class="w-full text-[#CACACA] px-4 py-2 rounded-[4px] border-[1px] border-app-line1 cursor-pointer hover:bg-app-card1"
              >
                <p class="line-clamp-1">{{ suggest.message }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="w-full px-3 pb-4">
          <div class="w-full flex flex-row items-start relative">
            <BalanceButton class="absolute top-[-60px] right-[0px] z-1" />

            <div
              v-if="
                lastMsg.completed &&
                !!findActionIdFromMessage(lastMsg) &&
                !checkMessageExpired(lastMsg) &&
                !actionExpired &&
                !conversationStore.hideChat
              "
              class="p-6 w-full bg-[#141414] flex flex-col items-center justify-center"
            >
              <p class="text-[#979797] text-[16px]">Do you want {{ currentAgent?.name || "SolyAI" }} make this action?</p>
              <div class="row-center mt-3">
                <div class="font-[600] text-[16px] py-3 px-10 bg-[#1e1e1e] rounded-[6px] cursor-pointer" @click="makeTransactionAction('cancel')">
                  Cancel
                </div>
                <p class="mx-4 font-[600] text-[16px]">/</p>
                <button
                  class="font-[600] text-[16px] py-3 px-10 bg-[#fff] rounded-[6px] text-[#131313] cursor-pointer"
                  :class="conversationStore.disableAction ? 'opacity-50' : ''"
                  @click="showDelegate = true"
                  :disabled="conversationStore.disableAction"
                >
                  Confirm
                </button>
              </div>
            </div>
            <div v-else-if="!currentConversation?.is_readonly && !conversationStore.hideChat" class="w-full flex flex-row items-start relative">
              <div
                contenteditable
                @keyup="onKeyChange"
                @keydown="onKeyDown"
                id="promt-area"
                :data-placeholder="`Send a message to ${currentAgent?.name || 'SolyAI'}`"
                class="bg-transparent border-[1px] border-app-line1 min-h-[52px] flex-1 rounded-[30px] p-4 outline-none break-all"
              ></div>

              <div class="absolute bottom-4 right-4 cursor-pointer z-1" @click="onSendClick">
                <img src="/images/icon-send.svg" />
              </div>
            </div>
          </div>
          <p class="mt-5 text-center text-[#CDCDCD] text-[12px]">Please consider checking important information! This is not investment advice.</p>
        </div>
      </div>
    </div>
    <PrivyDelegateWallet
      v-if="showDelegate"
      @success="makeTransactionAction('confirm')"
      @error="toast({ description: 'Something went wrong', duration: 3000 })"
    />
  </section>
</template>

<style scoped>
[contenteditable][data-placeholder]:empty::before {
  color: #9b9b9b;
  content: attr(data-placeholder);
  display: block; /* For Firefox */
}
</style>
