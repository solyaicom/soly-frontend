<script setup lang="ts">
import BannerLearnMore from "~/components/partials/BannerLearnMore.vue";
</script>

<template>
  <div class="relative overflow-hidden">
    <main>
      <img src="/images/landing-background.png" class="w-full h-full absolute z-[-1] top-0" />
      <div class="fixed top-0 w-full">
        <BannerLearnMore />
      </div>

      <section class="w-full h-screen overflow-y-scroll">
        <slot />
      </section>
    </main>
  </div>
</template>
