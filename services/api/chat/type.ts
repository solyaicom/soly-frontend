export interface IChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  completed: boolean;
}
