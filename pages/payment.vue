<script setup lang="ts">
import DepositPopup from "~/components/partials/DepositPopup.vue";
import MenuConversation from "~/components/partials/MenuConversation.vue";
import { getSubscriptionPrice, getUserInfo, payToJoinSubscription } from "~/services/api/auth/api";
import { getSolBalance } from "~/services/solana/utils";

definePageMeta({
  layout: "default",
});

const { getUser } = useAuthStore();

const balance = ref(0);
const openDeposit = ref(false);
const subscription = ref<any>({
  price: 0,
  extra_balance: 0,
});
const loading = ref(false);
const readed = ref(false);
const processed = ref(getUser().subscription.status === "pending");
const openLeftMenu = ref(false);
onMounted(() => {
  checkActive();
});

function checkActive() {
  if (getUser().subscription.status === "active") return navigateTo("/c");
  useIntervalFn(async () => {
    const newUser = await getUserInfo();
    if (newUser.subscription.status === "active") {
      navigateTo("/c");
    }
  }, 5000);
}

const insufficient = computed(() => {
  return balance.value < subscription.value.price + subscription.value.extra_balance;
});

onMounted(async () => {
  const [_sub, _balance] = await Promise.all([getSubscriptionPrice(), getSolBalance(getUser().wallet.address)]);
  subscription.value = _sub;
  balance.value = _balance;
});

async function onButtonClick() {
  if (insufficient.value) {
    openDeposit.value = true;
    return;
  }
  if (readed) {
    loading.value = true;
    const rs = await payToJoinSubscription();
    setTimeout(() => {
      loading.value = false;
    }, 1000);
    if (rs) {
      processed.value = true;
      checkActive();
    }
  }
}

function viewScanner() {
  if (getUser().subscription.data) window.open("https://solscan.io/tx/" + getUser().subscription.data?.tx_signature, "_blank");
}
</script>

<template>
  <div class="w-full h-full flex">
    <PartialsChatLeftSection />
    <section class="flex-1 flex flex-col bg-[#212121]">
      <Sheet v-model:open="openLeftMenu">
        <SheetTrigger>
          <div class="pl-6 py-3 cursor-pointer lg:hidden border-b-[1px] border-[#9797974a]">
            <img src="/images/icon-menu.svg" /></div
        ></SheetTrigger>
        <SheetContent side="left" class="p-0">
          <MenuConversation @click="() => (openLeftMenu = false)" />
        </SheetContent>
      </Sheet>
      <div class="flex-1 flex flex-col justify-center items-center">
        <div class="md:p-4 lg:p-6 w-[95vw] md:w-[750px] 2xl:w-[900px]">
          <div class="px-6 py-4">
            <div class="row-center justify-center">
              <p class="text-[28px] font-[600]">Early Access Program</p>
              <img src="/images/icon-beta.svg" class="ml-2" />
            </div>
            <p class="text-[16px] mt-4 text-[#CACACA] text-center">
              We're currently limiting beta access to meticulously develop and refine new features before full release.
            </p>
          </div>
          <div class="line" />
          <div class="px-6 py-4">
            <div class="row-center justify-between text-[16px] font-[600]">
              <span>Payment</span>
              <span>{{ subscription?.price ? formatNumber(subscription?.price, 3) : "---" }} SOL</span>
            </div>
            <p class="text-[#979797] mt-3">
              Funds will contribute to platform development, including LLM integration, data services, infrastructure maintenance, and essential
              operations.
            </p>
          </div>
          <div class="line" />
          <div class="px-6 py-4">
            <p>Benefits</p>
            <div class="mt-3 space-y-3">
              <div class="row-center">
                <img src="/images/icon-checked.svg" class="w-[20px]" />
                <p class="ml-2 text-[#979797]">Access to premium features</p>
              </div>
              <div class="row-center">
                <img src="/images/icon-checked.svg" class="w-[20px]" />
                <p class="ml-2 text-[#979797]">Unlimited AI conversations</p>
              </div>
              <div class="row-center">
                <img src="/images/icon-checked.svg" class="w-[20px]" />
                <p class="ml-2 text-[#979797]">Priority support access</p>
              </div>
            </div>
          </div>
          <div class="line" />
          <div class="px-6 py-4">
            <div class="row-center justify-between text-[16px] font-[600]">
              <span>Your Balance</span>
              <span>{{ balance ? formatNumber(balance, 3) : "---" }} SOL</span>
            </div>
            <div v-if="insufficient">
              <p class="text-app-red text-end">Insufficient Balance</p>
              <p class="text-app-red text-end">
                Required total {{ subscription.price ? formatNumber(subscription.price + subscription.extra_balance) : "---" }} SOL to pay and cover
                network fee
              </p>
            </div>
          </div>
          <div class="line" />
          <div v-if="!processed" class="px-6 py-4 flex flex-col justify-center items-center">
            <div v-if="!insufficient" class="row-center mb-4 cursor-pointer" @click="() => (readed = !readed)">
              <div
                class="w-[18px] h-[18px] border-[1px] rounded-[4px] flex justify-center items-center mr-2 flex-shrink-0"
                :class="readed ? 'border-app-green' : 'border-[#979797]'"
              >
                <img v-if="readed" src="/images/icon-checked.svg" class="w-[14px]" />
              </div>
              <span class="text-[#979797]">Confirm to join Early Access Program and pay {{ formatNumber(subscription.price) }} SOL fee</span>
            </div>
            <div
              v-if="insufficient"
              class="w-[168px] py-2 bg-[#fff] text-center text-[#131313] font-[600] rounded-[6px] cursor-pointer"
              @click="onButtonClick"
            >
              <span>Quick Deposit</span>
            </div>
            <div
              v-else
              class="row-center justify-center w-[168px] py-2 text-center text-[#131313] font-[600] rounded-[6px] cursor-pointer"
              :class="readed && !loading ? 'bg-[#fff]' : 'bg-[#979797] pointer-events-none'"
              @click="onButtonClick"
            >
              <img v-if="loading" src="/images/icon-loading.gif" class="w-[16px] mr-2" />
              <span>Join Early Access</span>
            </div>
          </div>
          <div v-else class="px-6 py-4 space-y-3">
            <div class="row-center cursor-pointer" @click="viewScanner">
              <img src="/images/icon-checked.svg" class="w-[20px]" />
              <p class="ml-2 text-[#979797]">Transaction successful. View on Solscan.</p>
              <NuxtIcon name="icon-scanner" class="text-[20px] ml-2 text-[#979797]" />
            </div>
            <div class="row-center">
              <img src="/images/icon-loading.gif" class="w-[20px]" />
              <p class="ml-2 text-[#979797]">Processing your Early Access request...</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <DepositPopup :open="openDeposit" :onClose="() => (openDeposit = false)" />
  </div>
</template>
