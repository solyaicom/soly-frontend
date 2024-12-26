<script setup lang="ts">
const { getUser } = useAuthStore();
const openQRCode = ref(false);

const props = defineProps<{
  open: boolean;
  onClose: () => void;
}>();

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
  copyToClipboard(getUser().wallet.address);
}
</script>

<template>
  <Dialog v-model:open="openQRCode">
    <DialogContent class="bg-[#1e1f38] py-8 px-4 border-none flex flex-col items-center">
      <DialogTitle class="text-center text-[28px] font-[600] mt-2">Deposit</DialogTitle>
      <p class="text-[#CACACA] mt-[-8px]">Scan QR code to deposit SOL</p>
      <div class="line" />
      <Linear class="rounded-[12px] mt-2">
        <div class="p-6 rounded-[12px]">
          <div class="rounded-[8px] overflow-hidden">
            <Qrcode :value="getUser()?.wallet.address" variant="pixelated" class="w-[150px]" />
          </div>
        </div>
      </Linear>
      <div class="row-center cursor-pointer w-full px-4 py-2 bg-[#ffffff11] rounded-[6px] mt-2" @click="onCopy">
        <p class="flex-1 text-[16px]">Solana Address: {{ shortAddress(getUser()?.wallet.address) }}</p>
        <img src="/images/icon-copy.svg" class="ml-2" />
      </div>
      <div class="line" />
      <div class="w-full">
        <p class="text-[16px] font-[600] text-center">Here's what you can do</p>
        <div class="row-center mt-3">
          <img src="/images/icon-checked.svg" class="w-[20px]" />
          <p class="ml-2 text-[#CACACA]">Scan the QR code or copy the wallet address to transfer funds</p>
        </div>
        <div class="row-center mt-3">
          <img src="/images/icon-checked.svg" class="w-[20px]" />
          <p class="ml-2 text-[#CACACA]">Verify you're using the Solana network before proceeding</p>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
