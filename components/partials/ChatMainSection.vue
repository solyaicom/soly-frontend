<script setup lang="ts">
import { IChatMessage, IConversation } from "~/services/api/chat/type";
import { toast } from "../ui/toast";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { createNewConversation, fetchChatHistory } from "~/services/api/chat/api";

import { useConversationStore } from "~/stores/conversations";
import BotButton from "../conversation/BotButton.vue";
import BalanceButton from "./BalanceButton.vue";

const messages = ref<IChatMessage[]>([]);
const currentMsg = ref<any>("");
const scrollArea = ref<HTMLDivElement | null>(null);
const loading = ref(false);
const conversationStore = useConversationStore();
const app = useAppSetting();
const currentContent = ref<string>("");

const openBotInformation = ref(false);
const botThinking = ref(false);
const currentConversation = ref<IConversation | null>(null);

const currentAgent = computed(() => {
  return conversationStore.conv?.agent || app.agents[0];
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
        scrollArea.value.scrollTop = scrollArea.value.scrollHeight;
      } else {
        scrollArea.value.scrollTo({ top: scrollArea.value.scrollHeight, behavior: "smooth" });
      }
    }
  }, 70);
}

function checkMessageFromStore() {
  if (conversationStore.currentMessage) {
    sendContent(conversationStore.currentMessage, true);
    conversationStore.setCurrentMessage("");
  }
}

async function fetchListMessage() {
  if (!conversationStore.conv) {
    messages.value = [];
    return;
  }
  if (conversationStore.conv.id === currentConversation.value?.id) return;
  messages.value = [];
  currentConversation.value = conversationStore.conv;
  messages.value = conversationStore.conv.id ? await fetchChatHistory(conversationStore.conv.id) : [];
}

watch(
  () => messages.value.length,
  () => {
    scrollToEnd();
  }
);

async function onSendMessage(content: string) {
  if (loading.value) return;
  loading.value = true;
  let conv = conversationStore.conv;

  conversationStore.updateCurrentChat();

  const access_token = localStorage.getItem("access_token");
  const arrMsg: any[] = [];
  let rendering = false;
  await fetchEventSource(`${AppConfig.env.API_BASE_URL}/conversations/${conv?.id || ""}/chat`, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + access_token,
    },
    body: JSON.stringify({
      content: content || "What is the weather today?",
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
          const data = JSON.parse(ev.data);
          if (data) _currentMsg.content += data.value;
          break;
        case "finish":
          // messages.value.push({ ...currentMsg.value });
          currentMsg.value = null;
          loading.value = false;
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
  scrollToEnd(true);
}

function onSendClick() {
  const el = document.getElementById("promt-area");
  const content = el?.innerText || "";
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
</script>

<template>
  <section class="flex-1 h-full flex flex-col bg-[#1e1e1e] rounded-[16px] overflow-hidden">
    <BotButton />
    <div class="flex-1 overflow-hidden flex flex-col items-center">
      <div class="flex-1 flex flex-col items-center w-full md:w-[90%] overflow-hidden md:max-w-[768px]">
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
          <div ref="scrollArea" v-else class="h-full w-full pt-4 pb-10 overflow-y-auto relative">
            <ChatListChat :messages="messages" :thinking="botThinking" />
            <ChatItem v-if="currentMsg" :item="currentMsg" :thinking="botThinking" />
          </div>
        </div>
        <div class="w-full px-3 pb-4">
          <div class="w-full flex flex-row items-start relative">
            <BalanceButton class="absolute top-[-60px] right-[0px] z-1" />
            <div
              contenteditable
              @keyup="onKeyChange"
              @keydown="onKeyDown"
              id="promt-area"
              :placeholder="`Send a message to ${currentAgent?.name || 'SolyAI'}`"
              class="bg-transparent border-[1px] border-app-line1 min-h-[52px] flex-1 rounded-[30px] p-4 outline-none break-all"
            ></div>

            <div class="ml-3 cursor-pointer" @click="onSendClick">
              <img src="/images/icon-send.svg" />
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
