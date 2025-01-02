<template>
  <section id="feat" class="home-container-secondary home__gap-section">
    <h2 class="home__title">AI-Infused Solana</h2>
    <p class="home__subtitle">Seamless integration with top AI models for effortless, intelligent blockchain experiences.</p>
    <div class="mt-6 sm:mt-10 lg:mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
      <div id="feat-sol" class="bg-[#202020] py-4 px-6 min-h-56 rounded-xl sm:col-span-2 flex flex-col sm:justify-center">
        <p class="feat-title">Fully integrated with Solana</p>
        <p class="feat-subtitle">Built for Solana with effortless integration into top AI models.</p>
      </div>
      <div id="feat-world" class="bg-[#202020] py-4 px-6 min-h-56 rounded-xl col-span-1 sm:row-span-2">
        <p class="feat-title">Smooth Transactions</p>
        <p class="feat-subtitle">
          Enjoy ultra-efficient, instant, and frictionless transactions. Fully integrated with Solana for seamless trading, token swaps (especially
          memecoin), NFT transactions, and blockchain tracking.
        </p>
      </div>
      <div class="bg-[#202020] py-4 sm:py-10 px-6 min-h-56 rounded-xl col-span-1">
        <NuxtIcon filled name="soly" class="text-4xl" />
        <p class="feat-title mt-4">Cutting-edge AI agents</p>
        <p class="feat-subtitle">
          Built for Solana, leveraging on-chain tools, data, and top AI models like OpenAI, Claude, and Gemini for seamless automation and smart
          decision-making.
        </p>
      </div>
      <div class="bg-[#202020] py-4 sm:py-10 px-6 min-h-56 rounded-xl col-span-1">
        <NuxtIcon filled name="nodes" class="text-4xl" />
        <p class="feat-title mt-4">Complete Ecosystem Connectivity</p>
        <p class="feat-subtitle">
          Easily access the full range of Solana's protocols and services. Our platform ensures seamless AI-driven collaboration for maximum synergy
          with the ecosystem.
        </p>
      </div>
    </div>
  </section>
</template>

<style lang="css" scoped>
.feat-title {
  @apply text-xl font-semibold text-white mb-2;
}
.feat-subtitle {
  @apply text-base font-light text-home-neutral-400;
}
#feat-sol {
  background-image: url(~/assets/images/home/feat-sol.png);
  background-position: right;
  background-repeat: no-repeat;
  background-size: contain;
}
#feat-world {
  background-image: url(~/assets/images/home/feat-world.png);
  background-position: right;
  background-repeat: no-repeat;
  background-size: contain;
}
</style>
