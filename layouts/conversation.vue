<script setup lang="ts">
import BannerLearnMore from "~/components/partials/BannerLearnMore.vue";
</script>

<template>
  <div class="relative overflow-hidden w-screen h-screen">
    <main class="flex flex-col w-full h-full">
      <div class="flex flex-col w-full h-full">
        <BannerLearnMore />
        <section class="flex-1 overflow-hidden">
          <slot />
        </section>
      </div>
    </main>
  </div>
</template>
