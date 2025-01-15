export interface IChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  completed: boolean;
  data: {
    observations?: IObservation[];
    actions?: any;
    reply_message?: IChatMessage;
  };
  created_at: string;
}

export type TAction = "agent_chat" | "url";

export interface IAction {
  label: string;
  type: TAction;
  params: any;
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
  | "degen_first_alert"
  | "degen_second_alert"
  | "walletsaddressassets_get"
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
  is_readonly?: boolean;
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
  suggested_messages: { message: string }[];
  socials: { icon_url: string; title: string; url: string }[];
}
