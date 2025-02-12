<script setup lang="ts">
import { getUserInfo, loginWithProvider } from "~/services/api/auth/api";
import ButtonPrivyLogin from "~/react_app/LoginButton";

import { applyPureReactInVue } from "veaury";

const PrivyLogin = applyPureReactInVue(ButtonPrivyLogin);
const props = defineProps<{
  text?: string;
  onSuccess: (access_token: string) => void;
}>();

const { setUser, setAccessToken } = useAuthStore();

const handleOnSuccess = async (token: string) => {
  // send code to a backend server to verify it.
  const res = await loginWithProvider("privy", { id_token: token });

  if (res.access_token) {
    setAccessToken(res.access_token);
    const newUser = await getUserInfo();

    setUser(newUser);
    props.onSuccess(res.access_token);
  }
};
</script>

<template>
  <PrivyLogin @success="handleOnSuccess" />
</template>
