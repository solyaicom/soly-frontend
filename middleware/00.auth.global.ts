import { getUserInfo } from "~/services/api/auth/api";

const requiredAuthLayouts = ["chat"];

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (!to.meta.layout || to.meta.guest || !requiredAuthLayouts.includes(to.meta.layout)) return;
  const { setAccessToken, getAccessToken, setUser, getUser } = useAuthStore();
  const app = useAppSetting();

  if (getAccessToken()) {
    const userInfo = await getUserInfo();
    setUser(userInfo);
  } else {
    return navigateTo("/auth/login");
  }
});
