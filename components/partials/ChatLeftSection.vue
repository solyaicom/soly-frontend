<script setup lang="ts">
import { PopoverClose } from "radix-vue";
import { createNewConversation, fetchConversations } from "~/services/api/chat/api";
import { IConversation } from "~/services/api/chat/type";

const props = defineProps<{
  onChangeConversation: (conv: IConversation, addNew?: boolean) => void;
  histories: IConversation[];
  onDelete: (conv: IConversation) => void;
}>();

const { getUser } = useAuthStore();
const app = useAppSetting();
const loading = ref(false);
async function onNewChat() {
  loading.value = true;
  app.changeLoading(true);
  const conv = await createNewConversation();
  if (conv) {
    props.onChangeConversation(conv, true);
  }
  setTimeout(() => {
    app.changeLoading(false);
    loading.value = false;
  }, 200);
}

function onConversationClick(item: IConversation) {
  loading.value = true;
  app.changeLoading(true);
  props.onChangeConversation(item);
  setTimeout(() => {
    app.changeLoading(false);
    loading.value = false;
  }, 400);
}

function onRenameItem() {
  console.log("rename");
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
            v-for="(item, idx) in histories"
            :key="item.id"
            class="relative cursor-pointer group hover:text-[#FFFFFF] hover:bg-[#323232] rounded-[12px]"
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
                      <div class="row-center text-app-red cursor-pointer" @click="onDelete(item)">
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
      class="p-4 font-[600] overflow-hidden border-top-[1px] border-app-line1"
      style="box-shadow: 14px 21px 40px 4px rgba(153, 70, 255, 0.34)"
    >
      <p class="w-full overflow-hidden whitespace-nowrap text-ellipsis">Email: {{ getUser().email }}</p>
      <p>Address: {{ shortAddress(getUser().wallet.address) }}</p>
    </div>
  </section>
</template>
