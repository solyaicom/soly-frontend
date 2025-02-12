<script setup>
import { applyPureReactInVue } from "veaury";
import LoginButton from "~/react_app/LoginButton.tsx";

const PriviLogin = applyPureReactInVue(LoginButton);
</script>

<template>
  <div>
    <PriviLogin />
  </div>
</template>
