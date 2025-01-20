import { MAPPING_TOOL_COMPONENT } from "~/constants/mapping-tool-component";

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

export type TToolID = keyof typeof MAPPING_TOOL_COMPONENT;

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
