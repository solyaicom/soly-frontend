import Fetch from "..";

export async function createNewConversation(): Promise<any> {
  try {
    const { data } = await Fetch.post<{ data: any }>(`@api/conversations/new`, undefined);
    return data.data;
  } catch (error: any) {
    console.error("createNewConversation er", error.response.status);

    return null;
  }
}
