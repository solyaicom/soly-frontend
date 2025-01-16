<script setup lang="ts">
import { fetchTokenAssets } from "~/services/solana/helius-api";
import { IFullToken } from "~/services/solana/type";

const props = defineProps<{ output: string }>();
const data = convertToolOutput(props.output);

const pairs = ref<any[]>([]);
const objToken = ref<{ [key: string]: IFullToken }>({});
const conversationStore = useConversationStore();
const isDesc = ref(true);
const currentType = ref<"liq" | "vol" | "fee">("fee");

onMounted(async () => {
  const ps = ((data.items as { pairs: any[] }[]) || [])
    .reduce((list, item) => {
      list.push(...item.pairs);
      return list;
    }, [] as any[])
    .sort((a, b) => (a.apr < b.apr ? 1 : -1));
  const listTokenAddress: string[] = [];
  ps.forEach((pair) => {
    if (!listTokenAddress.includes(pair.mint_x)) listTokenAddress.push(pair.mint_x);
    if (!listTokenAddress.includes(pair.mint_y)) listTokenAddress.push(pair.mint_y);
  });
  const tokens = await fetchTokenAssets(listTokenAddress);
  tokens.forEach((token) => {
    objToken.value[token.address] = token;
  });
  pairs.value = ps;
});

function onSortClick(type: "liq" | "vol" | "fee") {
  if (type === "fee") {
    pairs.value = pairs.value.sort((a, b) => (a.apr < b.apr ? 1 : -1));
  }
  if (type === "liq") {
    pairs.value = pairs.value.sort((a, b) => (a.liquidity < b.liquidity ? 1 : -1));
  }
  if (type === "vol") {
    pairs.value = pairs.value.sort((a, b) => (a.trade_volume_24h < b.trade_volume_24h ? 1 : -1));
  }
  if (type === currentType.value) {
    isDesc.value = !isDesc.value;
  }
  if (!isDesc.value) {
    pairs.value = pairs.value.reverse();
  }
  currentType.value = type;
}

function onViewDetail(address: string) {
  conversationStore.setCurrentMessage(`view detail pool ${address}`);
}
</script>

<template>
  <div class="rounded-b-[6px]">
    <div class="max-h-[390px] overflow-scroll relative">
      <table class="w-full min-w-[500px] bg-app-card1 border-separate py-3 px-2 text-center rounded-[6px]">
        <thead class="sticky z-[1] top-0 bg-app-card1">
          <tr class="text-app-text2 text-start">
            <td>Pool</td>
            <td>
              <div class="row-center cursor-pointer" @click="onSortClick('liq')">Liquidity <NuxtIcon name="icon-sort" /></div>
            </td>
            <td>
              <div class="row-center cursor-pointer" @click="onSortClick('vol')">24h Vol <NuxtIcon name="icon-sort" /></div>
            </td>
            <td>
              <div class="row-center cursor-pointer" @click="onSortClick('fee')">24h Fee/TVL <NuxtIcon name="icon-sort" /></div>
            </td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(pair, index) in pairs" :key="index">
            <td>
              <div class="row-center">
                <div class="relative w-[40px] h-[24px]">
                  <img :src="objToken[pair.mint_x].imageUrl" class="w-[22px] rounded-full" />
                  <img :src="objToken[pair.mint_y].imageUrl" class="w-[22px] absolute right-0 top-0 rounded-full" />
                </div>
                <p class="ml-1">{{ pair.name }}</p>
                <img v-if="pair.tags === 'high_risk'" src="/images/icon-error.svg" class="w-[16px] ml-1" />
              </div>
            </td>
            <td class="text-start min-w-[20%]">${{ formatNotationNumber(pair.liquidity) }}</td>
            <td class="text-start min-w-[20%]">${{ formatNotationNumber(pair.trade_volume_24h, 2) }}</td>
            <td class="text-start">{{ formatNotationNumber(pair.apr, 2) }}%</td>
            <td>
              <div class="text-blue-500 cursor-pointer" @click="onViewDetail(pair.address)">Details</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
