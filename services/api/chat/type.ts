export interface IChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  completed: boolean;
}

export interface IConversation {
  id: string;
  name: string;
}
