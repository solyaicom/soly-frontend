<script setup lang="ts">
import { APP_DATA_LINK } from "~/constants";
</script>

<template>
  <footer class="py-8 sm:py-10 text-center flex items-center justify-center gap-4 mt-16 sm:mt-20">
    <p>© 2024 Soly AI. All rights reserved.</p>
    <a :href="APP_DATA_LINK.x" target="_blank" class="w-6 h-6 rounded-full border border-white/90 flex items-center justify-center">
      <NuxtIcon name="x" class="text-sm" />
    </a>
  </footer>
</template>
