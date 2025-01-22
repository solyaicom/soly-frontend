<script setup lang="ts">
import { findDepositAction, getPairDetail, updateDepositAction } from "~/services/api/chat/api";
import { getPoolBin } from "~/services/solana/dlmm";
import { fetchTokenAssets } from "~/services/solana/helius-api";
import { IFullToken } from "~/services/solana/type";

const props = defineProps<{ output: string }>();
const data = convertToolOutput(props.output);
const selectedType = ref("spot");
const openFull = ref(false);
const actions = ref<any>(null);
const objToken = ref<{ [key: string]: IFullToken }>({});
const pair = ref<any>(null);
const solana = useSolana();
const numBin = ref(0);
const editable = ref(false);

const positionInfo = ref<any>(null);
const loading = ref(false);
const conversationStore = useConversationStore();
const checkInsuff = ref("");

onMounted(async () => {
  if (data.action_id) {
    const action = await findDepositAction(data.action_id);
    pair.value = await getPairDetail(action.data.pair_address);

    const listTokenAddress: string[] = [action.data.mint_x, action.data.mint_y];
    const tokens = await fetchTokenAssets(listTokenAddress);
    if (!solana.init_done) await solana.init();

    selectedType.value = action?.data?.strategy;
    tokens.forEach((token) => {
      objToken.value[token.address] = { ...token, balance: solana.portfolio.tokens.find((t) => t.mint === token.address)?.balance || 0 };
    });
    actions.value = {
      ...action,
      data: { ...action.data, min_price: Number(action.data.min_price).toFixed(6), max_price: Number(action.data.max_price).toFixed(6) },
    };
    calMinprice();
    if (!(actions.value?.data.amount_x || actions.value?.data.amount_y) || !actions.value?.data.min_price || !actions.value?.data.max_price) {
      conversationStore.setDisableAction(true);
    }
  }
});

function getStep(type: "min" | "max", cal_price?: boolean) {
  if (!pair.value || !actions.value) return 0;
  const current_price = pair.value.current_price;
  const bin_step = pair.value.bin_step;
  const input = actions.value.data[type + "_price"];
  if (!input) return 0;
  if (type === "min") {
    const step = Math.ceil(Math.abs(Math.log(current_price / input) / Math.log(1 / (1 + bin_step / 10000))));
    if (!cal_price) return step;
    const price = current_price * Math.pow(1 / (1 + bin_step / 10000), step);
    return Number(price.toFixed(6));
  }
  const step = Math.ceil(Math.abs(Math.log(current_price / input) / Math.log(1 + bin_step / 10000)));
  if (!cal_price) return step;
  const price = current_price * Math.pow(1 + bin_step / 10000, step);

  return Number(price.toFixed(6));
}

async function calMinprice() {
  if (!pair.value || !actions.value) return;

  actions.value.data.min_price = getStep("min", true);
  const { binLength, cost } = await getPoolBin({
    poolAddress: actions.value.data.pair_address,
    min: actions.value.data.min_price,
    max: actions.value.data.max_price,
    decimalX: actions.value.data.decimals_x,
    decimalY: actions.value.data.decimals_y,
  });
  numBin.value = binLength;
  positionInfo.value = cost;
}

async function calMaxprice() {
  if (!pair.value || !actions.value) return;

  actions.value.data.max_price = getStep("max", true);
  const { binLength, cost } = await getPoolBin({
    poolAddress: actions.value.data.pair_address,
    min: actions.value.data.min_price,
    max: actions.value.data.max_price,
    decimalX: actions.value.data.decimals_x,
    decimalY: actions.value.data.decimals_y,
  });
  numBin.value = binLength;
  positionInfo.value = cost;
}

const position = computed(() => Math.ceil(numBin.value / 69));
const totalFee = computed(() => {
  if (!actions.value) return 0;
  return (positionInfo.value?.binArrayCost || 0) + (positionInfo.value?.positionCost || 0) + position.value * 0.00005;
});

async function onEditClick() {
  if (!editable.value) {
    editable.value = true;
    return;
  }
  if (!(actions.value?.data.amount_x || actions.value?.data.amount_y) || !actions.value?.data.min_price || !actions.value?.data.max_price) return;
  loading.value = true;
  await updateDepositAction(actions.value.id, {
    amount_x: Number(actions.value.data.amount_x) || 0,
    amount_y: Number(actions.value.data.amount_y) || 0,
    max_price: Number(actions.value.data.max_price) || 0,
    min_price: Number(actions.value.data.min_price) || 0,
    strategy: selectedType.value || "spot",
  });
  loading.value = false;
  editable.value = false;
  !checkInsuff.value && conversationStore.setDisableAction(false);
}

watch(
  () => [actions.value?.data.amount_x, actions.value?.data.amount_y, totalFee.value],
  () => {
    checkInsuff.value = checkInsufficient();
  }
);

function checkInsufficient() {
  if (!actions.value) return "";

  const xbalance = objToken.value[actions.value.data.mint_x].balance || 0;
  const ybalance = objToken.value[actions.value.data.mint_y].balance || 0;
  const requirex = actions.value.data.amount_x + ((actions.value.data.mint_x as string).startsWith("So11") ? totalFee.value : 0);
  const requirey = actions.value.data.amount_y + ((actions.value.data.mint_y as string).startsWith("So11") ? totalFee.value : 0);
  if (requirex > xbalance) return objToken.value[actions.value.data.mint_x].symbol;
  if (requirey > ybalance) return objToken.value[actions.value.data.mint_y].symbol;

  if (!actions.value.data.mint_x.startsWith("So11") && !actions.value.data.mint_y.startsWith("So11")) {
    if (totalFee.value > solana.balance) return "SOL";
  }
  return "";
}
</script>

<template>
  <div class="p-2 bg-app-card2 space-y-3" v-if="!!actions && !!pair">
    <div class="row-center justify-between">
      <p>Deposit Amount</p>
      <div v-if="!loading" class="p-1 text-blue-500 cursor-pointer" @click="onEditClick">{{ editable ? "Save" : "Edit" }}</div>
      <img v-else src="/images/icon-loading.gif" class="w-[16px] h-[16px]" />
    </div>
    <div>
      <div class="sm:row-center space-y-3 sm:space-y-0 sm:space-x-3">
        <div class="flex-1">
          <div
            class="flex-1 p-4 border rounded-[8px] row-center"
            :class="{ 'bg-app-card1 border-transparent': !editable, 'bg-app-card0  border-app-line2': editable }"
          >
            <img :src="objToken[actions.data.mint_x].imageUrl" class="w-[24px] h-[24px] md:w-[40px] md:h-[40px] rounded-full" />
            <input
              class="flex-1 bg-transparent outline-none ml-3 text-end"
              :disabled="!editable"
              v-model="actions.data.amount_x"
              placeholder="0.00"
              type="number"
            />
          </div>
          <p class="text-app-text3 text-[12px] mt-1">
            Balance
            <span class="text-[#fff]"> {{ formatNumber(objToken[actions.data.mint_x].balance) }} {{ objToken[actions.data.mint_x].symbol }}</span>
          </p>
        </div>
        <div class="flex-1">
          <div
            class="flex-1 p-4 rounded-[8px] row-center border"
            :class="{ 'bg-app-card1 border-transparent': !editable, 'bg-app-card0  border-app-line2': editable }"
          >
            <img :src="objToken[actions.data.mint_y].imageUrl" class="w-[24px] h-[24px] md:w-[40px] md:h-[40px] rounded-full" />
            <input
              class="flex-1 bg-transparent outline-none ml-3 text-end"
              :disabled="!editable"
              v-model="actions.data.amount_y"
              placeholder="0.00"
              type="number"
            />
          </div>
          <p class="text-app-text3 text-[12px] mt-1">
            Balance
            <span class="text-[#fff]"> {{ formatNumber(objToken[actions.data.mint_y].balance) }} {{ objToken[actions.data.mint_y].symbol }}</span>
          </p>
        </div>
      </div>
    </div>
    <div class="line" />
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <p class="font-[600] text-app-text1">Select Volatility Strategy</p>
        <p class="text-app-text3 mt-1">
          Spot provides a uniform distribution that is versatile and risk adjusted, suitable for any type of market and conditions. This is similar to
          setting a CLMM price range.
        </p>
      </div>
      <div class="space-x-3 row-center justify-center">
        <button
          class="p-4 border-[1px] border-[#fff] rounded-[12px]"
          :class="{ 'bg-[#000]': selectedType === 'spot' }"
          :disabled="!editable"
          @click="selectedType = 'spot'"
        >
          <img src="/images/icon-select-spot.svg" class="w-[90px] h-[30px]" />
          <p class="mt-3">Spot</p>
        </button>
        <button
          class="p-4 border-[1px] border-[#fff] rounded-[12px]"
          :class="{ 'bg-[#000]': selectedType === 'curve' }"
          @click="selectedType = 'curve'"
          :disabled="!editable"
        >
          <img src="/images/icon-select-curve.svg" class="w-[90px] h-[30px]" />
          <p class="mt-3">Curve</p>
        </button>
        <button
          class="p-4 border-[1px] border-[#fff] rounded-[12px]"
          :class="{ 'bg-[#000]': selectedType === 'bid_ask' }"
          @click="selectedType = 'bid_ask'"
          :disabled="!editable"
        >
          <img src="/images/icon-select-bid-ask.svg" class="w-[90px] h-[30px]" />
          <p class="mt-3">Bid-Ask</p>
        </button>
      </div>
    </div>
    <div class="line" />
    <p class="font-[600] text-app-text1">Select Volatility Strategy</p>
    <div class="row-center text-app-text2">
      <p>Current Price</p>
      <NuxtIcon name="icon-about" class="ml-1" />
      <p class="ml-2 text-app-text1">{{ formatNumber(pair?.current_price, 2) || 0 }} {{ pair?.name.replace("-", "/") }}</p>
    </div>
    <div class="space-y-3 sm:space-y-0 sm:row-center sm:space-x-3 font-[600] lg:text-[18px] overflow-hidden">
      <div class="basis-2/5 overflow-hidden">
        <p class="text-app-text2">Min Price</p>
        <div
          class="w-full row-center mt-1 rounded-[12px] border-[1px] border-app-line2"
          :class="{ 'bg-app-card1': !editable, 'bg-app-card0 ': editable }"
        >
          <input
            class="bg-transparent text-end p-4 flex-1"
            :disabled="!editable"
            v-model="actions.data.min_price"
            @change="calMinprice()"
            placeholder="0.00"
            type="number"
          />
          <p class="py-4 px-2 border-l-[1px] border-l-app-line2">
            {{ formatNumber(((actions.data.min_price || 0) / pair.current_price - 1) * 100, 2) }}%
          </p>
        </div>
      </div>
      <div class="basis-2/5 overflow-hidden">
        <p class="text-app-text2">Max Price</p>
        <div
          class="w-full row-center mt-1 rounded-[12px] border-[1px] border-app-line2"
          :class="{ 'bg-app-card1': !editable, 'bg-app-card0 ': editable }"
        >
          <input
            class="bg-transparent text-end p-4 flex-1"
            :disabled="!editable"
            v-model="actions.data.max_price"
            @change="calMaxprice()"
            placeholder="0.00"
            type="number"
          />
          <p class="py-4 px-2 border-l-[1px] border-l-app-line2">
            {{ formatNumber(((actions.data.max_price || 0) / pair.current_price - 1) * 100, 2) }}%
          </p>
        </div>
      </div>
      <div class="basis-1/5 overflow-hidden">
        <p class="text-app-text2">Num Bins</p>
        <div class="row-center mt-1 bg-app-card0 rounded-[12px] border-[1px] border-app-line2">
          <p class="text-end p-4 w-full">{{ numBin }}</p>
        </div>
      </div>
    </div>
    <Collapsible v-model:open="openFull" class="border border-app-line2 rounded-[8px]">
      <CollapsibleTrigger class="w-full">
        <div class="row-center w-full justify-between text-[12px] p-3">
          <div class="row-center text-app-text3">
            <NuxtIcon name="icon-about" />
            <p class="ml-1 text-start">SOL needed to create {{ position }} positions: {{ totalFee.toFixed(5) }} SOL</p>
          </div>
          <div class="row-center flex-shrink-0">
            <p>{{ openFull ? "Hide" : "Show" }} cost details</p>
            <img src="/images/icon-arrow-down.svg" class="w-[16px] ml-1 duration-200" :class="openFull ? 'rotate-180' : 'rotate-0'" />
          </div>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent class="border-t border-t-app-line2 p-3 space-y-3 text-app-text1">
        <p class="">Positions</p>
        <div>
          <p class="text-[12px] text-app-text3">Positions needed for 69 bins</p>
          <p>{{ position }} positions</p>
          <p class="mt-2 text-app-text3 text-[12px]">Positions rent</p>
          <div class="row-center">
            <p>{{ position }} x 0.06 SOL = {{ position * 0.06 }} SOL</p>
            <div class="ml-1 bg-app-card1 p-1 rounded-full text-[12px] uppercase text-app-text2">Refundable</div>
          </div>
        </div>
        <div class="line" />
        <p class="">Bins</p>
        <div>
          <p class="text-[12px] text-app-text3">Total bins count</p>
          <p>{{ numBin }} Bins</p>
          <p class="mt-2 text-app-text3 text-[12px]">New bin array needed to create</p>
          <p>{{ positionInfo?.binArraysCount || 0 }} Bins</p>
          <div class="row-center mt-2 text-app-text3 text-[12px]">
            <p class="">New bin array cost</p>
            <NuxtIcon name="icon-about" class="text-[14px] ml-1" />
          </div>
          <div class="row-center">
            <p>{{ positionInfo?.binArraysCount || 0 }} x 0.07 SOL = {{ (positionInfo?.binArraysCount || 0) * 0.07 }} SOL</p>
            <div class="ml-1 bg-app-card1 p-1 rounded-full text-[12px] uppercase text-app-text2 text-center">NON-Refundable</div>
          </div>
        </div>
        <div class="line" />
        <p class="">Transaction Fee</p>
        <div>
          <p class="text-[12px] text-app-text3">Number of transaction</p>
          <p>{{ position }} Transactions</p>
          <p class="mt-2 text-app-text3 text-[12px]">Max Transaction Fee</p>
          <p>{{ position }} x 0.00005 SOL = {{ formatNumber(position * 0.00005) }} SOL</p>
        </div>
      </CollapsibleContent>
    </Collapsible>
    <div v-if="solana.balance < 0.07" class="px-2 py-3 rounded-[8px] bg-app-cardWarning">
      We recommend keeping at least 0.07 SOL for any transaction.
    </div>
    <div v-if="checkInsuff" class="px-2 py-3 rounded-[8px] bg-app-cardWarning row-center">
      <img src="/images/icon-error.svg" class="w-[16px]" />
      <p class="ml-2">Insufficient balance for {{ checkInsuff }}</p>
    </div>
  </div>
</template>

<style lang="css" scoped>
input {
  min-width: 0px;
  outline: 0px;
}
</style>
