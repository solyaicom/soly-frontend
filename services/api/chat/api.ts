import Fetch from "..";
import { IChatMessage, IConversation } from "./type";

export async function createNewConversation(): Promise<any> {
  try {
    const { data } = await Fetch.post<{ data: any }>(`@api/conversations/new`, undefined);
    return data.data;
  } catch (error: any) {
    console.error("createNewConversation er", error.response.status);

    return null;
  }
}

export async function findConversationById(id: string): Promise<IConversation | null> {
  try {
    const { data } = await Fetch.get<{ data: IConversation }>(`@api/conversations/${id}`);
    return data.data;
  } catch (error: any) {
    console.error("findConversationById er", error.response.status);

    return null;
  }
}

export async function fetchChatHistory(conv_id: string): Promise<IChatMessage[]> {
  try {
    const { data } = await Fetch.get<{ data: IChatMessage[] }>(`@api/conversations/${conv_id}/history`);
    return data.data;
  } catch (error: any) {
    console.error("fetchChatHistory er", error.response.status);

    return [];
  }
}
