<script setup lang="ts">
import { fetchTokenAssets } from "~/services/solana/helius-api";
import { IFullToken } from "~/services/solana/type";

const props = defineProps<{ output: string }>();
const data = convertToolOutput(props.output);

const items = ref<any[]>([]);
const objToken = ref<{ [key: string]: IFullToken }>({});

onMounted(async () => {
  const ps = data.items;
  const listTokenAddress: string[] = [];
  ps.forEach((item: any) => {
    if (!listTokenAddress.includes(item.pair.mint_x)) listTokenAddress.push(item.pair.mint_x);
    if (!listTokenAddress.includes(item.pair.mint_y)) listTokenAddress.push(item.pair.mint_y);
  });
  const tokens = await fetchTokenAssets(listTokenAddress);
  tokens.forEach((token) => {
    objToken.value[token.address] = token;
  });
  items.value = data.items;
});

const totalDeposit = computed(() => {
  if (!Object.keys(objToken.value).length) return 0;
  return items.value.reduce((total, item) => {
    return (
      total +
      (Number(item.total_x_amount) / Math.pow(10, objToken.value[item.pair.mint_x]?.decimals)) *
        (objToken.value[item.pair.mint_x]?.price_per_token || 0) +
      (Number(item.total_y_amount) / Math.pow(10, objToken.value[item.pair.mint_y]?.decimals)) *
        (objToken.value[item.pair.mint_y]?.price_per_token || 0)
    );
  }, 0);
});

const unclaimFee = computed(() => {
  if (!Object.keys(objToken.value).length) return 0;
  return items.value.reduce((total, item) => {
    return (
      total +
      (Number(item.fee_x) / Math.pow(10, objToken.value[item.pair.mint_x].decimals)) * (objToken.value[item.pair.mint_x].price_per_token || 0) +
      (Number(item.fee_y) / Math.pow(10, objToken.value[item.pair.mint_y].decimals)) * (objToken.value[item.pair.mint_y].price_per_token || 0)
    );
  }, 0);
});
</script>

<template>
  <div class="rounded-b-[6px]">
    <div class="p-3">
      <div class="text-[24px] font-[600]">DLMM</div>
      <ul class="list-disc ml-5 text-app-text1 mt-2">
        <li>Total deposit: ${{ formatNumber(totalDeposit, 2) }}</li>
        <li>Unclaimed fees: ${{ formatNumber(unclaimFee, 2) }}</li>
      </ul>
    </div>
    <div class="max-h-[390px] overflow-scroll relative">
      <table class="w-full min-w-[540px] bg-app-card1 border-separate py-3 px-2 text-center rounded-[6px]">
        <thead class="sticky z-[1] top-0 bg-app-card1">
          <tr class="text-app-text2 text-start">
            <td>Pool</td>
            <td>
              <div class="row-center cursor-pointer">Price Range($)</div>
            </td>
            <td>
              <div class="row-center cursor-pointer">Your Deposit</div>
            </td>
            <td>
              <div class="row-center cursor-pointer">Unclaimed Fees</div>
            </td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in items" :key="index">
            <td>
              <div class="row-center">
                <div class="relative w-[40px] h-[24px]">
                  <img :src="objToken[item.pair.mint_x]?.imageUrl" class="w-[22px] rounded-full" />
                  <img :src="objToken[item.pair.mint_y]?.imageUrl" class="w-[22px] absolute right-0 top-0 rounded-full" />
                </div>
                <p class="ml-1">{{ item.name }}</p>
                <img v-if="item.tags?.includes('high_risk')" src="/images/icon-error.svg" class="w-[16px] ml-1" />
              </div>
            </td>
            <td class="text-start min-w-fit">{{ formatNumber(item.min_price, 2) }}-{{ formatNumber(item.max_price, 2) }}</td>
            <td class="text-start min-w-fit text-[12px]">
              <div>
                <p v-if="Number(item.total_x_amount)">
                  {{ formatNumber(Number(item.total_x_amount) / Math.pow(10, objToken[item.pair.mint_x]?.decimals)) }}
                  {{ objToken[item.pair.mint_x]?.symbol }}
                </p>
                <p v-if="Number(item.total_y_amount)">
                  {{ formatNumber(Number(item.total_y_amount) / Math.pow(10, objToken[item.pair.mint_x]?.decimals)) }}
                  {{ objToken[item.pair.mint_y]?.symbol }}
                </p>
              </div>
            </td>
            <td class="text-start text-[12px]">
              <div>
                <p v-if="Number(item.fee_x)">
                  {{ formatNumber(Number(item.fee_x) / Math.pow(10, objToken[item.pair.mint_x]?.decimals)) }}
                  {{ objToken[item.pair.mint_x]?.symbol }}
                </p>
                <p v-if="Number(item.fee_y)">
                  {{ formatNumber(Number(item.fee_y) / Math.pow(10, objToken[item.pair.mint_x]?.decimals)) }}
                  {{ objToken[item.pair.mint_y]?.symbol }}
                </p>
              </div>
            </td>
            <td>
              <div class="row-center">
                <div class="text-blue-500 cursor-pointer p-1">Withdraw</div>
                <div class="text-blue-500 cursor-pointer ml-1 p-1 w-[80px]">Claim Fee</div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
