import Fetch from "..";
import { IAuthLimit, IUserProfile } from "./type";

export async function loginWithGoogle(params: any): Promise<IAuthLimit> {
  try {
    const { data } = await Fetch.post<{ data: IAuthLimit }>(`@api/auth/login`, {
      data: params,
      provider: "google",
    });
    return data.data;
  } catch (error: any) {
    console.error("loginByProject er", error.response.status);

    return { access_token: "", id: "", status: error?.response?.status || 500 };
  }
}

export async function getUserInfo(): Promise<IUserProfile> {
  try {
    const { data } = await Fetch.get<{ data: IUserProfile }>(`@api/users/profile`);

    return data.data;
  } catch (error) {
    console.log("getUserInfo er", error);
    return { name: "" } as IUserProfile;
  }
}

export async function getSubscriptionPrice() {
  try {
    const { data } = await Fetch.get<{ data: { extra_balance: number; price: number } }>(`@api/subscriptions/price`);

    return data.data;
  } catch (error) {
    console.log("getSubscriptionPrice er", error);
    return { price: 0, extra_balance: 0 };
  }
}

export async function payToJoinSubscription() {
  try {
    const { data } = await Fetch.post<{ data: { status: "pending"; tx_signature: string } }>(`@api/subscriptions/buy`, {});
    return data;
  } catch (error: any) {
    console.error("payToJoinSubscription er", error.response.status);

    return null;
  }
}
