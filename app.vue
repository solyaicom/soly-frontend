<script lang="ts" setup></script>

<template>
  <Toaster />

  <div class="p-8 w-screen h-screen">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
  <img src="/images/app-bg.png" class="w-full h-full absolute z-[-1] top-0" />
</template>
