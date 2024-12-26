<template>
  <div class="relative overflow-hidden">
    <main>
      <img src="/images/landing-background.png" class="w-full h-full absolute z-[-1] top-0" />
      <a href="https://docs.solyai.com/" target="_blank" class="fixed top-0 w-full">
        <div class="bg-linear w-full py-2 text-[16px] font-[600] text-center">New to SolyAI? Learn more here</div>
      </a>
      <section class="w-full h-screen overflow-y-scroll">
        <slot />
      </section>
    </main>
  </div>
</template>
