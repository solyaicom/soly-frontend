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

export type TToolID =
  | "tokensaddressinfo_get"
  | "tokensaddressprice_get"
  | "dataset_4f7c1e48-f62d-4f75-bf3b-80d4167a50a9"
  | "solyAiTradingQuoteAPIPost"
  | "solyAiTradingBalanceGet"
  | "solyAiTradingQuoteExecutePost"
  | "tokensaddressaggdev-check_get"
  | "tokensaddressaggtop-holdersportfolio_get"
  | "tokenstop_get"
  | "tokensaddressaggtop-holders_get";

export interface ITool {
  id: TToolID;
  name: string;
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
