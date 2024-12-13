<script setup lang="ts">
import { IChatMessage, IConversation } from "~/services/api/chat/type";
import { toast } from "../ui/toast";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { createNewConversation, fetchChatHistory } from "~/services/api/chat/api";
import MenuConversation from "./MenuConversation.vue";
import { useConversationStore } from "~/stores/conversations";

const messages = ref<any[]>([]);
const currentMsg = ref<any>("");
const scrollArea = ref<any>(null);
const loading = ref(false);
const currentConversation = ref<IConversation | null>(null);
const conversationStore = useConversationStore();
const openSheet = ref(false);

watch(() => conversationStore.conv?.id, fetchListMessage, { immediate: true });

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
  let conv = conversationStore.conv;

  if (!conversationStore.conv) {
    conv = await createNewConversation();
    if (!conv)
      return toast({
        description: "Failed to create new conversation",
        duration: 3000,
      });
    currentConversation.value = conv;
    conversationStore.change(conv, true);
  }
  if (!conv)
    return toast({
      description: "Failed to create new conversation",
      duration: 3000,
    });
  const access_token = localStorage.getItem("access_token");
  if (!access_token) {
    return toast({
      description: "Please login first",
      duration: 3000,
    });
  }
  loading.value = true;
  conversationStore.updateCurrentChat();

  await fetchEventSource(`${AppConfig.env.API_BASE_URL}/conversations/${conv?.id || ""}/chat`, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + access_token,
    },
    body: JSON.stringify({
      content: content || "What is the weather today?",
    }),
    onmessage(ev) {
      scrollArea.value.scrollTop = scrollArea.value.scrollHeight;
      switch (ev.event) {
        case "update_title":
          const newTitle = ev.data;
          conversationStore.change({ ...conv, name: newTitle });
          break;
        case "message":
          const msg: IChatMessage = JSON.parse(ev.data);
          currentMsg.value = msg;

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
    },
    onclose() {
      // if the server closes the connection unexpectedly, retry:
      console.log("fetch err");
      return;
    },
    onerror(err) {
      throw err; // rethrow to stop the operation
    },
  });
}

function sendContent(content: string) {
  onSendMessage(content);
  messages.value.push({ type: "user", message: content });
  scrollArea.value.scrollTop = scrollArea.value?.scrollHeight;
}

function onSendClick() {
  const el = document.getElementById("promt-area");
  const content = el?.innerHTML || "";
  sendContent(content);
}

function onKeyChange(e: any) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    if (loading.value) return;
    sendContent(e.target.innerHTML || "");

    e.target.innerHTML = "";
  }
}
</script>

<template>
  <section class="flex-1 h-full flex flex-col bg-[#131313] rounded-[16px] overflow-hidden">
    <div class="h-[60px] lg:h-[104px] row-center border-b-[1px] border-b-app-line1">
      <Sheet v-model="openSheet">
        <SheetTrigger>
          <div class="pl-4 py-2 cursor-pointer lg:hidden">
            <img src="/images/icon-menu.svg" /></div
        ></SheetTrigger>
        <SheetContent side="left" class="p-0">
          <MenuConversation @click="() => (openSheet = false)" />
        </SheetContent>
      </Sheet>
      <img src="/images/icon-logo-row.svg" />
    </div>
    <div class="flex-1 overflow-hidden flex flex-col items-center">
      <div class="flex-1 flex flex-col items-center w-full md:w-[90%] overflow-hidden md:max-w-[640px]">
        <div class="flex-1 flex flex-col justify-center w-full overflow-hidden">
          <div v-if="!messages.length" class="flex-1 flex flex-col items-center justify-center">
            <p class="text-[40px] font-[500]">Soly AI</p>
            <p class="mt-4 text-center text-[24px] font-[600] text-[#CACACA]">👋 Hi, I'm Soly — Chat with me</p>
          </div>
          <div ref="scrollArea" v-else class="h-full w-full pt-4 pb-10 overflow-y-scroll">
            <ChatListChat :messages="messages" />
            <ChatItem v-if="currentMsg" :item="currentMsg" />
          </div>
        </div>
        <div class="w-full px-3 pb-4">
          <div class="w-full flex flex-row items-start">
            <div
              contenteditable
              @keydown="onKeyChange"
              id="promt-area"
              class="border-[1px] border-app-line1 min-h-[52px] flex-1 rounded-[30px] p-4 outline-none break-all"
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
