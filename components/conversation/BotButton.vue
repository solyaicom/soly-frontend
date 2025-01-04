<script setup lang="ts">
import { PopoverClose } from "radix-vue";
import PopoverContent from "../ui/popover/PopoverContent.vue";
import PopoverTrigger from "../ui/popover/PopoverTrigger.vue";
import Popover from "../ui/popover/Popover.vue";
import MenuConversation from "../partials/MenuConversation.vue";
import BotInformation from "./BotInformation.vue";
const openSheet = ref(false);

const openBotMenu = ref(false);
const openBotInformation = ref(false);
const app = useAppSetting();

const conversationStore = useConversationStore();

const currentAgent = computed(() => {
  return conversationStore.conv?.agent || app.agents[0];
});

function onItemMenuClick() {
  openSheet.value = false;
}
</script>

<template>
  <div class="h-[68px] row-center border-b-[1px] border-b-app-line1">
    <Sheet v-model:open="openSheet">
      <SheetTrigger>
        <div class="pl-4 py-2 cursor-pointer lg:hidden">
          <img src="/images/icon-menu.svg" /></div
      ></SheetTrigger>
      <SheetContent side="left" class="p-0">
        <MenuConversation @click="onItemMenuClick" />
      </SheetContent>
    </Sheet>

    <Popover v-model:open="openBotMenu">
      <PopoverTrigger>
        <div v-if="currentAgent" class="row-center p-3 bg-[#323232] rounded-[12px] ml-4">
          <div class="w-[24px] h-[24px] mr-2 rounded-full overflow-hidden">
            <img :src="currentAgent?.avatar_url" class="w-[24px] h-[24px]" />
          </div>
          <p class="text-[16px] font-[600]">{{ currentAgent?.name || "Soly AI" }}</p>
          <img src="/images/icon-arrow-down.svg" class="ml-2" />
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <div class="bg-[#323232] rounded-[12px] p-4">
          <div
            class="row-center cursor-pointer"
            @click="
              () => {
                openBotMenu = false;
                openBotInformation = true;
              }
            "
          >
            <img src="/images/icon-about.svg" class="w-[20px] h-[20px]" />
            <p class="ml-2 text-[16px]">About</p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
    <BotInformation v-model:open="openBotInformation" />
  </div>
</template>
