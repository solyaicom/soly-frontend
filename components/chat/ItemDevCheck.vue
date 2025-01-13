<script setup lang="ts">
const props = defineProps<{ output: string }>();
const data = convertToolOutput(props.output);
</script>

<template>
  <div class="p-3 bg-[#2f2f2f] rounded-b-[6px]">
    <ul class="list-disc pl-6 space-y-3 text-app-text1 font-[600]">
      <li>
        <div class="row-center cursor-pointer" @click="copyToClipboard(data.dev_info.creator_address)">
          Dev Wallet Address:

          <span class="font-[400] text-app-text2 ml-1"> {{ shortAddress(data.dev_info.creator_address) }}</span>
          <NuxtIcon name="icon-copy" class="ml-1 text-app-text2" />
        </div>
      </li>
      <!-- <li>Last Fund Source: {{ shortAddress("Es9v...wNYB") }}</li> -->
    </ul>
    <div class="line mt-3" />
    <div class="py-3">
      <p class="text-app-text1 font-[600]">Dev Also Created Tokens</p>
      <div class="mt-3 max-h-[350px] overflow-scroll relative">
        <table class="w-full bg-app-card1 border-separate py-3 px-2 text-center rounded-[6px]">
          <thead class="sticky top-0 bg-app-card1">
            <tr class="text-app-text2">
              <td class="w-[30px]"></td>
              <td class="text-start">Token</td>
              <td class="text-start">Market cap</td>
              <td>Audit</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in data.also_created_coins" :key="index">
              <td>{{ index + 1 }}</td>
              <td class="text-start">
                <div class="row-center">
                  <img :src="item.image_uri" class="w-[32px] rounded-full" />
                  <div class="pl-2">
                    <p class="font-[600]">{{ item.symbol.trim() }}</p>
                    <div class="row-center">
                      <p class="text-[12px] text-app-text2">{{ shortAddress(item.address) }}</p>
                      <NuxtIcon name="icon-copy" class="ml-1 text-app-text2" />
                    </div>
                  </div>
                </div>
              </td>
              <td class="text-start font-[600]">${{ formatNotationNumber(item.usd_market_cap, 2) }}</td>
              <td>
                <div v-if="item.is_rugged" class="row-center">
                  <img src="/images/icon-error.svg" class="w-[14px]" />
                  <span class="text-app-red text-[12px] ml-1">Rugged</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
