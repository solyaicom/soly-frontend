<script setup lang="ts">
definePageMeta({
  layout: "home",
});

useSeoMeta({
  title: "Soly AI",
  description: "Chat with Soly AI",
});
</script>

<template>
  <div>
    <HomeHeader />
    <HomeIntro />
    <HomeAds />
    <HomeFeatures />
    <HomeFaqs />
    <HomeFooter />
  </div>
</template>
