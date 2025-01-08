import Fetch from "..";

export async function postInitNewTransfer(body: { amount: number; mint: string; to_address: string }): Promise<any> {
  try {
    const { data } = await Fetch.post<{ data: any }>(`@api/wallets/init-transfer`, body);
    return data.data;
  } catch (error: any) {
    console.error("createNewConversation er", error.response.status);

    return null;
  }
}

export async function postExecuteTransfer(body: { transfer_id: string }): Promise<any> {
  try {
    const { data } = await Fetch.post<{ data: any }>(`@api/wallets/execute-transfer`, body);
    return data.data;
  } catch (error: any) {
    console.error("createNewConversation er", error.response.status);

    return null;
  }
}
