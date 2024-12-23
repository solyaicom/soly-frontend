<script setup lang="ts">
import { Dialog, DialogContent } from "../ui/dialog";

const { getUser, logOut } = useAuthStore();

const openPopup = ref(false);
const openQRCode = ref(false);

function onCopy() {
  copyToClipboard(getUser().wallet.address);
}

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
        <div
          v-if="getUser()?.email"
          class="w-full text-start p-4 font-[600] overflow-hidden border-top-[1px] border-app-line1 row-center cursor-pointer"
          style="box-shadow: 14px 21px 40px 4px rgba(153, 70, 255, 0.34)"
        >
          <div class="flex-1">
            <p>Address: {{ shortAddress(getUser().wallet.address) }}</p>
            <div class="row-center">
              <p class="w-full text-[12px] text-[#cacaca] overflow-hidden whitespace-nowrap text-ellipsis">Balance: 0 SOL</p>
            </div>
          </div>
          <img src="/images/icon-arrow-back.svg" class="rotate-180" />
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <section class="bg-[#fff] w-[75vw] max-w-[384px] md:w-64 text-[#090909] rounded-[12px] overflow-hidden">
          <div class="row-center justify-center pt-4">
            <img :src="getUser()?.avatar_url" class="w-[40px] h-[40px] rounded-full" />
          </div>
          <div class="pt-1 px-3">
            <p class="font-[500] line-clamp-1">Email: {{ getUser()?.email }}</p>
            <p class="font-[500] mt-1">Address: {{ shortAddress(getUser()?.wallet.address) }}</p>
            <div class="font-[500] mt-1 row-center">
              <p class="flex-1">Balance: 0 SOL</p>
              <div class="row-center cursor-pointer" @click="viewScanner">
                <span>Explorer</span>
                <img src="/images/icon-chevron-right.svg" class="w-[16px]" />
              </div>
            </div>
          </div>
          <div class="line mt-4" />
          <div>
            <div class="py-2 px-3 font-[500] cursor-pointer row-center hover:bg-[#dfdfdf]" @click="onDeposit">
              <span class="flex-1">Deposit</span> <img src="/images/icon-chevron-right.svg" class="w-[20px]" />
            </div>
            <div class="py-2 px-3 font-[500] cursor-pointer row-center hover:bg-[#dfdfdf]" @click="onLogout">
              <span class="flex-1 text-[red]">Logout</span>
            </div>
          </div>
        </section>
      </PopoverContent>
    </Popover>
    <Dialog v-model:open="openQRCode">
      <DialogContent class="bg-[#323232] py-8 px-4 border-none flex flex-col items-center">
        <p class="text-center text-[16px] font-[600] mt-2">Your QR Code</p>
        <div class="mt-1 rounded-[12px] overflow-hidden">
          <Qrcode :value="getUser()?.wallet.address" variant="pixelated" class="w-[300px]" />
        </div>
        <div class="row-center cursor-pointer" @click="onCopy">
          <p>Wallet Address: {{ shortAddress(getUser()?.wallet.address) }}</p>
          <img src="/images/icon-copy.svg" class="ml-2" />
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>
