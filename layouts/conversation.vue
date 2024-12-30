<script setup lang="ts">
import BannerLearnMore from "~/components/partials/BannerLearnMore.vue";
</script>

<template>
  <div class="relative overflow-hidden w-screen h-screen">
    <main>
      <img src="/images/app-bg.png" class="w-full h-full absolute z-[-1] top-0" />

      <div>
        <BannerLearnMore />
        <section class="w-screen h-screen lg:p-8 lg:pt-0 overflow-hidden">
          <slot />
        </section>
      </div>
    </main>
  </div>
</template>
