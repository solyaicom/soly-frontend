<script setup lang="ts">
import { IChatMessage, IConversation } from "~/services/api/chat/type";
import { toast } from "../ui/toast";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { createNewConversation, fetchChatHistory } from "~/services/api/chat/api";

import { useConversationStore } from "~/stores/conversations";
import BotButton from "../conversation/BotButton.vue";
import BalanceButton from "./BalanceButton.vue";
import { checkMessageExpired, findQuoteIdFromMessage } from "~/services/api/chat/utils";

const messages = ref<IChatMessage[]>([]);
const currentMsg = ref<any>("");
const scrollArea = ref<HTMLDivElement | null>(null);
const loading = ref(false);
const conversationStore = useConversationStore();
const app = useAppSetting();
const currentContent = ref<string>("");
const solana = useSolana();
const actionExpired = ref(false);

const botThinking = ref(false);
const currentConversation = ref<IConversation | null>(null);
const route = useRoute();

const currentAgent = computed(() => {
  return conversationStore.conv?.agent || app.agents[0] || {};
});

const lastMsg = computed(() => {
  return messages.value[messages.value.length - 1];
});

watch(
  () => conversationStore.conv?.id,
  () => {
    loading.value = false;
    fetchListMessage();
    checkMessageFromStore();
  },
  { immediate: true }
);

function scrollToEnd(smooth = false) {
  setTimeout(() => {
    if (scrollArea.value) {
      if (!smooth) {
        scrollArea.value.scrollTop = scrollArea.value.scrollHeight + 300;
      } else {
        scrollArea.value.scrollTo({ top: scrollArea.value.scrollHeight, behavior: "smooth" });
      }
    }
  }, 150);
}

function checkMessageFromStore() {
  if (conversationStore.currentMessage) {
    sendContent(conversationStore.currentMessage, true);
    conversationStore.setCurrentMessage("");
  }
}

async function fetchListMessage() {
  const convId = conversationStore.conv?.id;
  if (!convId) {
    messages.value = [];
    return;
  }
  if (convId === currentConversation.value?.id) return;
  messages.value = [];
  currentConversation.value = conversationStore.conv;
  messages.value = convId ? await fetchChatHistory(convId) : [];
}

watch(
  () => messages.value.length,
  () => {
    scrollToEnd();
  }
);

async function onSendMessage(content: string, data?: { action?: "confirm_swap" | "cancel_swap"; params: { quote_id?: string; message_id: string } }) {
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
          console.log("observation", ev.data);
          if (!_currentMsg.data.observations) {
            _currentMsg.data.observations = [];
          }
          _currentMsg.data.observations.push(JSON.parse(ev.data));
          break;
        case "observation_update":
          console.log("observation_update", ev.data);
          _currentMsg.data.observations?.pop();
          _currentMsg.data.observations?.push(JSON.parse(ev.data));
          break;
        case "update_title":
          const newTitle = ev.data;
          conversationStore.change({ ...conv!, name: newTitle });
          break;
        case "message":
          const msg: IChatMessage = JSON.parse(ev.data);
          console.log("msg", msg);
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
            console.log(`${msg.role}: ${msg.content}`);
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

async function sendContent(content: string, fromSaved = false) {
  if (loading.value) return;
  let conv = conversationStore.conv;
  if (!fromSaved) {
    messages.value.push({ role: "user", id: "", content: content.trim(), completed: true, data: {} });
  }
  if (!conv?.id) {
    conv = await createNewConversation(conversationStore.currentAgent?.id);

    if (!conv)
      return toast({
        description: "Failed to create new conversation",
        duration: 3000,
      });
    currentConversation.value = conv;
    conversationStore.setCurrentMessage(content);
    conversationStore.change(conv, true);
    return;
  }

  onSendMessage(content.trim());
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

function makeTransactionAction(action: "confirm_swap" | "cancel_swap") {
  if (!lastMsg.value) return;
  const msg = lastMsg.value;
  if (checkMessageExpired(msg)) {
    actionExpired.value = true;
    return toast({
      description: "This action expired",
      duration: 5000,
    });
  }
  const content = action === "confirm_swap" ? "Confirm this action" : "Cancel this action";
  const quote_id = findQuoteIdFromMessage(msg);
  const msgId = msg.id;

  messages.value.push({ role: "user", id: "", content, completed: true, data: {} });
  onSendMessage(content, {
    action,
    params: { message_id: msgId || "", quote_id },
  });
}
</script>

<template>
  <section class="flex-1 h-full flex flex-col bg-[#1e1e1e] overflow-hidden">
    <BotButton />
    <div class="flex-1 overflow-hidden flex flex-col items-center">
      <div class="flex-1 flex flex-col items-center w-full md:w-[90%] overflow-hidden md:max-w-[768px] 2xl:max-w-[900px]">
        <div class="flex-1 flex flex-col justify-center w-full overflow-hidden">
          <div v-if="!messages.length" class="flex-1 flex flex-col items-center justify-center">
            <div class="row-center">
              <img :src="currentAgent?.avatar_url" class="w-[40px] h-[40px] mr-2 rounded-full" />
              <p class="text-[40px] font-[500]">{{ currentAgent?.name || "Soly AI" }}</p>
            </div>
            <p class="mt-4 text-center text-[16px] text-[#CACACA] px-4">
              {{ currentAgent.description || `👋 Hi, I'm ${currentAgent.name} — Chat with me` }}
            </p>
          </div>
          <div ref="scrollArea" v-else class="h-full w-full pt-4 pb-[100px] overflow-y-auto relative">
            <ChatListChat :messages="messages" :thinking="botThinking" />
            <ChatItem v-if="currentMsg" :item="currentMsg" :thinking="botThinking" />
          </div>
        </div>
        <div class="w-full px-3 pb-4">
          <div class="w-full flex flex-row items-start relative">
            <BalanceButton class="absolute top-[-60px] right-[0px] z-1" />

            <div
              v-if="!!findQuoteIdFromMessage(lastMsg) && !checkMessageExpired(lastMsg) && !actionExpired"
              class="p-6 w-full bg-[#141414] flex flex-col items-center justify-center"
            >
              <p class="text-[#979797] text-[16px]">Do you want {{ currentAgent?.name || "SolyAI" }} make this swap?</p>
              <div class="row-center mt-3">
                <div
                  class="font-[600] text-[16px] py-3 px-10 bg-[#1e1e1e] rounded-[6px] cursor-pointer"
                  @click="makeTransactionAction('cancel_swap')"
                >
                  Cancel
                </div>
                <p class="mx-4 font-[600] text-[16px]">/</p>
                <div
                  class="font-[600] text-[16px] py-3 px-10 bg-[#fff] rounded-[6px] text-[#131313] cursor-pointer"
                  @click="makeTransactionAction('confirm_swap')"
                >
                  Confirm
                </div>
              </div>
            </div>
            <div v-else class="w-full flex flex-row items-start relative">
              <div
                contenteditable
                @keyup="onKeyChange"
                @keydown="onKeyDown"
                id="promt-area"
                :placeholder="`Send a message to ${currentAgent?.name || 'SolyAI'}`"
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
  </section>
</template>

<style scoped>
[contenteditable][placeholder]:empty::before {
  color: #9b9b9b;
  content: attr(placeholder);
  display: block; /* For Firefox */
}
</style>
