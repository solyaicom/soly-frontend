<script setup lang="ts">
import { getSolBalance } from "~/services/solana/utils";

import PrivyLogout from "~/react_app/LogoutButton";

import { applyPureReactInVue } from "veaury";
import AccountModal from "./AccountModal.vue";

const LogoutButton = applyPureReactInVue(PrivyLogout);
const { getUser, logOut } = useAuthStore();

const openPopup = ref(false);
const openAccount = ref(false);
const solana = useSolana();
const openSolyAssets = ref(false);
const addressView = computed(() => solana.currentAddress || getUser().privy_wallet.address || getUser().wallet?.address);

const balance = ref(0);

onMounted(async () => {
  const _balance = solana.balance ? solana.balance : await getSolBalance(addressView.value);
  balance.value = _balance;
});

function viewScanner() {
  openPopup.value = false;
  window.open("https://solscan.io/address/" + addressView.value, "_blank");
}

function onOpenAccount() {
  openPopup.value = false;
  openAccount.value = true;
}
function onViewAssets() {
  openPopup.value = false;
  openSolyAssets.value = true;
}
</script>

<template>
  <div class="w-full">
    <Popover v-model:open="openPopup">
      <PopoverTrigger class="w-full">
        <div class="flex flex-col justify-center items-center px-4 py-3 border-t-[1px] border-t-app-line1">
          <div v-if="getUser()?.email" class="w-full rounded-full text-start px-4 py-2 font-[600] overflow-hidden row-center cursor-pointer">
            <div class="w-[40px] h-[40px] rounded-full overflow-hidden mr-2">
              <img :src="getUser().avatar_url" class="w-full h-full" />
            </div>
            <div class="flex-1">
              <p>{{ shortAddress(solana.currentAddress) }}</p>
              <div class="row-center">
                <p class="w-full text-[12px] text-[#cacaca] overflow-hidden whitespace-nowrap text-ellipsis">
                  {{ formatNumber(solana.balance || balance, 3) }} SOL
                </p>
              </div>
            </div>
            <img src="/images/icon-arrow-back.svg" class="rotate-180" />
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <div class="py-4 px-6 w-[75vw] max-w-[384px] lg:w-64 bg-[#131313]">
          <section class="text-[#CACACA] rounded-[20px] overflow-hidden border-[1px] border-[#ffffff33]">
            <div class="p-3">
              <p class="font-[300] line-clamp-1 italic">{{ getUser()?.email }}</p>

              <div class="row-center w-full mt-3">
                <img :src="getUser()?.avatar_url" class="w-[40px] h-[40px] rounded-full" />
                <div class="flex-1 ml-2">
                  <div class="row-center justify-between">
                    <p class="text-[16px] text-[#fff] font-[600]">{{ shortAddress(solana.currentAddress) }}</p>
                    <div class="px-1 cursor-pointer" @click="viewScanner">
                      <img src="/images/icon-arrow-up-right.svg" />
                    </div>
                  </div>
                  <p class="flex-1 text-[#B0B0B0]">{{ formatNumber(solana.balance || balance, 3) }} SOL</p>
                </div>
              </div>
            </div>

            <div class="line" />
            <div>
              <div class="py-2 px-3 font-[500] cursor-pointer row-center hover:bg-[#232323]" @click="onOpenAccount">
                <span class="flex-1">Account</span> <img src="/images/icon-chevron-right-light.svg" class="w-[20px]" />
              </div>
              <div v-if="getUser().wallet?.address" class="py-2 px-3 font-[500] cursor-pointer row-center hover:bg-[#232323]" @click="onViewAssets">
                <span class="flex-1">View Soly Assets</span> <img src="/images/icon-chevron-right-light.svg" class="w-[20px]" />
              </div>
              <LogoutButton />
            </div>
          </section>
        </div>
      </PopoverContent>
    </Popover>
    <AccountModal :address="getUser()?.wallet?.address" :open="openAccount" @close="() => (openAccount = false)" />
    <PartialsSolyAssetModal :address="getUser()?.wallet?.address" v-if="openSolyAssets" @close="() => (openSolyAssets = false)" />
  </div>
</template>
