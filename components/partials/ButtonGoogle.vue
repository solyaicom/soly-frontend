<script setup lang="ts">
import { getUserInfo, loginWithGoogle } from "~/services/api/auth/api";

const props = defineProps<{
  text?: string;
  onSuccess: (access_token: string) => void;
}>();

const { setUser, setAccessToken } = useAuthStore();

const handleOnSuccess = async (response: { access_token: string }) => {
  // send code to a backend server to verify it.
  const res = await loginWithGoogle({ access_token: response.access_token });

  if (res.access_token) {
    setAccessToken(res.access_token);
    const newUser = await getUserInfo();

    setUser(newUser);
    props.onSuccess(res.access_token);
  }
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
  <PartialsButton :text="text || 'Continue'" class="mb-4" @click="login" />
</template>
