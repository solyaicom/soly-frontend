<script setup lang="ts">
import DepositPopup from "./DepositPopup.vue";

const solana = useSolana();
const openPortfolio = ref(false);
const openDeposit = ref(false);
const { getUser } = useAuthStore();

function viewScanner() {
  window.open("https://solscan.io/address/" + getUser().wallet.address, "_blank");
}
function onOpenDeposit() {
  openPortfolio.value = false;
  openDeposit.value = true;
}
</script>
<template>
  <div>
    <button class="row-center py-[6px] px-3 rounded-full bg-[#141414]" @click="openPortfolio = true">
      <img src="/images/icon-wallet.svg" class="mr-2" />
      <p class="text-[16px]">{{ formatNumber(solana.balance, 3) }} SOL</p>
      <NuxtIcon name="icon-arrow-down" class="ml-2" />
    </button>
    <Dialog v-model:open="openPortfolio">
      <DialogContent class="bg-[#141414] py-4 px-0 border-none max-h-screen" hideClose>
        <div class="flex flex-col max-h-screen overflow-y-auto py-6 px-4 pb-10">
          <div class="row-center justify-between fixed top-0 left-0 w-full px-4 py-3 bg-[#141414]">
            <div class="row-center cursor-pointer" @click="viewScanner">
              <img :src="getUser().avatar_url" class="w-[24px] h-[24px] mr-2 rounded-full" />
              <p class="text-[16px] text-[#cacaca]">{{ shortAddress(getUser().wallet.address) }}</p>
              <div class="ml-2">
                <NuxtIcon name="icon-scanner" class="text-[16px] text-[#cacaca]" />
              </div>
            </div>
            <div class="cursor-pointer p-1 border-[1px] border-[#979797] rounded-[8px]" @click="openPortfolio = false">
              <NuxtIcon name="icon-close" class="text-[#cacaca]" />
            </div>
          </div>
          <p class="text-[#fff] text-[28px] font-[600] mt-4">${{ formatNumber(solana.totalBalance, 2) }}</p>
          <div class="row-center justify-center">
            <div class="mt-4 flex flex-col items-center bg-[#1a1a1a] rounded-[12px] p-4 flex-1 cursor-pointer" @click="onOpenDeposit">
              <img src="/images/icon-deposit.svg" />
              <p>Deposit</p>
            </div>
          </div>
          <div class="mt-4">
            <p class="text-[16px] font-[600] text-[#cacaca]">Token ({{ solana.portfolio.tokens.length }})</p>
            <div class="min-h-[150px]">
              <div v-for="(token, idx) in solana.portfolio.tokens" :key="idx" class="mt-2">
                <div class="row-center justify-between">
                  <div class="row-center">
                    <img :src="token.imageUrl" class="w-[28px] h-[28px] mr-2 rounded-full" />
                    <div>
                      <p class="text-[16px] text-[#cacaca]">{{ token.name }}</p>
                      <p class="text-[#979797]">${{ formatNumber(token.pricePerToken, 3) }}</p>
                    </div>
                  </div>
                  <div class="text-end">
                    <p class="font-[600] text-[#cacaca]">{{ formatNumber(token.balance, 3) }}</p>
                    <p class="text-[#979797]">${{ formatNumber(token.balance * token.pricePerToken, 2) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    <DepositPopup :open="openDeposit" :onClose="() => (openDeposit = false)" />
  </div>
</template>
