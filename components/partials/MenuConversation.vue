<script setup lang="ts">
import { PopoverClose } from "radix-vue";
import { createNewConversation, fetchConversations } from "~/services/api/chat/api";
import { IAgent, IConversation } from "~/services/api/chat/type";
import { useConversationStore } from "~/stores/conversations";
import UserInfor from "./UserInfor.vue";

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
  conversationStore.init(item.id);
  setTimeout(() => {
    app.changeLoading(false);
    loading.value = false;
  }, 400);
  props.onClick?.();
}

function onSelectAgent(agent: IAgent) {
  selectAgentId.value = agent.id;
  conversationStore.setCurrentAgent(agent);
  conversationStore.change(undefined);
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
              @click="onSelectAgent(item)"
              class="row-center hover:bg-[#323232] cursor-pointer rounded-[12px] py-2 pl-3 mb-2"
            >
              <div class="w-[24px] h-[24px] rounded-full mr-3 flex-shrink-0">
                <img v-if="!!item.avatar_url" :src="item.avatar_url" class="w-[24px] h-[24px] rounded-full" />
              </div>
              <p class="text-[16px] font-[600] text-[#fff] flex-1">{{ item.name }}</p>
            </div>
          </div>
          <div class="line"></div>
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
    <UserInfor />
  </section>
</template>
