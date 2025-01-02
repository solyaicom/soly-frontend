<template>
  <section id="intro" class="sm:min-h-[78svh] flex items-center justify-center">
    <div class="home-container w-full h-full flex flex-col-reverse sm:flex-row flex-wrap items-center justify-center home__gap-section gap-y-4">
      <div class="w-full md:w-3/5 text-center sm:text-left">
        <h1 class="font-semibold text-2xl sm:text-4xl lg:text-6xl whitespace-pre">{{ `GM 👋 I'm Soly \nYour Personal AI Agent \non Solana` }}</h1>
        <p class="mt-4 mb-6 text-lg sm:text-2xl font-light text-home-neutral-400">Empowering Decisions with On-Chain Intelligence</p>
        <NuxtLink to="/c" class="btn__solid btn__solid-white rounded-lg">Launch App</NuxtLink>
      </div>
      <div class="w-2/4 mx-auto md:w-2/5 max-w-md">
        <div id="icon" class="relative ml-auto w-[90%] aspect-square rounded-full overflow-hidden bg-white">
          <div id="icon-face" class="w-4/5 sm:w-[86%] aspect-square rounded-full absolute bottom-2 left-1/2 -translate-x-1/2">
            <div class="absolute top-1/4 left-1/2 -translate-x-1/2 w-3/4 h-1/3 flex items-center justify-around">
              <div id="eye-left" class="icon-eye"></div>
              <div id="eye-right" class="icon-eye"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <section class="home-container home__gap-section">
    <img src="~/assets/images/home/capture.png" alt="capture" class="w-full h-auto" />
  </section>
</template>

<style lang="css" scoped>
#icon {
  box-shadow: 1.24px 14.84px 51.34px 0px #00000080 inset;
}
#icon-face {
  background: linear-gradient(180deg, #130c14 0%, #000000 100%);
}
.icon-eye {
  @apply w-[5%] min-w-4 sm:min-w-9 sm:max-h-24 h-4/5 bg-white rounded-full;
}
</style>
