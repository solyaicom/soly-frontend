import ItemBalanceGet from "~/components/chat/ItemBalanceGet.vue";
import ItemDeposit from "~/components/chat/ItemDeposit.vue";
import ItemDevCheck from "~/components/chat/ItemDevCheck.vue";
import ItemFindPool from "~/components/chat/ItemFindPool.vue";
import ItemFirstDegen from "~/components/chat/ItemFirstDegen.vue";
import ItemListPosition from "~/components/chat/ItemListPosition.vue";
import ItemPoolDetail from "~/components/chat/ItemPoolDetail.vue";
import ItemSecondDegen from "~/components/chat/ItemSecondDegen.vue";
import ItemSwapPreview from "~/components/chat/ItemSwapPreview.vue";
import ItemSwapResult from "~/components/chat/ItemSwapResult.vue";
import ItemTokenHoldingByHolder from "~/components/chat/ItemTokenHoldingByHolder.vue";
import ItemTokenPrice from "~/components/chat/ItemTokenPrice.vue";
import ItemTokenSearch from "~/components/chat/ItemTokenSearch.vue";
import ItemTopHolder from "~/components/chat/ItemTopHolder.vue";
import ItemTopToken from "~/components/chat/ItemTopToken.vue";
import ItemWalletPorfolio from "~/components/chat/ItemWalletPorfolio.vue";

export const MAPPING_TOOL_COMPONENT = {
    tokensaddressprice_get: { name: "Search Token Price", component: ItemTokenPrice, binding: { token: "token", inputs: "inputs" } },
    solyAiTradingQuoteAPIPost: { name: "Preview Swap Detail", component: ItemSwapPreview },
    solyAiTradingBalanceGet: { name: "Check Token Balance", component: ItemBalanceGet, binding: { inputs: "inputs" } },
    walletsaddressassets_get: { name: "Search Wallet Porfolio", component: ItemWalletPorfolio },
    solyAiTradingQuoteExecutePost: { name: "Swap Token", component: ItemSwapResult },
    executetransactionpost: { name: "", component: ItemSwapResult },
    "dataset_4f7c1e48-f62d-4f75-bf3b-80d4167a50a9": { name: "Search Token Address", component: ItemTokenSearch },
    dataset_4f7c1e48_f62d_4f75_bf3b_80d4167a50a9: { name: "Search Token Address", component: ItemTokenSearch },
    "tokensaddressaggtop-holders_get": { name: "Scan Top Holders", component: ItemTopHolder },
    "tokensaddressaggdev-check_get": { name: "Check Developer Profile", component: ItemDevCheck },
    "tokensaddressaggtop-holdersportfolio_get": { name: "Search Top Holders Portfolio", component: ItemTokenHoldingByHolder },
    tokenstop_get: { name: "Search Top Tokens", component: ItemTopToken },
    degen_first_alert: { name: "", component: ItemFirstDegen, binding: { created_at: "created_at", "is-preview": "isPreview", inputs: "inputs" } },
    degen_second_alert: { name: "", component: ItemSecondDegen, binding: { created_at: "created_at", inputs: "inputs" } },
    dlmmpairsaddress_get: { name: "Search for DLMM pool details", component: ItemPoolDetail },
    dlmmpairs_get: { name: "Find DLMM pools on Meteora", component: ItemFindPool },
    dlmmwalletsaddresspositions_get: { name: "Find Position", component: ItemListPosition },
    dlmmactionsinit_post: { name: "Add Liquidity", component: ItemDeposit },
};
