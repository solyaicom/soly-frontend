<script setup lang="ts">
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ref } from "vue";

defineProps<{
  item: { content: string; title: string };
}>();

const isOpen = ref(false);
</script>

<template>
  <Collapsible v-model:open="isOpen">
    <CollapsibleTrigger class="w-full">
      <div class="row-center text-[20px] w-full">
        <p class="flex-1 text-start">{{ item.title }}</p>
        <img src="/images/icon-arrow-down.svg" class="duration-200" :class="isOpen ? 'rotate-180' : 'rotate-0'" />
      </div>
    </CollapsibleTrigger>
    <CollapsibleContent>
      <p class="mt-2 whitespace-pre-line">{{ item.content }}</p>
    </CollapsibleContent>
  </Collapsible>
</template>
