<script setup lang="ts">
import { createNewConversation, fetchConversations } from "~/services/api/chat/api";
import { IConversation } from "~/services/api/chat/type";

const props = defineProps<{
  onChangeConversation: (conv: IConversation) => void;
}>();

const { getUser } = useAuthStore();
const app = useAppSetting();
const loading = ref(false);
const histories = ref<IConversation[]>([]);

onMounted(async () => {
  histories.value = await fetchConversations();
});

async function onNewChat() {
  loading.value = true;
  app.changeLoading(true);
  const conv = await createNewConversation();
  if (conv) {
    props.onChangeConversation(conv);
  }
  app.changeLoading(false);
  loading.value = false;
}

function onConversationClick(item: IConversation) {
  props.onChangeConversation(item);
}

function onOptionClick() {
  console.log("option click");
}
</script>

<template>
  <section class="bg-[#131313] h-full w-[0px] flex-col rounded-[16px] hidden lg:flex lg:mr-3 lg:w-64 overflow-hidden">
    <div class="flex-1 overflow-hidden">
      <div class="p-6">
        <PartialsButton text="New Chat" :loading="loading" icon="/images/icon-add.svg" @click="onNewChat" />
      </div>
      <div class="flex-1 h-full flex flex-col overflow-hidden p-4 border-t-[1px] border-app-line1">
        <div class="h-full overflow-y-scroll">
          <p class="font-[600] px-3">Chat History</p>
          <div
            v-for="item in histories"
            :key="item.id"
            @click="onConversationClick(item)"
            class="cursor-pointer group row-center justify-between text-[16px] py-2 pl-3 text-[#CACACA] hover:text-[#FFFFFF]"
          >
            <p class="overflow-hidden whitespace-nowrap text-ellipsis">{{ item.name }}</p>
            <div class="px-2 invisible group-hover:visible" @click.stop="onOptionClick">
              <img src="/images/icon-option.svg" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="getUser()?.email"
      class="p-4 font-[600] overflow-hidden border-top-[1px] border-app-line1"
      style="box-shadow: 14px 21px 40px 4px rgba(153, 70, 255, 0.34)"
    >
      <p class="w-full overflow-hidden whitespace-nowrap text-ellipsis">Email: {{ getUser().email }}</p>
      <p>Address: {{ shortAddress(getUser().wallet.address) }}</p>
    </div>
  </section>
</template>
