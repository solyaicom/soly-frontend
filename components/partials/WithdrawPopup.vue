<script setup lang="ts">
import { getSolBalance } from "~/services/solana/utils";
import BtnPhantomConnect from "./BtnPhantomConnect.vue";
import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { toast } from "../ui/toast";
import { postExecuteTransfer, postInitNewTransfer } from "~/services/api/wallet/api";

const { getUser } = useAuthStore();
const openPopup = ref(false);
const { publicKey, address, sendTransaction } = useSolConnect();
const amount = ref("");
const props = defineProps<{
  open: boolean;
  onClose: () => void;
}>();
const loading = ref(false);
const solana = useSolana();
const selectedToken = ref(solana.portfolio.tokens[0]);
const withdrawAddress = ref("");
watch(
  () => props.open,
  () => {
    openPopup.value = props.open;
    if (openPopup.value) {
      selectedToken.value = solana.portfolio.tokens[0];
    }
  }
);

async function onContinueClick() {
  const txId = await postInitNewTransfer({
    amount: Number(amount.value),
    mint: selectedToken.value.mint,
    to_address: withdrawAddress.value,
  });
  console.log("txId", txId);
  if (txId) {
    const rs = await postExecuteTransfer(txId);
    console.log("rs", rs);
    if (rs)
      toast({
        description: "Withdraw transaction is success",
        duration: 4000,
      });
    else {
      toast({
        description: "Excute Withdraw is failed, please try again.",
        duration: 4000,
      });
    }
  } else {
    toast({
      description: "Init Withdraw is failed, please try again.",
      duration: 4000,
    });
  }
}

watch(
  () => openPopup.value,
  () => {
    if (!openPopup.value) props.onClose();
  }
);
</script>

<template>
  <Dialog v-model:open="openPopup">
    <DialogContent class="bg-[#141418] py-8 px-4 border-none flex flex-col items-center">
      <DialogTitle class="text-center text-[28px] font-[600] mt-2">Withdraw</DialogTitle>
      <div class="line" />
      <div class="w-full border-[1px] border-app-line1 rounded-[8px] overflow-hidden">
        <Select v-model="selectedToken">
          <SelectTrigger class="w-full row-center bg-app-card2 rounded-[0] border-[0] h-[56px] outline-none px-3 py-2">
            <img :src="selectedToken?.imageUrl" class="w-[28px] h-[28px] rounded-full" />
            <div class="flex-1 ml-2">
              <p class="text-[16px]">{{ selectedToken?.name }}</p>
              <p class="text-app-text3">{{ selectedToken?.symbol }}</p>
            </div>
            <p class="mr-2">{{ formatNumber(selectedToken?.balance, 3) }}</p>
          </SelectTrigger>
          <SelectContent class="p-0">
            <SelectGroup class="space-y-2 p-0">
              <SelectItem v-for="token in solana.portfolio.tokens" :key="token.mint" :value="token" class="w-full bg-app-card2 h-[56px]">
                <div class="w-full row-center bg-app-card2 rounded-[0] border-[0] h-[56px]">
                  <img :src="token?.imageUrl" class="w-[28px] h-[28px] rounded-full" />
                  <div class="flex-1 ml-2">
                    <p class="text-[16px]">{{ token?.name }}</p>
                    <p class="text-app-text3">{{ token?.symbol }}</p>
                  </div>
                  <p class="mr-2">{{ formatNumber(token?.balance, 3) }}</p>
                </div>
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <div class="row-center justify-between px-3 py-3">
          <p>To:</p>
          <input
            placeholder="Fill wallet address to here"
            v-model="withdrawAddress"
            class="outline-none text-end flex-1 h-[32px] bg-transparent mr-3 ml-3"
          />
        </div>
        <div class="line" />
        <div class="row-center justify-between px-3 py-2">
          <p>Amount</p>
          <div class="flex-1 flex">
            <input
              placeholder="Fill amount to here"
              v-model="amount"
              type="number"
              class="outline-none text-end flex-1 h-[40px] bg-transparent mr-6 ml-3"
            />
            <button @click="amount = selectedToken?.balance">Max</button>
          </div>
        </div>
      </div>
      <PartialsButton text="Continue" class="w-[50%] py-3" :disabled="!amount || !address" @click="onContinueClick" />
      <div class="w-full">
        <p class="font-[600]">Please note that</p>
        <ul class="list-disc pl-6 text-app-text2">
          <li>Enter the amount and the receiving wallet address you wish to withdraw to.</li>
          <li>Some tokens can only be withdrawn on the same chain from which you deposited them.</li>
          <li>Please make sure you have enough gas fees to process the transaction.</li>
        </ul>
      </div>
    </DialogContent>
  </Dialog>
</template>
