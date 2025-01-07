import Fetch from "..";
import { IAgent, IChatMessage, IConversation } from "./type";

export async function createNewConversation(agent_id?: string): Promise<any> {
  try {
    const { data } = await Fetch.post<{ data: any }>(`@api/conversations/new`, {
      agent_id,
    });
    return data.data;
  } catch (error: any) {
    console.error("createNewConversation er", error.response.status);

    return null;
  }
}

export async function findConversationById(id: string): Promise<IConversation | undefined> {
  try {
    const { data } = await Fetch.get<{ data: IConversation }>(`@api/conversations/${id}`);
    return data.data;
  } catch (error: any) {
    console.error("findConversationById er", error.response.status);

    return undefined;
  }
}

export async function fetchChatHistory(
  conv_id: string,
  params: {
    first_message_id?: string;
    last_message_id?: string;
  } = {}
): Promise<IChatMessage[]> {
  try {
    const { data } = await Fetch.get<{ data: IChatMessage[] }>(`@api/conversations/${conv_id}/history`, {
      params: {
        ...params,
        limit: 20,
      },
    });
    return data.data;
  } catch (error: any) {
    console.error("fetchChatHistory er", error.response.status);

    return [];
  }
}

export async function fetchConversations(): Promise<IConversation[]> {
  try {
    const { data } = await Fetch.get<{ data: IConversation[] }>(`@api/conversations`);
    return data.data;
  } catch (error: any) {
    console.error("fetchConversations er", error.response.status);

    return [];
  }
}

export async function deleteConversationById(id: string): Promise<boolean> {
  try {
    const { data } = await Fetch.delete<{ data: IConversation }>(`@api/conversations/${id}`);
    return true;
  } catch (error: any) {
    console.error("findConversationById er", error.response.status);
    return false;
  }
}

export async function fetchListAgents(): Promise<IAgent[]> {
  try {
    const { data } = await Fetch.get<{ data: IAgent[] }>(`@api/agents`);
    return data.data;
  } catch (error: any) {
    console.error("fetchListAgents er", error);

    return [];
  }
}

export async function fetchListChannel(): Promise<IConversation[]> {
  try {
    const { data } = await Fetch.get<{ data: IConversation[] }>(`@api/channels`);
    return data.data;
  } catch (error: any) {
    console.error("fetchListChannel er", error);

    return [];
  }
}
