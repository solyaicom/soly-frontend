<script setup lang="ts">
import BannerLearnMore from "~/components/partials/BannerLearnMore.vue";
</script>

<template>
  <div class="relative overflow-hidden w-screen h-screen">
    <main>
      <div>
        <BannerLearnMore />
        <section class="w-screen h-screen overflow-hidden">
          <slot />
        </section>
      </div>
    </main>
  </div>
</template>
