<script setup lang="ts">
import { fetchConversations, findConversationById } from "~/services/api/chat/api";
import { IConversation } from "~/services/api/chat/type";
import { useConversationStore } from "~/stores/conversations";

const conv = ref<IConversation | null>(null);
const route = useRoute();
const conversationStore = useConversationStore();

async function getConversationInfor() {
  if (route.params.conv_id) {
    const con = await findConversationById(route.params.conv_id as string);
    con && conversationStore.change(con);
  } else {
    conversationStore.resetConv();
  }
}

onMounted(async () => {
  await conversationStore.init();
  getConversationInfor();
});
</script>

<template>
  <section class="flex flex-row w-full h-full">
    <PartialsChatLeftSection />
    <PartialsChatMainSection />
  </section>
</template>
