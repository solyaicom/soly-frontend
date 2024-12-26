<script setup lang="ts">
import { getSolBalance, getTokenBalance, getWalletPortfolio } from "~/services/solana/utils";
import { Dialog, DialogContent } from "../ui/dialog";
import Linear from "./Linear.vue";
import DepositPopup from "./DepositPopup.vue";

const { getUser, logOut } = useAuthStore();

const openPopup = ref(false);
const openQRCode = ref(false);
const balance = ref(0);

onMounted(async () => {
  balance.value = await getSolBalance("HiunCfx6f6V6Y3ZzZJT947UDpqDW8kCjapC6jEnd8N5N");
});

function viewScanner() {
  openPopup.value = false;
  window.open("https://solscan.io/address/" + getUser().wallet.address, "_blank");
}

function onDeposit() {
  openPopup.value = false;
  openQRCode.value = true;
}

function onLogout() {
  logOut();
}
</script>

<template>
  <div class="w-full">
    <Popover v-model:open="openPopup">
      <PopoverTrigger class="w-full">
        <div class="flex flex-col items-center px-4 pb-4 border-top-[1px] border-app-line1">
          <div
            v-if="getUser()?.email"
            class="w-full rounded-full text-start px-4 py-2 font-[600] overflow-hidden row-center cursor-pointer"
            style="box-shadow: 14px 21px 40px 4px rgba(153, 70, 255, 0.34)"
          >
            <div class="w-[40px] h-[40px] rounded-full overflow-hidden mr-2">
              <img :src="getUser().avatar_url" class="w-full h-full" />
            </div>
            <div class="flex-1">
              <p>{{ shortAddress(getUser().wallet.address) }}</p>
              <div class="row-center">
                <p class="w-full text-[12px] text-[#cacaca] overflow-hidden whitespace-nowrap text-ellipsis">{{ balance }} SOL</p>
              </div>
            </div>
            <img src="/images/icon-arrow-back.svg" class="rotate-180" />
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <div class="py-4 px-6 w-[75vw] max-w-[384px] lg:w-64 bg-[#131313]">
          <section
            class="text-[#CACACA] rounded-[20px] overflow-hidden border-[1px] border-[#ffffff33]"
            style="box-shadow: 4px -8px 40px 4px rgba(153, 70, 255, 0.34)"
          >
            <div class="p-3">
              <p class="font-[300] line-clamp-1 italic">{{ getUser()?.email }}</p>

              <div class="row-center w-full mt-3">
                <img :src="getUser()?.avatar_url" class="w-[40px] h-[40px] rounded-full" />
                <div class="flex-1 ml-2">
                  <div class="row-center justify-between">
                    <p class="text-[16px] text-[#fff] font-[600]">{{ shortAddress(getUser()?.wallet.address) }}</p>
                    <div class="px-1 cursor-pointer" @click="viewScanner">
                      <img src="/images/icon-arrow-up-right.svg" />
                    </div>
                  </div>
                  <p class="flex-1 text-[#B0B0B0]">{{ balance }} SOL</p>
                </div>
              </div>
            </div>

            <div class="line" />
            <div>
              <div class="py-2 px-3 font-[500] cursor-pointer row-center hover:bg-[#232323]" @click="onDeposit">
                <span class="flex-1">Deposit</span> <img src="/images/icon-chevron-right-light.svg" class="w-[20px]" />
              </div>
              <div class="py-2 px-3 font-[500] cursor-pointer row-center hover:bg-[#232323]" @click="onLogout">
                <span class="flex-1 text-[red]">Logout</span>
              </div>
            </div>
          </section>
        </div>
      </PopoverContent>
    </Popover>
    <DepositPopup :open="openQRCode" :onClose="() => (openQRCode = false)" />
  </div>
</template>
