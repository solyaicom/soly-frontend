<script setup lang="ts">
defineProps<{
  show?: boolean;
  title: string;
  content: string[];
}>();

defineEmits(["toggle"]);
</script>

<template>
  <div class="py-6 flex flex-col border-b border-white/10">
    <div class="flex items-center gap-3 cursor-pointer" @click="$emit('toggle')">
      <p class="flex-1 text-white text-base sm:text-xl font-medium">{{ title }}</p>
      <NuxtIcon name="arrow-up" class="text-xl text-white shrink-0 transition-all" :class="show ? 'rotate-180' : ''" />
    </div>
    <div v-if="show" class="mt-3 flex flex-col gap-2">
      <template v-if="!content.length">
        <slot />
      </template>
      <template v-else>
        <p v-for="(co, j) in content" :key="j" class="text-home-neutral-400">
          {{ co }}
        </p>
      </template>
    </div>
  </div>
</template>
