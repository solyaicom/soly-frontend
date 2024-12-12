<script setup lang="ts">
import { IChatMessage } from "~/services/api/chat/type";
import { toast } from "../ui/toast";
import { fetchEventSource } from "@microsoft/fetch-event-source";

const props = defineProps<{
  conv: any;
}>();
const messages = ref<any[]>([]);
const currentMsg = ref<any>("");
const scrollArea = ref<any>(null);

async function onSendMessage(content: string) {
  if (!props.conv) {
    return toast({
      description: "No conversation exist",
      duration: 3000,
    });
  }
  const access_token = localStorage.getItem("access_token");
  if (!access_token) {
    return toast({
      description: "Please login first",
      duration: 3000,
    });
  }
  await fetchEventSource(`https://s-ai-agent-api.stavax.io/conversations/${props.conv.id}/chat`, {
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
          scrollArea.value.scrollTop = scrollArea.value.scrollHeight;
      }
    },
  });
}

function onKeyChange(e: any) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    onSendMessage(e.target.innerHTML);
    messages.value.push({ type: "user", message: e.target.value });
    e.target.innerHTML = "";
    scrollArea.value.scrollTop = scrollArea.value.scrollHeight;
  }
}
</script>

<template>
  <section class="flex-1 h-full flex flex-col bg-[#131313] rounded-[16px] overflow-hidden">
    <div class="h-[60px] lg:h-[104px] row-center border-b-[1px] border-b-app-line1">
      <img src="/images/icon-logo-row.svg" />
    </div>
    <div class="flex-1 overflow-hidden flex flex-col items-center">
      <div class="flex-1 flex flex-col items-center w-full lg:w-[750px] overflow-hidden">
        <div class="flex-1 w-full overflow-hidden">
          <div v-if="!messages.length" class="flex-1 flex flex-col items-center justify-center">
            <img src="/images/icon-logo-row.svg" />
            <p class="mt-10 text-center">
              Tether IOTA siacoin revain digibyte. Kadena waves gala terra shiba-inu nexo litecoin bancor. Digibyte stacks revain secret solana
              polygon arweave. Nexo cardano binance tether tether. Neo nexo terraUSD secret litecoin compound revain polygon litecoin THETA.
            </p>
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
              class="border-[1px] border-app-line1 min-h-[52px] flex-1 rounded-[30px] p-4 outline-none"
            ></div>
            <div class="ml-3 cursor-pointer">
              <img src="/images/icon-send.svg" />
            </div>
          </div>
          <p class="mt-5 text-center text-[#CDCDCD] text-[12px]">Please consider checking important information! This is not investment advice.</p>
        </div>
      </div>
    </div>
  </section>
</template>
