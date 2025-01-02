<script setup lang="ts">
defineProps<{
  text: string;
  icon?: string;
  leftIconClass?: string;
  disabled?: boolean;
  rightIcon?: string;
  loading?: boolean;
  cancel?: boolean;
  outline?: boolean;
}>();
</script>
<template>
  <button
    :disabled="disabled || loading"
    class="relative flex items-center justify-center bg-[#fff] py-[12px] w-full text-[16px] text-[#131313] font-[600] rounded-[16px] border-[1px] border-[#ffffff1a]"
  >
    <img v-if="!!icon" :src="icon" class="mr-2" :class="leftIconClass" />
    <span :class="disabled ? 'text-[#3D3D3D]' : ''">{{ text }}</span>
    <img v-if="!!rightIcon" :src="rightIcon" class="ml-2 w-[22px]" />
  </button>
</template>
