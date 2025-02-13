<script setup>
import { applyPureReactInVue } from "veaury";
import { useAppSetting } from "./stores/app";
import { ReactForVueProvider } from "~/react_app/ReactInVue";

import PriviReact from "~/react_app/PriviProvider.tsx";
const PriviProvider = applyPureReactInVue(PriviReact);
const ReactForVue = applyPureReactInVue(ReactForVueProvider);

const app = useAppSetting();
const colorMode = useColorMode();
onMounted(() => {
  colorMode.value = "dark";
});
</script>

<template>
  <Toaster />
  <div v-if="app.showLoading" class="fixed z-[9999] top-0 left-0 w-full h-full flex items-center justify-center bg-[rgba(0,0,0,0.8)]">
    <img src="/images/icon-loading.gif" class="w-[32px] h-[32px]" />
  </div>
  <PriviProvider>
    <NuxtLayout>
      <div class="w-full h-full">
        <NuxtPage />
      </div>
    </NuxtLayout>
  </PriviProvider>
</template>
