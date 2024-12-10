<script setup lang="ts">
const messages = ref<any[]>([]);

function onKeyChange(e: any) {
  console.log("e.key", e.key, e.target.innerHTML);

  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();

    messages.value.push({ type: "user", message: e.target.value });
    e.target.innerHTML = "";
  }
}
</script>

<template>
  <section class="flex-1 flex flex-col bg-[#131313] ml-4 rounded-[16px]">
    <div class="h-[104px] row-center border-b-[1px] border-b-app-line1">
      <img src="/images/icon-logo-row.svg" />
    </div>
    <div class="flex-1 flex flex-col items-center py-4">
      <div class="flex-1 flex flex-col items-center max-w-full lg:max-w-[800px] md:max-w-[550px]">
        <div class="flex-1 flex flex-col items-center justify-center">
          <img src="/images/icon-logo-row.svg" />
          <p class="mt-10 text-center">
            Tether IOTA siacoin revain digibyte. Kadena waves gala terra shiba-inu nexo litecoin bancor. Digibyte stacks revain secret solana polygon
            arweave. Nexo cardano binance tether tether. Neo nexo terraUSD secret litecoin compound revain polygon litecoin THETA.
          </p>
        </div>
        <div class="w-full">
          <div class="w-full flex flex-row items-start">
            <div
              contenteditable
              @keydown="onKeyChange"
              id="promt-area"
              class="border-[1px] border-app-line1 min-h-[52px] flex-1 rounded-[30px] p-4 outline-none"
            ></div>
            <div class="ml-3 cursor-pointer">
              <img src="/images/icon-send.svg" />
            </div>
          </div>
          <p class="mt-5 text-center text-[#CDCDCD] text-[12px]">Please consider checking important information! This is not investment advice.</p>
        </div>
      </div>
    </div>
  </section>
</template>
