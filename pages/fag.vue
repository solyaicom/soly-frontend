<script setup lang="ts">
definePageMeta({
  layout: "landing",
  guest: true,
});

const router = useRouter();

function onBack() {
  router.back();
}
</script>

<template>
  <section class="flex flex-col w-full h-full">
    <div class="row-center mt-6 px-10">
      <div class="cursor-pointer row-center" @click="onBack">
        <img src="/images/icon-arrow-back.svg" />
        <p class="ml-1">Back to Home</p>
      </div>
    </div>
    <div class="flex-1 flex flex-col w-full h-full items-center justify-center"></div>
  </section>
</template>
