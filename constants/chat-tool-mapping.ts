import { TToolID } from "~/services/api/chat/type";

export const MAPPING_TOOL_NAME: { [key in TToolID]: string } = {
  tokensaddressinfo_get: "Search Token Information",
  tokensaddressprice_get: "Search Token Price",
  solyAiTradingQuoteAPIPost: "Preview Swap Detail",
  solyAiTradingBalanceGet: "Check Token Balance",
  solyAiTradingQuoteExecutePost: "Swap Token",
  "dataset_4f7c1e48-f62d-4f75-bf3b-80d4167a50a9": "Search Token Address",
  "tokensaddressaggtop-holders_get": "Scan Top Holders",
  "tokensaddressaggdev-check_get": "Check Developer Profile",
  "tokensaddressaggtop-holdersportfolio_get": "Search Top Holders Portfolio",
  tokenstop_get: "Search Top Tokens",
};
