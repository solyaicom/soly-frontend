<script setup lang="ts">
import { createNewConversation } from "~/services/api/chat/api";
import { IAction } from "~/services/api/chat/type";
import { toast } from "../ui/toast";

const props = defineProps<{
  actions: IAction;
}>();

const app = useAppSetting();
const conversationStore = useConversationStore();

async function onSendContent(content: string, agent_id: string) {
  if (!agent_id)
    return toast({
      description: "Failed to execute action, agent not found!",
      duration: 4000,
    });
  app.changeLoading(true);
  const conv = await createNewConversation(agent_id);

  if (!conv)
    return toast({
      description: "Failed to create new conversation",
      duration: 3000,
    });
  conversationStore.setMessages([
    {
      completed: true,
      content: content,
      id: "",
      role: "user",
      data: {},
    },
  ]);
  conversationStore.setCurrentMessage(content);
  conversationStore.change(conv, true);
  setTimeout(() => {
    app.changeLoading(false);
  }, 200);
}
function onActionClick(action: IAction) {
  if (action.type === "agent_chat") return onSendContent(action.params.initial_message, action.params.agent_id);
  if (action.type === "url") {
    window.open(action.params.url, action.params.target);
  }
}
</script>

<template>
  <div class="mt-3">
    <div class="row-center">
      <button v-for="(action, idx) in actions" :key="idx" @click="onActionClick(action)" class="row-center py-2 px-6 bg-app-card2 rounded-[6px] mr-3">
        {{ action.label }}
        <img src="/images/icon-arrow-link.svg" class="ml-2" />
      </button>
    </div>
  </div>
</template>
