<script setup lang="ts">
import { IChatMessage, IConversation } from "~/services/api/chat/type";
import { toast } from "../ui/toast";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { createNewConversation, fetchChatHistory } from "~/services/api/chat/api";
import MenuConversation from "./MenuConversation.vue";
import { useConversationStore } from "~/stores/conversations";
import { PopoverClose } from "radix-vue";
import PopoverContent from "../ui/popover/PopoverContent.vue";
import PopoverTrigger from "../ui/popover/PopoverTrigger.vue";
import Popover from "../ui/popover/Popover.vue";
import BotInformation from "../conversation/BotInformation.vue";

const messages = ref<any[]>([]);
const currentMsg = ref<any>("");
const scrollArea = ref<any>(null);
const loading = ref(false);
const currentConversation = ref<IConversation | null>(null);
const conversationStore = useConversationStore();
const openSheet = ref(false);
const app = useAppSetting();
const currentContent = ref<string>("");

const openBotMenu = ref(false);
const openBotInformation = ref(false);

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
  messages.value = await fetchChatHistory(conversationStore.conv.id);
}

watch(
  () => messages.value.length,
  () => {
    setTimeout(() => {
      if (!scrollArea.value) return;
      scrollArea.value.scrollTop = scrollArea.value?.scrollHeight || 0;
    }, 100);
  }
);

async function onSendMessage(content: string) {
  if (loading.value) return;
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
    }),
    onmessage(ev) {
      switch (ev.event) {
        case "error":
          toast({
            description: JSON.parse(ev.data).error,
            duration: 5000,
          });
          loading.value = false;
          break;
        case "update_title":
          const newTitle = ev.data;
          conversationStore.change({ ...conv!, name: newTitle });
          break;
        case "message":
          const msg: IChatMessage = JSON.parse(ev.data);
          currentMsg.value = msg;
          if (msg.role === "user") return;

          if (msg.completed && msg.id) {
            messages.value.push({ ...currentMsg.value });

            // printMessage(msg);
          } else {
            console.log(`${msg.role}: ${msg.content}`);
          }

          break;
        case "delta":
          const data = JSON.parse(ev.data);
          currentMsg.value.content += data.value;
          break;
        case "finish":
          messages.value.push({ ...currentMsg.value });
          currentMsg.value = null;
          loading.value = false;
          break;
      }
      if (scrollArea.value) {
        setTimeout(() => {
          scrollArea.value.scrollTop = scrollArea.value.scrollHeight;
        }, 100);
      }
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
    messages.value.push({ role: "user", content: content.trim() });
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
  if (scrollArea.value) {
    setTimeout(() => {
      scrollArea.value.scrollTop = scrollArea.value.scrollHeight;
    }, 100);
  }
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

function onItemMenuClick() {
  openSheet.value = false;
}
</script>

<template>
  <section class="flex-1 h-full flex flex-col bg-[#1e1e1e] rounded-[16px] overflow-hidden">
    <div class="h-[60px] lg:h-[104px] row-center border-b-[1px] border-b-app-line1">
      <Sheet v-model:open="openSheet">
        <SheetTrigger>
          <div class="pl-4 py-2 cursor-pointer lg:hidden">
            <img src="/images/icon-menu.svg" /></div
        ></SheetTrigger>
        <SheetContent side="left" class="p-0">
          <MenuConversation @click="onItemMenuClick" />
        </SheetContent>
      </Sheet>

      <Popover v-model:open="openBotMenu">
        <PopoverTrigger>
          <div class="row-center p-3 bg-[#323232] rounded-[12px] ml-4">
            <div class="w-[24px] h-[24px] mr-2 rounded-full overflow-hidden">
              <img :src="currentAgent?.avatar_url" class="w-[24px] h-[24px]" />
            </div>
            <p class="text-[16px] font-[600]">{{ currentAgent?.name || "Soly AI" }}</p>
            <img src="/images/icon-arrow-down.svg" class="ml-2" />
          </div>
        </PopoverTrigger>
        <PopoverContent>
          <div class="bg-[#323232] rounded-[12px] p-4">
            <div
              class="row-center cursor-pointer"
              @click="
                () => {
                  openBotMenu = false;
                  openBotInformation = true;
                }
              "
            >
              <img src="/images/icon-about.svg" class="w-[20px] h-[20px]" />
              <p class="ml-2 text-[16px]">About</p>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
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
          <div ref="scrollArea" v-else class="h-full w-full pt-4 pb-10 overflow-y-scroll">
            <ChatListChat :messages="messages" />
            <ChatItem v-if="currentMsg" :item="currentMsg" />
          </div>
        </div>
        <div class="w-full px-3 pb-4">
          <div class="w-full flex flex-row items-start relative">
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
    <BotInformation :open="openBotInformation" @close="openBotInformation = false" />
  </section>
</template>

<style scoped>
[contenteditable][placeholder]:empty::before {
  color: #9b9b9b;
  content: attr(placeholder);
  display: block; /* For Firefox */
}
</style>
