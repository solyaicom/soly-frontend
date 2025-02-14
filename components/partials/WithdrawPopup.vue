<script setup lang="ts">
import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { toast } from "../ui/toast";
import { postExecuteTransfer, postInitNewTransfer } from "~/services/api/wallet/api";
import { getWalletPortfolio } from "~/services/solana/utils";

const openPopup = ref(false);
const amount = ref("");
const props = defineProps<{
  open: boolean;
  onClose: () => void;
  address?: string;
}>();
const loading = ref(false);
const solana = useSolana();
const withdrawAddress = ref("");
const container = ref<HTMLElement | null>(null);
const MINT_USD_TO_WITHDRAW = 1;
const { getUser } = useAuthStore();

const selectedAddress = ref("");

const portfolio = ref<{ totalBalance: number; portfolio: { tokens: any[] } }>({
  totalBalance: 0,
  portfolio: {
    tokens: [],
  },
});

onMounted(async () => {
  if (!props.address) {
    portfolio.value = {
      totalBalance: solana.totalBalance,
      portfolio: solana.portfolio,
    };
  } else {
    const res = await getWalletPortfolio(props.address);
    portfolio.value = {
      totalBalance: res.totalBalance,
      portfolio: {
        tokens: res.tokens,
      },
    };
  }
  selectedAddress.value = portfolio.value.portfolio.tokens[0]?.mint || "";
});
const selectedToken = computed(() => {
  return portfolio.value.portfolio.tokens.find((t) => t.mint === selectedAddress.value);
});
const init = ref<any>(null);
const usdAmount = computed(() => {
  if (selectedToken.value) {
    return Number(amount.value || 0) * (selectedToken.value.pricePerToken || 0);
  }
  return 0;
});
const txhash = ref("");
const statusChecking = ref(true);
const interval = ref<any>(0);
const showDelegate = ref(false);

watch(
  () => props.open,
  () => {
    openPopup.value = props.open;
    if (openPopup.value) {
      selectedAddress.value = portfolio.value.portfolio.tokens[0]?.mint || "";
    }
  },
  {
    immediate: true,
  }
);

onUnmounted(() => {
  clearInterval(interval.value);
});

async function checkTransactionStatus(tx: string) {
  return new Promise(async (res) => {
    interval.value = setInterval(async () => {
      const result = await connection.getSignatureStatus(tx, {
        searchTransactionHistory: true,
      });
      if (result.value?.confirmationStatus === "finalized") {
        clearInterval(interval.value);
        return res(true);
      }
    }, 1500);
  });
}

function scrollPage(side: "left" | "right" = "left") {
  if (container.value) {
    container.value.scrollTo({
      left: side === "left" ? 0 : container.value.scrollWidth * 0.5,
      behavior: "smooth",
    });
  }
}

async function onExcuteWithdraw() {
  if (!init.value) return;
  loading.value = true;
  const rs = await postExecuteTransfer(init.value);
  if (rs) {
    setTimeout(async () => {
      loading.value = false;
      toast({
        description: "Withdraw transaction is success",
        duration: 4000,
      });
      txhash.value = rs.tx_signature;
      const status = await checkTransactionStatus(rs.tx_signature);
      console.log("status", status);
      statusChecking.value = false;
    }, 300);
  } else {
    toast({
      description: "Excute Withdraw is failed, please try again.",
      duration: 4000,
    });
  }
}

async function startInit() {
  loading.value = true;

  const rs = await postInitNewTransfer({
    from_address: props.address || solana.currentAddress,
    amount: Number(amount.value),
    mint: selectedAddress.value,
    to_address: withdrawAddress.value,
  });
  if (rs) {
    init.value = rs;
    loading.value = false;

    setTimeout(() => {
      if (container.value) {
        scrollPage("right");
        return;
      }
    }, 200);
  } else {
    toast({
      description: "Create withdrawal is failed, please try again.",
      duration: 4000,
    });
  }
}

async function onContinueClick() {
  if (usdAmount.value < MINT_USD_TO_WITHDRAW) {
    toast({
      description: "Amount must be greater than $1",
      duration: 4000,
    });
    return;
  }
  const feeAmount = selectedToken.value?.mint === "So11111111111111111111111111111111111111112" ? 0.0005 : 0;
  if (Number(amount.value) + feeAmount > (selectedToken.value?.balance || 0)) {
    toast({
      description: "Amount must be less than balance",
      duration: 4000,
    });
    return;
  }
  try {
    new PublicKey(withdrawAddress.value);
  } catch (error) {
    return toast({
      description: "Invalid receive address",
      duration: 4000,
    });
  }
  const fromAddress = props.address || solana.currentAddress;
  if (fromAddress === getUser().privy_wallet?.address) {
    showDelegate.value = true;
    return;
  }
  startInit();
}

watch(
  () => openPopup.value,
  () => {
    if (!openPopup.value) props.onClose();
  }
);
</script>

<template>
  <div>
    <Dialog v-model:open="openPopup">
      <DialogContent class="bg-[#141414] border-none flex overflow-hidden">
        <div ref="container" class="flex w-[100%] overflow-hidden">
          <div class="flex-shrink-0 flex flex-col w-[100%] items-center pb-8 space-y-4">
            <DialogTitle class="text-center text-[28px] font-[600] mt-2">Withdraw</DialogTitle>
            <div class="line" />
            <div class="w-full border-[1px] border-app-line1 rounded-[8px] overflow-hidden">
              <Select v-model="selectedAddress">
                <SelectTrigger class="w-full row-center bg-app-card1 rounded-[0] border-[0] h-[56px] outline-none px-3 py-2">
                  <div v-if="selectedToken" class="row-center w-full">
                    <img :src="selectedToken?.imageUrl" class="w-[28px] h-[28px] rounded-full" />
                    <div class="flex-1 ml-2">
                      <p class="text-[16px]">{{ selectedToken?.name }}</p>
                      <p class="text-app-text3">{{ selectedToken?.symbol }}</p>
                    </div>
                    <p class="mr-2">{{ formatNumber(selectedToken?.balance, 3) }}</p>
                  </div>
                  <div v-else><p class="text-[16px]">Select token</p></div>
                </SelectTrigger>
                <SelectContent class="p-0">
                  <SelectGroup class="space-y-2 p-0">
                    <SelectItem v-for="token in portfolio.portfolio.tokens" :key="token.mint" :value="token.mint" class="w-full h-[56px]">
                      <div class="w-full row-center rounded-[0] border-[0] h-[56px]">
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
                  placeholder="Enter received address"
                  v-model="withdrawAddress"
                  class="outline-none text-end flex-1 h-[32px] bg-transparent mr-1 ml-3"
                />
              </div>
              <div class="line" />
              <div class="row-center justify-between px-3 py-2">
                <div>
                  <p>Amount</p>
                  <p class="text-app-text3">Min: ${{ MINT_USD_TO_WITHDRAW }}</p>
                </div>
                <div class="flex-1">
                  <div class="row-center flex-1">
                    <div class="flex flex-1 relative h-[30px] mt-[-12px]">
                      <input
                        placeholder="Enter Amount"
                        v-model="amount"
                        type="number"
                        class="outline-none text-end flex-1 h-full bg-transparent mr-1 ml-3"
                      />
                      <p class="text-app-text3 text-end mr-1 absolute right-0 bottom-[-12px]">${{ formatNumber(usdAmount, 2) }}</p>
                    </div>
                    <button
                      v-if="selectedToken?.mint !== 'So11111111111111111111111111111111111111112'"
                      @click="amount = selectedToken?.balance"
                      class="ml-5"
                    >
                      Max
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <PartialsButton
              :loading="loading"
              text="Continue"
              class="w-[50%] py-3"
              :disabled="!amount || !withdrawAddress"
              @click="onContinueClick"
            />
            <div class="w-full">
              <p class="font-[600]">Please note that</p>
              <ul class="list-disc pl-6 text-app-text2">
                <li>Enter the amount and the receiving wallet address you wish to withdraw to.</li>
                <li>Some tokens can only be withdrawn on the same chain from which you deposited them.</li>
                <li>Please make sure you have enough gas fees to process the transaction.</li>
              </ul>
            </div>
          </div>
          <div class="flex-shrink-0 flex flex-col w-[100%] items-center pb-8 space-y-4 relative" :class="{ hidden: !init }">
            <DialogTitle class="text-center text-[28px] font-[600] mt-2">Confirm Withdraw</DialogTitle>
            <button v-if="!txhash" class="absolute top-[0px] left-0 cursor-pointer p-1" @click="scrollPage('left')">
              <img src="/images/icon-arrow-back.svg" class="w-[20px]" />
            </button>
            <div class="line" />
            <div class="text-[16px] w-full border-[1px] border-app-line1 rounded-[8px] overflow-hidden">
              <div class="font-[600] w-full row-center justify-between bg-app-card1 h-[56px] outline-none px-3 py-2">
                <p>To:</p>
                <p>{{ shortAddress(withdrawAddress) }}</p>
              </div>

              <div class="row-center justify-between p-4">
                <p>Amount</p>
                <p>{{ formatNumber(amount, 3) }} {{ selectedToken?.symbol }}</p>
              </div>
              <div class="line" />
              <div class="row-center justify-between p-4">
                <p>Fee</p>
                <p>{{ formatNumber(init?.priority_fee, 3) }}</p>
              </div>
              <div class="line" />

              <div v-if="txhash" class="row-center justify-between p-4">
                <p>Txhash</p>
                <a :href="`https://solscan.io/tx/${txhash}`" class="text-blue-500" target="_blank">
                  <div class="row-center">
                    <p>{{ shortAddress(txhash) }}</p>
                    <img v-if="statusChecking" src="/images/icon-loading.gif" class="w-[18px] ml-2" />
                    <img v-else src="/images/icon-checked.svg" class="w-[18px] ml-2" />
                  </div>
                </a>
              </div>
            </div>
            <PartialsButton v-if="!txhash" :loading="loading" text="Withdraw" class="w-[50%] py-3" :disabled="!init" @click="onExcuteWithdraw" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
    <PrivyDelegateWallet v-if="showDelegate" @success="startInit()" @error="toast({ description: 'Something went wrong', duration: 3000 })" />
  </div>
</template>
