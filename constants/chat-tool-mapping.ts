import { TToolName } from "~/services/api/chat/type";

export const MAPPING_TOOL_NAME: { [key in TToolName]: string } = {
  tokensaddressinfo_get: "Search Token Information",
  tokensaddressprice_get: "Search Token Price",
  solyAiTradingQuoteAPIPost: "Preview Swap Detail",
  solyAiTradingBalanceGet: "Check Token Balance",
  solyAiTradingQuoteExecutePost: "Swap Token",
  dataset_: "Search Token Address",
};
