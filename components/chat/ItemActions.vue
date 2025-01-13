<script setup lang="ts">
import { createNewConversation } from "~/services/api/chat/api";
import { IAction } from "~/services/api/chat/type";
import { toast } from "../ui/toast";

const props = defineProps<{
  actions: IAction;
}>();
</script>

<template>
  <div class="row-center gap-2 md:gap-3 max-w-full mt-2 md:mt-3 flex-wrap w-full">
    <a
      v-for="(action, idx) in actions"
      :key="idx"
      :href="action.type === 'agent_chat' ? `/c?agent_id=${action.params.agent_id}&initial_message=${action.params.initial_message}` : action.url"
      :target="action.type === 'agent_chat' ? '_blank' : action.target"
    >
      <div class="flex-1 min-w-fit sm:flex-none row-center py-2 px-3 md:px-6 bg-app-card2 rounded-[6px] justify-center">
        {{ action.label }}
        <img src="/images/icon-arrow-link.svg" class="ml-2" />
      </div>
    </a>
  </div>
</template>
