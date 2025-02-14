<script setup lang="ts">
import DepositWallet from "~/react_app/DepositWallet";

import { applyPureReactInVue } from "veaury";

const props = defineProps<{
  onSuccess: () => void;
  onError: (error?: any) => void;
}>();

const PrivyDepositWallet = applyPureReactInVue(DepositWallet);
</script>

<template>
  <PrivyDepositWallet @success="onSuccess" @error="onError" />
</template>
