<script setup lang="ts">
// import { useReactForVue } from "~/react_app/ReactInVue";
import { getSolBalance } from "~/services/solana/utils";

const { getUser } = useAuthStore();
const openQRCode = ref(false);
const props = defineProps<{
  open: boolean;
  onClose: () => void;
  address?: string;
}>();
const solana = useSolana();
const solyBalance = ref(0);
const vuePrivy = useVuePrivy();

onMounted(async () => {
  console.log(vuePrivy.user);
  solyBalance.value = await getSolBalance(getUser().wallet.address);
});

const addressView = computed(() => props.address || getUser().wallet.address);

watch(
  () => props.open,
  () => {
    openQRCode.value = props.open;
  }
);

watch(
  () => openQRCode.value,
  () => {
    if (!openQRCode.value) props.onClose();
  }
);

function onCopy() {
  copyToClipboard(addressView.value);
}
</script>

<template>
  <Dialog v-model:open="openQRCode">
    <DialogContent class="bg-[#141418] py-8 px-4 border-none flex flex-col">
      <DialogTitle class="text-[28px] font-[600] mt-2">Account</DialogTitle>
      <div class="line" />

      <div class="flex flex-col items-start">
        <p class="text-[#fff] text-[16px] font-[600]">Privy Embedded Wallet</p>
        <div class="mt-1 row-center gap-x-2">
          <div class="text-app-green text-[12px] px-2 rounded-[20px] border border-app-green">Active</div>
          <div v-if="vuePrivy.user?.wallet?.delegated" class="text-app-text2 text-[12px] px-2 rounded-[20px] border border-app-text2">Delegate</div>
        </div>
      </div>
      <div class="border-[1px] border-app-line2 w-full rounded-[12px] p-4">
        <div class="row-center justify-between">
          <div class="row-center">
            <img
              src="https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png"
              class="w-[24px] h-[24px] rounded-full"
            />
            <p class="ml-2 font-[600]">{{ shortAddress(solana.currentAddress) }}</p>
          </div>

          <p>{{ formatNumber(solana.balance) }} SOL</p>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 mt-2 gap-y-2 gap-x-2">
          <button class="bg-[#fff] rounded-[6px] p-2 row-center text-[#131313]">
            <NuxtIcon name="icon-deposit" class="text-[16px] mt-[1px]" />
            <span class="font-[600] ml-1">Deposit</span>
          </button>
          <button class="bg-[#fff] rounded-[6px] p-2 row-center text-[#131313]">
            <NuxtIcon name="icon-deposit" class="text-[16px] mt-[1px] rotate-180" />
            <span class="font-[600] ml-1">Withdraw</span>
          </button>
          <button class="bg-[#fff] rounded-[6px] p-2 row-center text-[#131313]">
            <NuxtIcon name="icon-export" class="text-[16px] mt-[1px]" />
            <span class="font-[600] ml-1">Export</span>
          </button>
          <button class="bg-[#fff] rounded-[6px] p-2 row-center text-[#131313]">
            <NuxtIcon name="icon-delegate" class="text-[16px] mt-[1px]" />
            <span class="font-[600] ml-1">Delegate</span>
          </button>
        </div>
      </div>
      <div class="line" />
      <div>
        <p class="text-[#fff] text-[16px] font-[600]">SolyAI Wallet</p>
        <div class="mt-1 row-center">
          <div class="text-app-red text-[12px] px-2 rounded-[20px] border border-app-red">Inactive</div>
        </div>
        <p class="mt-2 text-app-red">This wallet is no longer available for onchain transactions from Feb 10, 2024.</p>
        <div class="mt-2 border-[1px] border-app-line2 w-full rounded-[12px] p-4">
          <div class="row-center justify-between">
            <div class="row-center">
              <img
                src="https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png"
                class="w-[24px] h-[24px] rounded-full"
              />
              <p class="ml-2 font-[600]">{{ shortAddress(getUser().wallet.address) }}</p>
            </div>

            <p>{{ formatNumber(solyBalance) }} SOL</p>
          </div>
          <div class="row-center mt-2 gap-y-2 gap-x-2">
            <button class="bg-[#fff] rounded-[6px] p-2 row-center text-[#131313]">
              <NuxtIcon name="icon-deposit" class="text-[16px] mt-[1px] rotate-180" />
              <span class="font-[600] ml-1">Withdraw</span>
            </button>
            <button class="bg-[#fff] rounded-[6px] p-2 row-center text-[#131313]">
              <NuxtIcon name="icon-portfolio" class="text-[16px] mt-[1px]" />
              <span class="font-[600] ml-1">View Portfolio</span>
            </button>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
