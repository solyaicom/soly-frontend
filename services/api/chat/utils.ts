import { IChatMessage } from "./type";

export function getQuote(message: IChatMessage) {
  try {
    if (!message) return {};
    const data = message.data;
    if (!data) return {};

    if (!data.observations) return {};

    const lastObservation = data.observations[data.observations.length - 1];
    if (!lastObservation) return {};

    const tools = lastObservation.tools;
    if (!tools) return {};
    const lastTool = tools[tools.length - 1];
    if (!lastTool) return {};
    const findTradingQuote = tools.find((tool) => tool.name === "solyAiTradingQuoteAPIPost");
    if (!findTradingQuote) return {};
    const realOutput = findTradingQuote.outputs.split("tool response: ")[0];
    return JSON.parse(realOutput).output;
  } catch (error) {
    console.log("getQuote error", error);
    return {};
  }
}

export function findQuoteIdFromMessage(message: IChatMessage) {
  try {
    const quote = getQuote(message);
    return quote.quote_id;
  } catch (error) {
    console.log("findQuoteIdFromMessage", error);
    return "";
  }
}

export function checkMessageExpired(message: IChatMessage) {
  try {
    const quote = getQuote(message);
    return quote.expire_at > Date.now();
  } catch (error) {
    console.log("checkMessageExpire", error);
    return true;
  }
}
