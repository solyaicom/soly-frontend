<script setup lang="ts">
definePageMeta({
  layout: "landing",
  guest: true,
});

useSeoMeta({
  title: "Soly AI",
  description: "Chat with Soly AI",
});

const router = useRouter();

const items = [
  {
    title: "What is Soly?",
    content:
      "Soly is a multi-platform on-chain analysis AI assistant that offers a wide range of chat to help you gain confluence and confidence in your trades and on-chain research. It simplifies complex processes, providing actionable insights and automation.",
  },
  {
    title: "How does the soly work?",
    content:
      "Soly’s AI agents take user input and leverage tools to perform on-chain actions. Users provide simple chat, and Soly’s AI processes the information to deliver precise, real-time results.",
  },
  {
    title: "What types of actions can Soly take?",
    content:
      "Soly is capable of executing a variety of on-chain actions, including:\n> Trading tokens\n> Searching for tokens: \n- Top Holders insight\n- Dev Detective",
  },
  {
    title: "Upcoming feature:",
    content:
      "Memecoin Automation — Autonomously create a memecoin on Pump.fun every time choosen KOL tweets.\n\nKOL-driven Trades — Automatically buy every memecoin a KOL tweets about.\n\nToken Trendspotting — Identify and buy trending tokens before they surge.\n\nSentiment Analysis — Decide whether to buy or sell a token based on the sentiment of a tweet.",
  },
];

function onBack() {
  router.back();
}
</script>

<template>
  <section class="flex flex-col w-full h-full pt-8">
    <div class="row-center mt-4 px-10">
      <div class="cursor-pointer row-center" @click="onBack">
        <img src="/images/icon-arrow-back.svg" />
        <p class="ml-1">Back to Home</p>
      </div>
    </div>
    <div class="flex-1 flex flex-col w-full h-full items-center mt-[150px]">
      <p class="text-[72px] font-[600]">FAQs</p>
      <div v-for="(item, idx) in items" :key="idx" class="px-4 py-6 border-b-[1px] w-full border-app-line1 md:w-[560px] lg:w-[800px]">
        <PartialsFAQItem :item="item" />
      </div>
    </div>
  </section>
</template>
