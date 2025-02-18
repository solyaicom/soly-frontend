import { getUserInfo } from "~/services/api/auth/api";
import { useSolana } from "~/stores/useSolana";

const requiredAuthLayouts = ["conversation", "default", "home"];

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (!to.meta.layout || to.meta.guest || !requiredAuthLayouts.includes(to.meta.layout)) return;
  const { setAccessToken, getAccessToken, setUser, getUser } = useAuthStore();
  const app = useAppSetting();
  const conversation = useConversationStore();
  let userInfo = getUser();
  if (getAccessToken()) {
    try {
      userInfo = await getUserInfo();
      if (!userInfo.privy_wallet) {
        throw new Error("");
      }
      setUser(userInfo);
    } catch (error) {
      localStorage.removeItem("access_token");

      return navigateTo("/auth/login");
    }
  } else if (to.name !== "index") {
    return navigateTo("/auth/login");
  }
  if (to.meta.layout === "home") return;
  if (userInfo.subscription.status !== "active") {
    if (to.path !== "/payment") return navigateTo("/payment");
  }

  if (to.meta.layout === "conversation") {
    app.init().then(() => console.log("app.init completed"));
    const route = useRoute();
    conversation.setConvID(route.params.conv_id as string);
    conversation.init().then(() => console.log("conversation.init completed"));
    useSolana()
      .init(true)
      .then(() => console.log("solana.init completed"));
  }
  if (userInfo.subscription?.status === "active" && to.path === "/payment") return navigateTo("/c");
  if (userInfo.subscription?.status === "active" && to.path === "/auth/login") return navigateTo("/c");
});
