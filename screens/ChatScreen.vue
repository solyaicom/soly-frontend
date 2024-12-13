<script setup lang="ts">
import { toast } from "~/components/ui/toast";
import { createNewConversation, deleteConversationById, fetchConversations, findConversationById } from "~/services/api/chat/api";
import { IConversation } from "~/services/api/chat/type";

const conv = ref<IConversation | null>(null);
const route = useRoute();
const histories = ref<IConversation[]>([]);
const app = useAppSetting();

async function getConversationInfor() {
  if (route.params.conv_id) {
    const con = await findConversationById(route.params.conv_id as string);
    con && onChangeConversation(con);
  }
}

function onChangeConversation(con: IConversation, addNew?: boolean) {
  if (!con) return;
  if (addNew) histories.value.unshift(con);
  else {
    let existIndex = histories.value.findIndex((item) => item.id === con.id);
    if (existIndex > -1) histories.value[existIndex] = con;
  }

  conv.value = con;
  conv && window.history.replaceState({}, "", `/c/${con.id}`);
  document.title = con.name || "New Chat";
}

async function onDeleteConversation(deleteItem: IConversation) {
  app.changeLoading(true);
  const rs = await deleteConversationById(deleteItem.id);
  if (rs) {
    histories.value = histories.value.filter((item) => item.id !== deleteItem.id);
    if (deleteItem.id === conv.value?.id) {
      document.title = "New Chat";
      conv && window.history.replaceState({}, "", `/c`);
      conv.value = null;
    }
  } else {
    toast({
      description: "Delete conversation failer",
      duration: 3000,
    });
  }
  setTimeout(() => app.changeLoading(false), 300);
}

onMounted(async () => {
  histories.value = await fetchConversations();
  getConversationInfor();
});

function onChat() {
  if (!conv.value) return;
  histories.value = histories.value.filter((item) => item.id !== conv.value?.id);
  histories.value.unshift(conv.value);
}
</script>

<template>
  <section class="flex flex-row w-full h-full">
    <PartialsChatLeftSection @change-conversation="onChangeConversation" :histories="histories" @delete="onDeleteConversation" />
    <PartialsChatMainSection :conv="conv" @change-conversation="onChangeConversation" @chat="onChat" />
  </section>
</template>
