<script setup lang="ts">
const items = ref([
  {
    logo: "/images/home/item-logo-meteora.png",
    logoSize: "h-[46px]",
    url: "https://www.meteora.ag/",
  },
  {
    logo: "/images/home/item-logo-m3m3.png",
    url: "https://m3m3.meteora.ag/",
    logoSize: "h-[36px]",
  },
  {
    logo: "/images/home/item-logo-assister.png",
    url: "https://www.assisterr.ai/",
    logoSize: "h-[25px]",
  },
  {
    logo: "/images/home/item-logo-llm.png",
    url: " https://x.com/ai160kg",
    logoSize: "h-[42px]",
  },
  {
    logo: "/images/home/item-logo-orbit.png",
    url: "https://www.orbitcryptoai.com/",
    logoSize: "h-[42px]",
  },
  {
    logo: "/images/home/item-logo-sphere.png",
    url: "https://sphereone.xyz/",
    logoSize: "h-[42px]",
  },
]);
</script>

<template>
  <section id="ads" class="home-container home__gap-section">
    <h2 class="home__title">Notable Partners</h2>
    <div class="mt-6 sm:mt-10 lg:mt-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
      <a v-for="(p, idx) in items" :key="idx" :href="p.url" target="_blank" class="flex items-center justify-center">
        <img :src="p.logo" :class="p.logoSize" />
      </a>
    </div>
  </section>
</template>
