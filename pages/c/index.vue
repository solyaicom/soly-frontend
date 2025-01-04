<script setup lang="ts">
import ChatScreen from "~/screens/ChatScreen.vue";

definePageMeta({
  layout: "conversation",
});

useSeoMeta({
  title: "Soly AI",
  description: "The First Personalized DeFAI Agent Platform On Solana",
});
</script>

<template>
  <ChatScreen />
</template>
