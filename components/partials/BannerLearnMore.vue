<script setup lang="ts">
import Linear from "./Linear.vue";

const show = ref(!localStorage.getItem("hideBanner_learnMore"));
function onClose() {
  show.value = false;
  localStorage.setItem("hideBanner_learnMore", "true");
}
</script>
<template>
  <div v-if="show" class="relative w-full">
    <a href="https://docs.solyai.com/" target="_blank">
      <Linear>
        <div class="w-full py-2 text-[16px] font-[600] text-center">New to SolyAI? Learn more <span class="underline">here</span></div>
      </Linear>
    </a>
    <div class="absolute top-2 right-2 text-[#fff] p-1 cursor-pointer z-[1]" @click="onClose">
      <NuxtIcon name="icon-close" />
    </div>
  </div>
  <div v-else class="py-2"></div>
</template>
