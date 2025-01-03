<script setup lang="ts">
import ChatScreen from "~/screens/ChatScreen.vue";

definePageMeta({
  layout: "conversation",
});

useSeoMeta({
  title: "Soly AI",
  description: "Chat with Soly AI",
});
</script>

<template>
  <ChatScreen />
</template>
