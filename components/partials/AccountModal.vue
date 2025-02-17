<script setup lang="ts">
// import { useReactForVue } from "~/react_app/ReactInVue";
import { getSolBalance } from "~/services/solana/utils";
import DepositPopup from "./DepositPopup.vue";
import WithdrawPopup from "./WithdrawPopup.vue";
import SolyAssetModal from "./SolyAssetModal.vue";
import { postActiveWallet } from "~/services/api/wallet/api";

const { getUser, setUser } = useAuthStore();
const openQRCode = ref(false);
const props = defineProps<{
  open: boolean;
  onClose: () => void;
  address?: string;
}>();
const solana = useSolana();
const solyBalance = ref(0);
const vuePrivy = useVuePrivy();
const openDeposit = ref(false);
const openWithdraw = ref(false);
const openSolyAsset = ref(false);
const privyBalance = ref(0);
const posting = ref(false);

onMounted(async () => {
  solyBalance.value = getUser().wallet ? await getSolBalance(getUser().wallet.address) : 0;
  privyBalance.value = await getSolBalance(getUser().privy_wallet.address);
});

const addressView = ref(props.address || solana.currentAddress || getUser().wallet?.address);

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

function openWithdrawPopup(addr: string) {
  addressView.value = addr;
  openWithdraw.value = true;
}

function onCopy(addr: string) {
  copyToClipboard(addr);
}

function viewScanner(addr: string) {
  window.open("https://solscan.io/address/" + addr, "_blank");
}

async function updateActiveWallet(value: boolean, wallet_type: "privy" | "soly") {
  if (value) {
    posting.value = true;
    const address = wallet_type === "privy" ? getUser().privy_wallet.address : getUser().wallet?.address;
    const res = await postActiveWallet({
      address,
    });
    if (res) {
      if (wallet_type === "privy") {
        setUser({ ...getUser(), privy_wallet: { ...getUser().privy_wallet, is_active: true }, wallet: { ...getUser().wallet, is_active: false } });
      } else {
        getUser().wallet &&
          setUser({ ...getUser(), wallet: { ...getUser().wallet, is_active: true }, privy_wallet: { ...getUser().privy_wallet, is_active: false } });
      }
      posting.value = false;
    }
  }
}

function onOpenDeposit(addr: string) {
  addressView.value = addr;
  openDeposit.value = true;
}
</script>

<template>
  <div>
    <Dialog :open="openQRCode">
      <DialogContent class="bg-[#141418] py-8 px-4 border-none flex flex-col" hide-close>
        <div class="cursor-pointer p-1 border-[1px] border-[#979797] rounded-[8px] absolute top-1 right-1" @click="openQRCode = false">
          <NuxtIcon name="icon-close" class="text-[#cacaca]" />
        </div>
        <DialogTitle class="text-[28px] font-[600] mt-2">Account</DialogTitle>

        <div class="line" />

        <div class="flex flex-col items-start">
          <div class="row-center justify-between w-full">
            <p class="text-[#fff] text-[16px] font-[600]">Privy Embedded Wallet</p>
            <Switch :disabled="posting" :checked="getUser().privy_wallet.is_active" @update:checked="(v) => updateActiveWallet(v, 'privy')" />
          </div>
          <div class="mt-1 row-center gap-x-2">
            <div v-if="getUser().privy_wallet.is_active" class="text-app-green text-[12px] px-2 rounded-[20px] border border-app-green">Active</div>
            <div v-if="vuePrivy.user?.wallet?.delegated" class="text-app-text2 text-[12px] px-2 rounded-[20px] border border-app-text2">
              Delegated
            </div>
          </div>
        </div>
        <div class="border-[1px] border-app-line2 w-full rounded-[12px] p-4">
          <div class="row-center justify-between">
            <div class="row-center">
              <img
                src="https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png"
                class="w-[24px] h-[24px] rounded-full"
              />
              <p class="ml-2 font-[600]">{{ shortAddress(getUser().privy_wallet.address) }}</p>
              <button class="p-1 bg-app-card1 ml-1 rounded-[4px]" @click="onCopy(getUser().privy_wallet.address)">
                <NuxtIcon name="icon-copy" class="text-app-text2" />
              </button>
              <button class="p-1 bg-app-card1 ml-1 rounded-[4px]" @click="viewScanner(getUser().privy_wallet.address)">
                <NuxtIcon name="icon-scanner" class="text-app-text2" />
              </button>
            </div>

            <p>{{ formatNumber(privyBalance) }} SOL</p>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-4 mt-2 gap-y-2 gap-x-2">
            <button class="bg-[#fff] rounded-[6px] p-2 row-center text-[#131313]" @click="onOpenDeposit(getUser().privy_wallet.address)">
              <NuxtIcon name="icon-deposit" class="text-[16px] mt-[1px]" />
              <span class="font-[600] ml-1">Deposit</span>
            </button>
            <button class="bg-[#fff] rounded-[6px] p-2 row-center text-[#131313]" @click="openWithdrawPopup(getUser().privy_wallet.address)">
              <NuxtIcon name="icon-deposit" class="text-[16px] mt-[1px] rotate-180" />
              <span class="font-[600] ml-1">Withdraw</span>
            </button>
            <button class="bg-[#fff] rounded-[6px] p-2 row-center text-[#131313]" @click="vuePrivy.request('export')">
              <NuxtIcon name="icon-export" class="text-[16px] mt-[1px]" />
              <span class="font-[600] ml-1">Export</span>
            </button>
            <button
              class="bg-[#fff] rounded-[6px] p-2 row-center text-[#131313]"
              :class="vuePrivy.user?.wallet?.delegated ? 'bg-app-red text-[#fff] ' : ''"
              @click="vuePrivy.request(vuePrivy.user?.wallet?.delegated ? 'revoke_delegate' : 'delegate')"
            >
              <NuxtIcon name="icon-delegate" class="text-[16px] mt-[1px]" />
              <span class="ml-1">{{ vuePrivy.user?.wallet?.delegated ? "Revoke" : "Delegate" }}</span>
            </button>
          </div>
        </div>
        <div class="line" />
        <div v-if="getUser().wallet">
          <div class="row-center justify-between w-full">
            <p class="text-[#fff] text-[16px] font-[600]">SolyAI Wallet</p>

            <Switch :disabled="posting" :checked="getUser().wallet.is_active" @update:checked="(v) => updateActiveWallet(v, 'soly')" />
          </div>
          <div class="mt-1 row-center">
            <div v-if="getUser().wallet.is_active" class="text-app-green text-[12px] px-2 rounded-[20px] border border-app-green">Active</div>
          </div>
          <p class="mt-2 text-app-red">This wallet is no longer available for onchain transactions from Feb 24, 2024.</p>
          <div class="mt-2 border-[1px] border-app-line2 w-full rounded-[12px] p-4">
            <div class="row-center justify-between">
              <div class="row-center">
                <img
                  src="https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png"
                  class="w-[24px] h-[24px] rounded-full"
                />
                <p class="ml-2 font-[600]">{{ shortAddress(getUser().wallet.address) }}</p>
                <button class="p-1 bg-app-card1 ml-1 rounded-[4px]" @click="onCopy(getUser().wallet.address)">
                  <NuxtIcon name="icon-copy" class="text-app-text2" />
                </button>
                <button class="p-1 bg-app-card1 ml-1 rounded-[4px]" @click="viewScanner(getUser().wallet.address)">
                  <NuxtIcon name="icon-scanner" class="text-app-text2" />
                </button>
              </div>

              <p>{{ formatNumber(solyBalance) }} SOL</p>
            </div>
            <div class="row-center mt-2 gap-y-2 gap-x-2">
              <button class="bg-[#fff] rounded-[6px] p-2 row-center text-[#131313]" @click="openWithdrawPopup(getUser().wallet.address)">
                <NuxtIcon name="icon-deposit" class="text-[16px] mt-[1px] rotate-180" />
                <span class="font-[600] ml-1">Withdraw</span>
              </button>
              <button class="bg-[#fff] rounded-[6px] p-2 row-center text-[#131313]" @click="openSolyAsset = true">
                <NuxtIcon name="icon-portfolio" class="text-[16px] mt-[1px]" />
                <span class="font-[600] ml-1">View Portfolio</span>
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    <DepositPopup v-if="openDeposit" :open="openDeposit" :address="addressView" @close="() => (openDeposit = false)" />
    <WithdrawPopup v-if="openWithdraw" :open="openWithdraw" :address="addressView" @close="() => (openWithdraw = false)" />
    <SolyAssetModal v-if="openSolyAsset" :address="getUser().wallet.address" @close="() => (openSolyAsset = false)" />
  </div>
</template>
