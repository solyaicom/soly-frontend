import { defineStore } from "pinia";
import { IUserProfile } from "~/services/api/auth/type";

const storageKey = "access_token";
export const useAuthStore = defineStore("auth", () => {
  const accessToken = useLocalStorage(storageKey, "");

  const user = ref<IUserProfile>({ name: "" } as IUserProfile);

  function setUser(userInfo?: IUserProfile) {
    user.value = userInfo || ({ name: "" } as IUserProfile);
  }

  function getUser(): IUserProfile {
    return user.value;
  }

  function setAccessToken(newToken: string) {
    accessToken.value = newToken;
    localStorage.setItem(storageKey, newToken);
  }
  return {
    getUser,
    setUser,
    getAccessToken() {
      return accessToken.value;
    },
    setAccessToken,
  };
});
