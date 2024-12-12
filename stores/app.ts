import { defineStore } from "pinia";

export const useAppSetting = defineStore("appSetting", {
  state: () => ({
    showLoading: false,
    loadAppDone: false,
  }),
  actions: {
    saveLoadApp() {
      this.loadAppDone = true;
    },
    changeLoading(value: boolean) {
      this.showLoading = value;
    },
  },
});
