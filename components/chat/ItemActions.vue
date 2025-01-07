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

  localStorage.setItem("newtab_message", content);
  window.open(`/c/${conv.id}`, "_blank");

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
  <div class="row-center gap-2 md:gap-3 max-w-full mt-2 md:mt-3 flex-wrap w-full">
    <button
      v-for="(action, idx) in actions"
      :key="idx"
      @click="onActionClick(action)"
      class="flex-1 min-w-fit sm:flex-none row-center py-2 px-3 md:px-6 bg-app-card2 rounded-[6px] justify-center"
    >
      {{ action.label }}
      <img src="/images/icon-arrow-link.svg" class="ml-2" />
    </button>
  </div>
</template>
