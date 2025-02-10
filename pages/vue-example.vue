<template>
  <SimpleInput :value="value" @change="value = $event.target.value" />
</template>
<script setup>
import { applyPureReactInVue, applyReactInVue, injectSyncUpdateForPureReactInVue } from "veaury";
import ReactSimpleInput from "~/react_app/PriviProvider.jsx";

// The component only needs to be injected globally once. If injected multiple times, it is equivalent to appending and overwriting function hooks.
injectSyncUpdateForPureReactInVue(ReactSimpleInput, {
  // The name of the hook function that determines the content update of the Input component
  onChange(args) {
    return {
      value: args.target.value,
    };
  },
});

const SimpleInput = applyReactInVue(ReactSimpleInput);
const value = ref("");
</script>
