<script setup lang="ts">
import { PopoverClose } from "radix-vue";

import { IAgent, IConversation } from "~/services/api/chat/type";
import { useConversationStore } from "~/stores/conversations";
import UserInfor from "./UserInfor.vue";

const props = defineProps<{
  onClick?: () => void;
}>();

const conversationStore = useConversationStore();

const app = useAppSetting();
const { getUser } = useAuthStore();

async function onConversationClick(conv: IConversation) {
  await conversationStore.init(conv);
  props.onClick?.();
}

function onSelectAgent(agent: IAgent) {
  conversationStore.setCurrentAgent(agent);
  conversationStore.change(undefined);
  props.onClick?.();
}
</script>

<template>
  <section class="bg-[#171717] h-full w-full flex-col flex overflow-hidden">
    <div class="flex flex-col flex-1 overflow-hidden">
      <NuxtLink :to="'/'">
        <div class="p-4">
          <div class="row-center justify-center">
            <img src="/images/icon-logo-black.svg" />
            <span class="text-[23px] font-[600] ml-2">Soly AI</span>
          </div>
        </div>
      </NuxtLink>
      <div class="flex-1 flex flex-col overflow-hidden p-4 border-t-[1px] border-app-line1">
        <div class="h-full overflow-y-scroll pb-[60px]">
          <div v-if="app.agents.length > 0">
            <p class="text-[#cacaca] px-3 mb-2">Explore</p>
            <div
              v-for="(item, idx) in app.agents"
              :key="item.id"
              @click="onSelectAgent(item)"
              class="row-center hover:bg-[#323232] cursor-pointer rounded-[12px] py-2 pl-3 mb-2"
            >
              <div class="w-[24px] h-[24px] rounded-full mr-3 flex-shrink-0">
                <img v-if="!!item.avatar_url" :src="item.avatar_url" class="w-[24px] h-[24px] rounded-full" />
              </div>
              <p class="text-[16px] text-[#fff] flex-1">{{ item.name }}</p>
            </div>
            <div class="line mb-4"></div>
          </div>

          <div v-if="app.channels.length > 0">
            <p class="text-[#cacaca] px-3 mb-2">Channels</p>
            <div
              v-for="(item, idx) in app.channels"
              :key="item.id"
              class="row-center hover:bg-[#323232] cursor-pointer rounded-[12px] py-2 pl-3 mb-2"
              @click="onConversationClick(item)"
            >
              <div class="w-[24px] h-[24px] rounded-full mr-3 flex-shrink-0">
                <img :src="item.agent?.avatar_url || '/images/icon-announcement.png'" class="rounded-full" />
              </div>
              <p class="text-[16px] text-[#fff] flex-1">{{ item.name }}</p>
            </div>
            <div class="line mb-4"></div>
          </div>

          <p v-if="conversationStore.histories.length > 0" class="text-[#cacaca] px-3 mb-2">Conversations</p>
          <div
            v-for="(item, idx) in conversationStore.histories"
            :key="item.id"
            class="relative cursor-pointer group hover:text-[#FFFFFF] hover:bg-[#323232] rounded-[12px]"
            :class="{ 'bg-[#323232]': item.id === conversationStore.conv?.id }"
          >
            <div @click="onConversationClick(item)" class="row-center justify-between text-[16px] py-2 pl-3 pr-10">
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
    <UserInfor v-if="getUser().id" />
  </section>
</template>
