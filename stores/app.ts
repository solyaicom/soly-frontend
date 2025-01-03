import { defineStore } from "pinia";
import { fetchListAgents, fetchListChannel } from "~/services/api/chat/api";
import { IAgent, IConversation } from "~/services/api/chat/type";

export const useAppSetting = defineStore("appSetting", {
  state: () => ({
    showLoading: false,
    loadAppDone: false,
    agents: [] as IAgent[],
    channels: [] as IConversation[],
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
      this.channels = await fetchListChannel();
    },
  },
});
