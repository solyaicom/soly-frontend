<script setup lang="ts">
definePageMeta({
  guest: true,
  name: "Authorization",
  layout: "default",
});

function onLoginSuccess() {
  navigateTo("/c");
}
</script>

<template>
  <section class="flex flex-col w-full h-full items-center justify-center">
    <div
      class="flex flex-col items-center justify-center rounded-[16px] w-full h-full lg:h-[400px] lg:w-[800px] bg-gradient-to-r from-[#FFFFFF04] from-0% to-[#9999991F] to-10% backdrop-blur-xl"
    >
      <img src="/images/icon-logo-row.svg " class="h-[100px]" />
      <span class="text-center text-[40px] font-[700] mt-10">Login with Google</span>
      <div class="w-[200px] mt-10">
        <PartialsButtonGoogle @success="onLoginSuccess" />
      </div>
    </div>
  </section>
</template>
