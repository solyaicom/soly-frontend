<script setup lang="ts">
const ads = ref([
  {
    icon: "ads-click",
    title: "Effortless One-Click Setup",
    content:
      "Launch your AI Agent instantly- no coding required - and personalize it to follow each user's' trading strategies. Agents have memory: Chat, Summarize, Save!",
  },
  {
    icon: "ads-platform",
    title: "Master Trading with DeFAI",
    content: "Integrate onchain activities and leverage AI-driven DeFi for the ultimate trading experience.",
  },
  {
    icon: "ads-data",
    title: "Insightful On-Chain Data",
    content: "Buy and sell tokens and NFTs securely, with lightning speed, while enjoying immersive digital experiences.",
  },
  {
    icon: "ads-agent",
    title: "Smart AI Agents for Facile Automation",
    content: "Transform your workflows & logics with advanced AI agents and tailored automations built to tackle complex tasks. ",
  },
]);
</script>

<template>
  <section id="ads" class="home-container home__gap-section">
    <h2 class="home__title">AI Agents Built for Web3 Automation</h2>
    <p class="home__subtitle">Effortlessly automate complex tasks with AI agents that streamline Web3 operations</p>
    <div class="mt-6 sm:mt-10 lg:mt-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
      <div v-for="(ad, idx) in ads" :key="idx" class="rounded-xl border border-white/10 p-4">
        <div class="h-14 w-14 rounded-2xl bg-[#1f1f1f] flex items-center justify-center">
          <NuxtIcon :name="ad.icon" filled class="text-4xl" />
        </div>
        <p class="text-white font-semibold text-lg lg:text-xl mt-3 mb-4 whitespace-break-spaces">{{ ad.title }}</p>
        <p class="text-sm sm:text-base font-light text-home-neutral-400">{{ ad.content }}</p>
      </div>
    </div>
  </section>
</template>
