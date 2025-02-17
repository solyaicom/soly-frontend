<script setup lang="ts">
import { getWalletPortfolio } from "~/services/solana/utils";
import Dialog from "../ui/dialog/Dialog.vue";
import DialogContent from "../ui/dialog/DialogContent.vue";
import DepositPopup from "./DepositPopup.vue";
import WithdrawPopup from "./WithdrawPopup.vue";
import SolyAssetModal from "./SolyAssetModal.vue";
import AccountModal from "./AccountModal.vue";

const props = defineProps<{
  address?: string;
}>();

const solana = useSolana();
const openPortfolio = ref(false);
const openPortfolioMobile = ref(false);
const openDeposit = ref(false);
const { getUser } = useAuthStore();
const portfolio_view = ref<HTMLElement | null>(null);
const portfolio_content = ref<HTMLElement | null>(null);
const container = ref<HTMLElement | null>(null);
const openWithdraw = ref(false);
const openAccount = ref(false);

onClickOutside(container, () => (openPortfolio.value = false));

const addressView = computed(() => solana.currentAddress);

function viewScanner() {
  window.open("https://solscan.io/address/" + addressView.value, "_blank");
}
function onOpenDeposit() {
  openPortfolio.value = false;
  openDeposit.value = true;
}

function onOpenWithdraw() {
  openPortfolio.value = false;
  console.log("open withdraw");
  openWithdraw.value = true;
}

watch(
  () => openPortfolio.value,
  () => {
    if (!portfolio_view.value || !portfolio_content.value) return;

    portfolio_view.value.style.top = -portfolio_content.value.clientHeight - 12 + "px";
    portfolio_view.value.style.maxHeight = openPortfolio.value ? "600px" : "0px";
  }
);

async function onOpenPortfolio(e: any) {
  await solana.refresh();
  const mobileView = window.innerWidth < 600;
  if (mobileView) {
    openPortfolioMobile.value = true;
    return;
  }
  openPortfolio.value = true;
}

function onOpenSolyAsset() {
  openPortfolio.value = false;
  openAccount.value = true;
}
</script>
<template>
  <div ref="container">
    <button v-if="!$slots.default" class="row-center py-[6px] px-3 rounded-full bg-[#141414]" @click="onOpenPortfolio">
      <img src="/images/icon-wallet.svg" class="mr-2" />
      <p class="text-[16px]">{{ formatNumber(solana.balance, 3) }} SOL</p>
      <NuxtIcon name="icon-arrow-down" class="ml-2" />
    </button>
    <button v-else @click="onOpenPortfolio">
      <slot />
    </button>
    <div ref="portfolio_view" class="absolute right-0 z-[999] w-[450px] max-w-screen max-h-0 overflow-hidden rounded-[12px]">
      <div ref="portfolio_content" class="bg-[#141414] border-none max-h-screen" hideClose>
        <div class="relative flex flex-col max-h-[600px] overflow-y-auto pb-10">
          <div class="row-center justify-between sticky top-0 left-0 w-full p-4 bg-[#141414]">
            <div class="row-center cursor-pointer" @click="viewScanner">
              <img :src="getUser().avatar_url" class="w-[24px] h-[24px] mr-2 rounded-full" />
              <p class="text-[16px] text-[#cacaca]">{{ shortAddress(addressView) }}</p>
              <div class="ml-2">
                <NuxtIcon name="icon-scanner" class="text-[16px] text-[#cacaca]" />
              </div>
            </div>
            <div class="cursor-pointer p-1 border-[1px] border-[#979797] rounded-[8px]" @click="openPortfolio = false">
              <NuxtIcon name="icon-close" class="text-[#cacaca]" />
            </div>
          </div>
          <div class="px-4">
            <p class="text-[#fff] text-[28px] font-[600]">${{ formatNumber(solana.totalBalance, 2) }}</p>
            <div v-if="getUser().privy_wallet.is_active" class="row-center p-3 border border-[#4096FF] rounded-[6px] bg-[rgba(22,119,255,0.05)] mt-3">
              <NuxtIcon name="icon-about" class="text-system-blue text-[22px]" />
              <div class="ml-3">
                <p class="text-app-text2">
                  The balance displayed is for your new wallet, created by Privy. Your existing assets are safely stored in your old wallet.
                </p>
                <button class="row-center text-[#1677FF]" @click="onOpenSolyAsset">
                  <p>View all wallets</p>
                  <NuxtIcon name="icon-arrow-down" class="rotate-[-90deg]" />
                </button>
              </div>
            </div>
            <div class="row-center justify-center mt-4 space-x-3">
              <div class="flex flex-col items-center bg-[#1a1a1a] rounded-[12px] p-4 flex-1 cursor-pointer" @click="onOpenDeposit">
                <img src="/images/icon-deposit.svg" />
                <p>Deposit</p>
              </div>
              <div class="flex flex-col items-center bg-[#1a1a1a] rounded-[12px] p-4 flex-1 cursor-pointer" @click="onOpenWithdraw">
                <img src="/images/icon-withdraw.svg" />
                <p>Withdraw</p>
              </div>
            </div>
            <div class="mt-4">
              <p class="text-[16px] font-[600] text-[#cacaca]">Token ({{ solana.portfolio.tokens.length }})</p>

              <div class="min-h-[150px]">
                <div v-for="(token, idx) in solana.portfolio.tokens" :key="token.mint" class="mt-2">
                  <div class="row-center justify-between">
                    <div class="row-center">
                      <a class="w-[28px] h-[28px] mr-2 rounded-full" :href="`https://solscan.io/token/${token.mint}`" target="_blank">
                        <img :src="token.imageUrl" class="w-full rounded-full" />
                      </a>
                      <div>
                        <p class="text-[16px] text-[#cacaca]">
                          {{ token.name }}
                          <span class="text-[12px] text-[#979797]">({{ token.symbol }})</span>
                        </p>
                        <div class="row-center cursor-pointer" @click="copyToClipboard(token.mint)">
                          <p class="text-[#979797]">{{ shortAddress(token.mint) }}</p>
                          <NuxtIcon name="icon-copy" class="ml-2 text-[#979797]" />
                        </div>
                      </div>
                    </div>
                    <TooltipProvider :delayDuration="0">
                      <Tooltip>
                        <TooltipTrigger>
                          <div class="text-end">
                            <p class="font-[600] text-[#cacaca]">{{ formatNumber(token.balance, 3) }}</p>
                            <p class="text-[#979797]">
                              {{ token.pricePerToken ? `$${formatNumber(token.balance * token.pricePerToken, 2)}` : "---" }}
                            </p>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent class="z-[1000]" side="left">
                          <p>Price: ${{ formatNumber(token.pricePerToken, 2) }}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Dialog v-model:open="openPortfolioMobile">
      <DialogContent class="bg-[#141414] py-4 px-0 border-none max-h-screen" hideClose>
        <div class="flex flex-col max-h-screen overflow-y-auto py-6 px-4 pb-10">
          <div class="row-center justify-between fixed top-0 left-0 w-full px-4 py-3 bg-[#141414]">
            <div class="row-center cursor-pointer" @click="viewScanner">
              <img :src="getUser().avatar_url" class="w-[24px] h-[24px] mr-2 rounded-full" />
              <p class="text-[16px] text-[#cacaca]">{{ shortAddress(addressView) }}</p>
              <div class="ml-2">
                <NuxtIcon name="icon-scanner" class="text-[16px] text-[#cacaca]" />
              </div>
            </div>
            <div class="cursor-pointer p-1 border-[1px] border-[#979797] rounded-[8px]" @click="openPortfolioMobile = false">
              <NuxtIcon name="icon-close" class="text-[#cacaca]" />
            </div>
          </div>
          <p class="text-[#fff] text-[28px] font-[600] mt-4">${{ formatNumber(solana.totalBalance, 2) }}</p>
          <div class="mt-4 row-center justify-center">
            <div class="flex flex-col items-center bg-[#1a1a1a] rounded-[12px] p-4 flex-1 cursor-pointer" @click="onOpenDeposit">
              <img src="/images/icon-deposit.svg" />
              <p>Deposit</p>
            </div>
            <div class="ml-3 flex flex-col items-center bg-[#1a1a1a] rounded-[12px] p-4 flex-1 cursor-pointer" @click="onOpenWithdraw">
              <img src="/images/icon-withdraw.svg" />
              <p>Withdraw</p>
            </div>
          </div>
          <div class="mt-4">
            <p class="text-[16px] font-[600] text-[#cacaca]">Token ({{ solana.portfolio.tokens.length }})</p>

            <div class="min-h-[150px]">
              <div v-for="(token, idx) in solana.portfolio.tokens" :key="idx" class="mt-2">
                <div class="row-center justify-between">
                  <div class="row-center">
                    <a class="w-[28px] h-[28px] mr-2 rounded-full" :href="`https://solscan.io/token/${token.mint}`" target="_blank">
                      <img :src="token.imageUrl" class="w-full rounded-full" />
                    </a>
                    <div>
                      <p class="text-[16px] text-[#cacaca]">
                        {{ token.name }}
                        <span class="text-[12px] text-[#979797]">({{ token.symbol }})</span>
                      </p>
                      <div class="row-center cursor-pointer" @click="copyToClipboard(token.mint)">
                        <p class="text-[#979797]">{{ shortAddress(token.mint) }}</p>
                        <NuxtIcon name="icon-copy" class="ml-2 text-[#979797]" />
                      </div>
                    </div>
                  </div>
                  <div class="text-end">
                    <p class="font-[600] text-[#cacaca]">{{ formatNumber(token.balance, 3) }}</p>
                    <p class="text-[#979797]">
                      {{ token.pricePerToken ? `$${formatNumber(token.balance * token.pricePerToken, 2)}` : "---" }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    <DepositPopup :open="openDeposit" :address="addressView" :onClose="() => (openDeposit = false)" />
    <WithdrawPopup v-if="openWithdraw" :open="openWithdraw" :address="addressView" :onClose="() => (openWithdraw = false)" />
    <AccountModal :open="openAccount" :address="getUser().wallet?.address" @close="() => (openAccount = false)" />
  </div>
</template>
