<script setup lang="ts">
definePageMeta({
  guest: true,
  name: "Authorization",
  layout: "default",
});
useHead({
  title: "Authorization",
});

function onLoginSuccess() {
  navigateTo("/c");
}
</script>

<template>
  <section class="flex flex-col w-full h-full items-center justify-center">
    <div
      class="flex flex-col items-center justify-center rounded-[16px] w-full h-full lg:h-[400px] lg:w-[800px] bg-gradient-to-tr from-[#FFFFFF03] from-0% to-[#9999991e] to-55% backdrop-blur-xl"
    >
      <div class="row-center">
        <img src="/images/icon-logo-black.svg " class="h-[80px]" />
        <span class="text-center text-[54px] font-[700] ml-4">Soly AI</span>
      </div>
      <span class="text-center text-[28px] font-[700] mt-10">Login with Google</span>
      <div class="w-[200px] mt-10">
        <PartialsButtonGoogle @success="onLoginSuccess" />
      </div>
    </div>
  </section>
</template>
