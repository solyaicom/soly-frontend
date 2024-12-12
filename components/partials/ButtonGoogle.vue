<script setup lang="ts">
import { getUserInfo, loginWithGoogle } from "~/services/api/auth/api";

const { setUser } = useAuthStore();

const handleOnSuccess = async (response: { access_token: string }) => {
  // send code to a backend server to verify it.
  console.log("Code: ", response);
  const res = await loginWithGoogle({ access_token: response.access_token });
  if (res.access_token) {
    localStorage.setItem("access_token", res.access_token);
    const newUser = await getUserInfo();
    setUser(newUser);
  }
  console.log("res loginWithGoogle", res);
};

const handleOnError = (errorResponse: any) => {
  console.log("Error: ", errorResponse);
};

const { isReady, login } = useTokenClient({
  onSuccess: handleOnSuccess,
  onError: handleOnError,
  // other options
});
</script>

<template>
  <PartialsButton text="Continue with Google" class="mb-4" @click="login" />
</template>
