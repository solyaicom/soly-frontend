<script setup lang="ts">
import ChatScreen from "~/screens/ChatScreen.vue";

definePageMeta({
  layout: "conversation",
});

useSeoMeta({
  title: "I'm Soly - Your Personal AI Agent",
  description:
    "The groundbreaking fusion of blockchain and AI on Solana. Experience our self-learning AI agents that get smarter over time. Safe, simple, and always working for you.",
});
</script>

<template>
  <ChatScreen />
</template>
