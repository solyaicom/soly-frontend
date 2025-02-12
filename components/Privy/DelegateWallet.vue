<script setup lang="ts">
import DelegateWallet from "~/react_app/DelegateWallet";

import { applyPureReactInVue } from "veaury";

defineProps<{
  onSuccess: () => void;
  onError: (error?: any) => void;
}>();

const PrivyDelegateWallet = applyPureReactInVue(DelegateWallet);
</script>

<template>
  <PrivyDelegateWallet @success="onSuccess" @error="onError" />
</template>
