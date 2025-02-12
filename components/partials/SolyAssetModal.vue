<script setup lang="ts">
import { getWalletPortfolio } from "~/services/solana/utils";
import Dialog from "../ui/dialog/Dialog.vue";
import DialogContent from "../ui/dialog/DialogContent.vue";
import WithdrawPopup from "./WithdrawPopup.vue";

const props = defineProps<{
  address: string;
  onClose: () => void;
}>();

const openPortfolio = ref(false);
const { getUser } = useAuthStore();
const container = ref<HTMLElement | null>(null);
const openWithdraw = ref(false);
onClickOutside(container, () => (openPortfolio.value = false));
const portfolio = ref<{ totalBalance: number; portfolio: { tokens: any[] } }>({
  totalBalance: 0,
  portfolio: {
    tokens: [],
  },
});
const addressView = computed(() => props.address || getUser().wallet.address);

onMounted(async () => {
  const res = await getWalletPortfolio(props.address);
  portfolio.value = {
    totalBalance: res.totalBalance,
    portfolio: {
      tokens: res.tokens,
    },
  };
});

function viewScanner() {
  window.open("https://solscan.io/address/" + addressView.value, "_blank");
}

function onOpenWithdraw() {
  openPortfolio.value = false;
  console.log("open withdraw");
  openWithdraw.value = true;
}
</script>
<template>
  <div ref="container">
    <Dialog open>
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
            <div class="cursor-pointer p-1 border-[1px] border-[#979797] rounded-[8px]" @click="onClose">
              <NuxtIcon name="icon-close" class="text-[#cacaca]" />
            </div>
          </div>
          <p class="text-[#fff] text-[28px] font-[600] mt-4">${{ formatNumber(portfolio.totalBalance, 2) }}</p>
          <div class="mt-4 row-center justify-center">
            <div class="ml-3 flex flex-col items-center bg-[#1a1a1a] rounded-[12px] p-4 flex-1 cursor-pointer" @click="onOpenWithdraw">
              <img src="/images/icon-withdraw.svg" />
              <p>Withdraw</p>
            </div>
          </div>
          <div class="mt-4">
            <p class="text-[16px] font-[600] text-[#cacaca]">Token ({{ portfolio.portfolio.tokens.length }})</p>

            <div class="min-h-[150px]">
              <div v-for="(token, idx) in portfolio.portfolio.tokens" :key="idx" class="mt-2">
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

    <WithdrawPopup :open="openWithdraw" :onClose="() => (openWithdraw = false)" :address="address" />
  </div>
</template>
