import { getUserInfo } from "~/services/api/auth/api";
import { useSolana } from "~/stores/useSolana";

const requiredAuthLayouts = ["conversation"];

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (!to.meta.layout || to.meta.guest || !requiredAuthLayouts.includes(to.meta.layout)) return;
  const { setAccessToken, getAccessToken, setUser, getUser } = useAuthStore();
  const app = useAppSetting();
  const conversation = useConversationStore();
  const solana = useSolana();

  if (getAccessToken()) {
    const userInfo = await getUserInfo();
    setUser(userInfo);
  } else {
    return navigateTo("/auth/login");
  }
  const arrPros = [app.init(), conversation.init()];
  if (to.meta.layout === "conversation") {
    arrPros.push(app.init(), conversation.init(), solana.init(true));
  }
  await Promise.all(arrPros);
});
