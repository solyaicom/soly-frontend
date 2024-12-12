<script setup lang="ts">
import { createNewConversation } from "~/services/api/chat/api";

const { getUser } = useAuthStore();
const app = useAppSetting();
const loading = ref(false);

async function onNewChat() {
  loading.value = true;
  app.changeLoading(true);
  const conv = await createNewConversation();
  navigateTo(`/chat?conv_id=${conv.id}`);
  app.changeLoading(false);
  loading.value = false;
}
</script>

<template>
  <section class="bg-[#131313] w-[0px] flex-col rounded-[16px] hidden lg:flex lg:mr-3 lg:w-64 overflow-hidden">
    <div class="p-4 flex-1">
      <PartialsButton text="New Chat" :loading="loading" icon="/images/icon-add.svg" @click="onNewChat" />
      <div class="flex-1 flex flex-col"></div>
    </div>
    <div class="p-4 font-[600] overflow-hidden border-top-[1px] border-app-line1" style="box-shadow: 14px 21px 40px 4px rgba(153, 70, 255, 0.34)">
      <p class="w-full overflow-hidden whitespace-nowrap text-ellipsis">Email: {{ getUser().email }}</p>
      <p>Address: {{ shortAddress(getUser().wallet.address) }}</p>
    </div>
  </section>
</template>
