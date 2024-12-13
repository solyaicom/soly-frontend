<script setup lang="ts">
definePageMeta({
  layout: "landing",
  guest: true,
});
</script>

<template>
  <section class="flex flex-col w-full h-full">
    <div class="row-center mt-6 px-10">
      <img src="/images/icon-logo-row.svg" />
      <NuxtLink
        to="/fag"
        class="ml-10 cursor-pointer px-4 py-2 border-[1px] border-[#FFF] rounded-[12px] bg-gradient-to-b from-[#ffffff00] from-0% to-[#ffffff3d] to-100% hover:opacity-[0.8]"
        >FAGs</NuxtLink
      >
    </div>
    <div class="flex-1 flex flex-col w-full h-full items-center justify-center">
      <div
        class="flex flex-col items-center border-[6px] border-[#FFFFFF11] justify-center rounded-[40px] w-full h-full lg:h-[550px] lg:w-[440px] bg-gradient-to-r from-[#FFFFFF04] from-0% to-[#9999991F] to-10% backdrop-blur-xl"
      >
        <img src="/images/icon-logo-mask.svg" class="h-[340px] ml-[-24px] mt-[-60px]" />
        <span class="text-center text-[32px] font-[700] whitespace-pre-line mt-[-24px]">👋 GM, I'm Soly —{{ "\n" }}Your Personal AI Agent </span>
        <div class="w-[200px] mt-10">
          <PartialsButton text="Launch App" @click="navigateTo('/c')" />
        </div>
      </div>
      <a class="row-center mt-6 cursor-pointer" href="https://x.com/solyai_agent" target="_blank">
        <p>More about us:</p>
        <img src="/images/icon-twitter.svg" class="ml-2" />
      </a>
    </div>
  </section>
</template>
