<script setup>
import { applyPureReactInVue } from "veaury";
import { useAppSetting } from "./stores/app";

import PriviReact from "~/react_app/PriviProvider.tsx";
import Hook from "~/react_app/Hook";
const PriviProvider = applyPureReactInVue(PriviReact);
const PrivyHook = applyPureReactInVue(Hook);

const app = useAppSetting();
const colorMode = useColorMode();
const vuePrivy = useVuePrivy();
const { getUser } = useAuthStore();
const solana = useSolana();
onMounted(() => {
  colorMode.value = "dark";
  window.addEventListener("message", (e) => {
    if (e.data.origin === "privy") {
      if (e.data.type === "user") {
        vuePrivy.setPrivyUser(e.data.data);
      }
      if (e.data.type === "data") {
        vuePrivy.setPrivyData(e.data.data);
      }
    }
  });
});

watch(
  () => getUser().wallet.is_active,
  () => {
    solana.init(true);
  }
);

onBeforeUnmount(() => {
  window.removeEventListener("message", () => {});
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
    <PrivyHook />
  </PriviProvider>
</template>
