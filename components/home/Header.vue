<script setup lang="ts">
import { APP_DATA_LINK } from "~/constants";

const authStore = useAuthStore();
const { balance } = useSolana();

const menu = ref([
  // { label: "Github", icon: "", url: APP_DATA_LINK.github },
  { label: "Docs", icon: "", url: APP_DATA_LINK.docs },
  { label: "Twitter", icon: "x", url: APP_DATA_LINK.x },
]);

const user = computed(() => authStore.user);
</script>

<template>
  <header class="relative min-h-20 container px-4 sm:px-6 flex items-center">
    <img src="/home/logo.png" alt="logo" class="h-7 w-auto shrink-0" />
    <ul class="flex-1 flex items-center justify-end gap-3 sm:gap-10">
      <li v-for="item in menu" :key="item.label">
        <NuxtLink
          :target="item.url.startsWith('http') ? '_blank' : '_self'"
          :to="item.url"
          class="text-base text-home-neutral-400 hover:text-white/80"
        >
          <NuxtIcon v-if="item.icon" :name="item.icon" class="text-lg" />
          <span v-else>{{ item.label }}</span>
        </NuxtLink>
      </li>
      <li>
        <NuxtLink v-if="!user.id" to="/auth/login" class="btn__solid btn__solid-white h-12">Log in</NuxtLink>
        <NuxtLink v-else to="/c" class="border border-white/10 rounded-full btn__solid gap-2 h-12 pl-2 pr-4">
          <img v-if="user.avatar_url" :src="user.avatar_url" alt="avt" class="w-8 h-8 rounded-full object-cover" />
          <div class="text-left">
            <p class="text-sm">{{ user.wallet.address ? shortAddress(user.wallet.address) : user.name }}</p>
            <p class="text-xs text-home-neutral-400">{{ formatNumber(balance, 3) }} SOL</p>
          </div>
        </NuxtLink>
      </li>
      <li>
        <PartialsBtnSolConnect />
      </li>
    </ul>
  </header>
</template>
