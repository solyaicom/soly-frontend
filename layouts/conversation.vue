<template>
  <div class="relative overflow-hidden w-screen h-screen">
    <main>
      <img src="/images/app-bg.png" class="w-full h-full absolute z-[-1] top-0" />

      <section class="w-screen h-screen lg:p-8 overflow-hidden">
        <slot />
      </section>
    </main>
  </div>
</template>
