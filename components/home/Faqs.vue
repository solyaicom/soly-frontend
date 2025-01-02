<script setup lang="ts">
const faqs = ref([
  {
    title: "What is Soly?",
    content: [
      "Soly is a multi-platform on-chain analysis AI assistant that offers a wide range of chat to help you gain confluence and confidence in your trades and on-chain research. It simplifies complex processes, providing actionable insights and automation.",
    ],
  },
  {
    title: "How does the soly work?",
    content: [
      `Soly's AI agents take user input and leverage tools to perform on-chain actions. Users provide simple chat, and Soly's AI processes the information to deliver precise, real-time results.`,
    ],
  },
  { title: "What types of actions can Soly take?", content: [] },
  {
    title: "Upcoming feature:",
    content: [
      "Memecoin Automation — Autonomously create a memecoin on Pump.fun every time choosen KOL tweets.",
      `KOL-driven Trades — Automatically buy every memecoin a KOL tweets about.`,
      `Token Trendspotting — Identify and buy trending tokens before they surge.`,
      `Sentiment Analysis — Decide whether to buy or sell a token based on the sentiment of a tweet.`,
    ],
  },
]);

const showed = ref([0]);

function onToggleFaq(index: number) {
  if (showed.value.includes(index)) {
    showed.value = showed.value.filter((i) => i !== index);
  } else {
    showed.value = [...showed.value, index];
  }
}
</script>

<template>
  <section id="faqs" class="home-container-secondary home__gap-section">
    <h2 class="home__title">FAQs</h2>
    <div class="mt-6 sm:mt-10 lg:mt-14 flex flex-col">
      <HomeCollapse
        v-for="(item, i) in faqs"
        :key="i"
        :title="item.title"
        :content="item.content"
        :show="showed.includes(i)"
        @toggle="onToggleFaq(i)"
      >
        <div v-if="i === 2" class="text-home-neutral-400">
          <p>Soly is capable of executing a variety of on-chain actions, including:</p>
          <ul class="mt-4 flex flex-col gap-2">
            <li>1. Trading tokens</li>
            <li>2. Searching for tokens:</li>
            <li class="ml-6">* Top Holders insight</li>
            <li class="ml-6">* Dev Detective</li>
          </ul>
        </div>
      </HomeCollapse>
    </div>
  </section>
</template>
