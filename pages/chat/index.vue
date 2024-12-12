<script setup lang="ts">
import { createNewConversation, findConversationById } from "~/services/api/chat/api";
import { IConversation } from "~/services/api/chat/type";

const conv = ref<IConversation | null>(null);
const route = useRoute();

async function getConversationInfor() {
  if (route.query.conv_id) {
    conv.value = await findConversationById(route.query.conv_id as string);
    document.title = conv.value?.name || "";
  } else {
    if (!conv.value) {
      conv.value = await createNewConversation();
    }
  }
}

watch(() => route.query.conv_id, getConversationInfor, { immediate: true });
</script>

<template>
  <section class="flex flex-row w-full h-full">
    <PartialsChatLeftSection />
    <PartialsChatMainSection :conv="conv" />
  </section>
</template>
