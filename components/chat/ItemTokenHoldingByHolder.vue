<script setup lang="ts">
const props = defineProps<{ output: string }>();
const data = convertToolOutput(props.output);
console.log("data", data);
</script>

<template>
  <div class="p-3 bg-[#2f2f2f] rounded-b-[6px]">
    <ul class="list-disc pl-6 space-y-3 text-app-text1 font-[600]">
      <li>{{ formatNumber(data.noteworthy_count) }}/{{ formatNumber(data.items?.length || 0) }} top holders are noteworthy</li>
      <li>KOL: {{ formatNumber(data.kol_count) }}</li>
    </ul>
    <div class="line mt-3" />
    <p class="text-app-text1 font-[600] mt-3">Other Token Holdings by Top Holders ($USD)</p>
    <div class="mt-3 max-h-[350px] overflow-scroll relative">
      <table class="w-full bg-app-card1 border-separate py-3 px-2 text-center rounded-[6px]">
        <thead class="sticky top-0 bg-app-card1">
          <tr class="text-app-text2">
            <td class="w-[30px]"></td>
            <td>Address</td>
            <td class="text-start pl-2">Hold Token</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in data.items" :key="index">
            <td>{{ index + 1 }}</td>
            <td class="text-start">{{ shortAddress(item.address) }}</td>
            <td class="text-start max-w-[400px] pl-2">
              <span v-for="(token, idx) in item.tokens" :key="idx"
                >{{ token.symbol }}<span class="text-app-text2">(${{ formatNotationNumber(token.usd_value, 1) }})</span>,
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
