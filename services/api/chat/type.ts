export interface IChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  completed: boolean;
}

export interface IConversation {
  id: string;
  name: string;
  agent?: IAgent;
}

export interface IAgent {
  id: string;
  name: string;
  description: string;
  avatar_url: string;
}
