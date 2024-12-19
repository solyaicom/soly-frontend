import { defineStore } from "pinia";
import { fetchListAgents } from "~/services/api/chat/api";
import { IAgent } from "~/services/api/chat/type";

export const useAppSetting = defineStore("appSetting", {
  state: () => ({
    showLoading: false,
    loadAppDone: false,
    agents: [] as IAgent[],
  }),
  actions: {
    saveLoadApp() {
      this.loadAppDone = true;
    },
    changeLoading(value: boolean) {
      this.showLoading = value;
    },
    async init() {
      if (this.agents.length) return;
      this.agents = await fetchListAgents();
    },
  },
});
