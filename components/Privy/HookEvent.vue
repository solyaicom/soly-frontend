<script setup lang="ts">
import { applyPureReactInVue } from "veaury";
import Hook from "~/react_app/Hook";
const PrivyHookComponent = applyPureReactInVue(Hook);
</script>

<template>
  <PrivyHookComponent />
</template>
