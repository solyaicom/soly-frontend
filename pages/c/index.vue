<script setup lang="ts">
definePageMeta({
  layout: "conversation",
});
import { createNewConversation, fetchConversations, findConversationById } from "~/services/api/chat/api";
import { IConversation } from "~/services/api/chat/type";

const conv = ref<IConversation | null>(null);
const route = useRoute();
const histories = ref<IConversation[]>([]);

async function getConversationInfor() {
  if (route.query.conv_id) {
    conv.value = await findConversationById(route.query.conv_id as string);
  }
}

function onChangeConversation(con: IConversation, addNew?: boolean) {
  if (!con) return;
  if (addNew) histories.value.unshift(con);

  conv.value = con;
  conv && window.history.replaceState({}, "", `/c?conv_id=${con.id}`);
  document.title = con.name || "New Chat";
}

onMounted(async () => {
  getConversationInfor();
  histories.value = await fetchConversations();
});
</script>

<template>
  <section class="flex flex-row w-full h-full">
    <PartialsChatLeftSection @change-conversation="onChangeConversation" :histories="histories" />
    <PartialsChatMainSection :conv="conv" @change-conversation="onChangeConversation" />
  </section>
</template>
