<script setup lang="ts">
definePageMeta({
  layout: "chat",
});
import { createNewConversation, findConversationById } from "~/services/api/chat/api";
import { IConversation } from "~/services/api/chat/type";

const conv = ref<IConversation | null>(null);
const route = useRoute();

async function getConversationInfor() {
  if (route.query.conv_id) {
    conv.value = await findConversationById(route.query.conv_id as string);
  } else {
    if (!conv.value) {
      conv.value = await createNewConversation();
    }
  }
  conv.value && window.history.replaceState({}, "", `/chat?conv_id=${conv.value.id}`);
  document.title = conv.value?.name || "";
}

watch(() => route.query.conv_id, getConversationInfor, { immediate: true });
</script>

<template>
  <section class="flex flex-row w-full h-full">
    <PartialsChatLeftSection />
    <PartialsChatMainSection :conv="conv" />
  </section>
</template>
