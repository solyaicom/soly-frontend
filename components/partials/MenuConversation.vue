<script setup lang="ts">
import { PopoverClose } from "radix-vue";
import { createNewConversation, fetchConversations } from "~/services/api/chat/api";
import { IConversation } from "~/services/api/chat/type";
import { useConversationStore } from "~/stores/conversations";

const props = defineProps<{
  onClick?: () => void;
}>();

const { getUser, logOut } = useAuthStore();
const conversationStore = useConversationStore();

const app = useAppSetting();
const loading = ref(false);
const selectAgentId = ref<string | undefined>(undefined);

async function onNewChat() {
  await conversationStore.newConversation(selectAgentId.value);
  selectAgentId.value = undefined;
}

function onConversationClick(item: IConversation) {
  loading.value = true;
  app.changeLoading(true);
  conversationStore.change(item);
  setTimeout(() => {
    app.changeLoading(false);
    loading.value = false;
  }, 400);
  props.onClick?.();
}

function onSelectAgent(agent_id: string) {
  selectAgentId.value = agent_id;
  onNewChat();
  props.onClick?.();
}

function onRenameItem() {
  console.log("rename");
}
</script>

<template>
  <section class="bg-[#131313] h-full w-full flex-col flex overflow-hidden">
    <div class="flex-1 overflow-hidden">
      <div class="p-6">
        <PartialsButton text="New Chat" :loading="loading" icon="/images/icon-add.svg" @click="onNewChat" />
      </div>
      <div class="flex-1 h-full flex flex-col overflow-hidden p-4 border-t-[1px] border-app-line1">
        <div class="h-full overflow-y-scroll pb-[150px]">
          <div>
            <div
              v-for="(item, idx) in app.agents"
              :key="item.id"
              @click="onSelectAgent(item.id)"
              class="row-center hover:bg-[#323232] cursor-pointer rounded-[12px] py-2 pl-3 mb-2"
            >
              <div class="w-[24px] h-[24px] rounded-full mr-3 flex-shrink-0">
                <img v-if="!!item.avatar_url" :src="item.avatar_url" class="w-[24px] h-[24px] rounded-full" />
              </div>
              <p class="text-[16px] font-[600] text-[#fff] flex-1">{{ item.name }}</p>
            </div>
          </div>
          <p class="font-[600] px-3 mt-4 mb-2">Chat History</p>
          <div
            v-for="(item, idx) in conversationStore.histories"
            :key="item.id"
            class="relative cursor-pointer group hover:text-[#FFFFFF] hover:bg-[#323232] rounded-[12px]"
            :class="{ 'bg-[#323232]': item.id === conversationStore.conv?.id }"
          >
            <div @click="onConversationClick(item)" class="row-center justify-between text-[16px] py-2 pl-3 pr-10 text-[#CACACA]">
              <p class="overflow-hidden whitespace-nowrap text-ellipsis flex-1">{{ item.name }}</p>
            </div>
            <div class="px-2 absolute top-2 right-0 invisible group-hover:visible z-[1]">
              <Popover>
                <PopoverTrigger>
                  <div>
                    <img src="/images/icon-option.svg" class="w-[24px]" />
                  </div>
                </PopoverTrigger>
                <PopoverContent>
                  <div class="bg-[#fff] rounded-[12px] p-4">
                    <PopoverClose>
                      <div class="row-center text-app-red cursor-pointer" @click="conversationStore.delete(item)">
                        <div class="w-[24px] h-[24px]">
                          <img src="/images/icon-delete.svg" class="w-[24px] h-[24px]" />
                        </div>
                        <p class="ml-2">Delete</p>
                      </div>
                    </PopoverClose>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="getUser()?.email"
      class="p-4 font-[600] overflow-hidden border-top-[1px] border-app-line1 italic"
      style="box-shadow: 14px 21px 40px 4px rgba(153, 70, 255, 0.34)"
    >
      <p>Address: {{ shortAddress(getUser().wallet.address) }}</p>
      <div class="row-center" @click="logOut">
        <img v-if="getUser().avatar_url" :src="getUser().avatar_url" class="w-[20px] h-[20px] mr-1 rounded-full" />
        <p class="w-full text-[12px] text-[#cacaca] overflow-hidden whitespace-nowrap text-ellipsis">Email: {{ getUser().email }}</p>
      </div>
    </div>
  </section>
</template>
