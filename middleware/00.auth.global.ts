import { getUserInfo } from "~/services/api/auth/api";
import { useSolana } from "~/stores/useSolana";

const requiredAuthLayouts = ["conversation", "default", "home"];

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (!to.meta.layout || to.meta.guest || !requiredAuthLayouts.includes(to.meta.layout)) return;
  const { setAccessToken, getAccessToken, setUser, getUser } = useAuthStore();
  const app = useAppSetting();
  const conversation = useConversationStore();
  const solana = useSolana();
  let userInfo = getUser();
  if (getAccessToken()) {
    userInfo = await getUserInfo();

    setUser(userInfo);
  } else if (to.name !== "index") {
    return navigateTo("/auth/login");
  }
  if (to.meta.layout === "home") return;
  if (userInfo.subscription.status !== "active") {
    if (to.path !== "/payment") return navigateTo("/payment");
  }

  const arrPros = [app.init()];
  if (to.meta.layout === "conversation") {
    arrPros.push(conversation.init(), solana.init(true));
  }
  Promise.all(arrPros);

  if (userInfo.subscription.status === "active" && to.path === "/payment") return navigateTo("/c");
});
