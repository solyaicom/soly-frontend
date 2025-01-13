import { DefineComponent, RendererNode, VNode } from "vue";
import ItemBalanceGet from "~/components/chat/ItemBalanceGet.vue";
import ItemDevCheck from "~/components/chat/ItemDevCheck.vue";
import ItemSecondDegen from "~/components/chat/ItemSecondDegen.vue";
import ItemSwapPreview from "~/components/chat/ItemSwapPreview.vue";
import ItemSwapResult from "~/components/chat/ItemSwapResult.vue";
import ItemTokenHoldingByHolder from "~/components/chat/ItemTokenHoldingByHolder.vue";
import ItemTokenPrice from "~/components/chat/ItemTokenPrice.vue";
import ItemTokenSearch from "~/components/chat/ItemTokenSearch.vue";
import ItemTopHolder from "~/components/chat/ItemTopHolder.vue";
import ItemTopToken from "~/components/chat/ItemTopToken.vue";
import ItemWalletPorfolio from "~/components/chat/ItemWalletPorfolio.vue";
import { TToolID } from "~/services/api/chat/type";

export const MAPPING_TOOL_COMPONENT: { [key in TToolID]: { name: string; component: any; render?: (tool: any) => VNode } } = {
    tokensaddressinfo_get: { name: "Search Token Information", component: null },
    tokensaddressprice_get: { name: "Search Token Price", component: ItemTokenPrice },
    solyAiTradingQuoteAPIPost: { name: "Preview Swap Detail", component: ItemSwapPreview },
    solyAiTradingBalanceGet: { name: "Check Token Balance", component: ItemBalanceGet },
    walletsaddressassets_get: { name: "Search Wallet Porfolio", component: ItemWalletPorfolio },
    solyAiTradingQuoteExecutePost: { name: "Swap Token", component: ItemSwapResult },
    "dataset_4f7c1e48-f62d-4f75-bf3b-80d4167a50a9": { name: "Search Token Address", component: ItemTokenSearch },
    "tokensaddressaggtop-holders_get": { name: "Scan Top Holders", component: ItemTopHolder },
    "tokensaddressaggdev-check_get": { name: "Check Developer Profile", component: ItemDevCheck },
    "tokensaddressaggtop-holdersportfolio_get": { name: "Search Top Holders Portfolio", component: ItemTokenHoldingByHolder },
    tokenstop_get: { name: "Search Top Tokens", component: ItemTopToken },
    degen_first_alert: { name: "", component: ItemBalanceGet },
    degen_second_alert: { name: "", component: ItemSecondDegen },
};
