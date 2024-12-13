<script lang="ts" setup>
import { useAppSetting } from "./stores/app";

const app = useAppSetting();
</script>

<template>
  <Toaster />
  <div v-if="app.showLoading" class="fixed z-[9999] top-0 left-0 w-full h-full flex items-center justify-center bg-[rgba(0,0,0,0.8)]">
    <img src="/images/icon-loading.gif" class="w-[32px] h-[32px]" />
  </div>
  <NuxtLayout>
    <div class="w-full h-full">
      <NuxtPage />
    </div>
  </NuxtLayout>
</template>
