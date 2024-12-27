export interface IChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  completed: boolean;
  data: {
    observations?: IObservation[];
  };
}

export interface IObservation {
  id: string;
  completed: boolean;
  tools: ITool[];
}

export interface ITool {
  id: string;
  name: "tokensaddressinfo_get" | "tokensaddressprice_get" | "dataset_";
  inputs: any;
  outputs: string; // jsonstringify
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
  metadata?: IAgentMetadata;
}

export interface IAgentMetadata {
  capabilities: { sub_title: string; title: string }[];
  socials: { icon_url: string; title: string; url: string }[];
}
