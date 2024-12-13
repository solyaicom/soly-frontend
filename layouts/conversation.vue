<template>
  <div class="relative overflow-hidden lg:p-8">
    <main>
      <img src="/images/app-bg.png" class="w-full h-full absolute z-[-1] top-0" />

      <section class="w-full h-screen">
        <slot />
      </section>
    </main>
  </div>
</template>
