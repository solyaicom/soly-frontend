<script setup lang="ts">
import { getSolBalance } from "~/services/solana/utils";
import BtnPhantomConnect from "./BtnPhantomConnect.vue";
import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { toast } from "../ui/toast";

const { getUser } = useAuthStore();
const openQRCode = ref(false);
const { publicKey, address, sendTransaction } = useSolConnect();
const amount = ref(0);
const props = defineProps<{
  open: boolean;
  onClose: () => void;
  address?: string;
}>();
const phantomBalance = ref(0);
const loading = ref(false);

const addressView = computed(() => props.address || getUser().wallet.address);

async function onPhantomChange(address?: string) {
  phantomBalance.value = await getSolBalance(address || "");
}

async function onDeposit() {
  try {
    loading.value = true;
    if (address) {
      if (!publicKey.value) return;

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey.value,
          toPubkey: new PublicKey(getUser().wallet.address),
          lamports: amount.value * 1e9,
        })
      );

      const signature = await sendTransaction(transaction, connection);

      await connection.confirmTransaction(signature, "processed");

      toast({
        description: "Deposit transaction is success, please wait for processing...",
        duration: 4000,
      });
    }
  } catch (error) {
    console.log("deposit error", error);
  }
  loading.value = false;
}

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
    <DialogContent class="bg-[#141418] py-8 px-4 border-none flex flex-col items-center">
      <DialogTitle class="text-center text-[28px] font-[600] mt-2">Deposit</DialogTitle>
      <div class="line" />

      <p class="text-[#CACACA]">Deposit directly from your connected wallet</p>
      <div class="border-[1px] border-app-line2 w-full rounded-[12px] p-4">
        <div class="row-center justify-between">
          <div class="row-center">
            <img src="/images/icon-phantom.svg" class="w-[24px] h-[24px]" />
            <p class="ml-2 font-[600]">{{ address ? shortAddress(address) : "Connect with Phantom Wallet" }}</p>
          </div>

          <BtnPhantomConnect @change="onPhantomChange" />
        </div>
        <div class="line mt-4" />
        <div class="mt-3">
          <p>Token & Amount</p>
          <div class="row-center mt-2">
            <div class="row-center py-[6px] px-2 bg-app-card1 rounded-[6px] flex-1">
              <img
                src="https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png"
                class="w-[28px] rounded-full"
              />
              <input type="number" v-model="amount" placeholder="Input amount" class="ml-2 flex-1 bg-transparent outline-none" />
            </div>
            <PartialsButton :loading="loading" @click="onDeposit" text="Deposit" class="px-4 py-2 rounded-[8px] ml-2" :disabled="!address" />
          </div>
          <p v-if="address" class="mt-1 text-app-text3">Available: {{ formatNotationNumber(phantomBalance) }} SOL</p>
        </div>
      </div>
      <p class="text-[#CACACA] mt-1">Or Scan QR code</p>

      <div class="rounded-[12px] border-[1px] border-[#ffffff33]">
        <div class="p-4 rounded-[12px]">
          <div class="rounded-[8px] overflow-hidden">
            <Qrcode :value="addressView" variant="pixelated" class="w-[150px]" />
          </div>
        </div>
      </div>
      <div class="row-center cursor-pointer w-full px-4 py-2 bg-[#ffffff11] rounded-[6px] mt-2" @click="onCopy">
        <p class="flex-1 text-[16px]">Solana Address: {{ shortAddress(addressView) }}</p>
        <img src="/images/icon-copy.svg" class="ml-2" />
      </div>
    </DialogContent>
  </Dialog>
</template>
