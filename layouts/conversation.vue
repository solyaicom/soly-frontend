<template>
  <div class="relative overflow-hidden w-screen h-screen">
    <main>
      <img src="/images/app-bg.png" class="w-full h-full absolute z-[-1] top-0" />

      <div>
        <a href="https://docs.solyai.com/" target="_blank">
          <div class="bg-linear w-full py-2 text-[16px] font-[600] text-center">New to SolyAI? Learn more here</div>
        </a>
        <section class="w-screen h-screen lg:p-8 lg:pt-0 overflow-hidden">
          <slot />
        </section>
      </div>
    </main>
  </div>
</template>
