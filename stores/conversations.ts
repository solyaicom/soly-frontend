import { defineStore } from "pinia";
import { toast } from "~/components/ui/toast";
import { createNewConversation, deleteConversationById, fetchConversations } from "~/services/api/chat/api";
import { IConversation } from "~/services/api/chat/type";

export const useConversationStore = defineStore("conversations", {
  state: () => ({
    histories: [] as IConversation[],
    conv: null as IConversation | null,
    currentMessage: "",
  }),
  actions: {
    async newConversation(agent_id?: string) {
      const app = useAppSetting();
      const route = useRoute();
      app.changeLoading(true);
      const selectAgent = agent_id || route.query.agent_id?.toString();
      const conv = await createNewConversation(selectAgent);
      if (conv) {
        this.change(conv, true);
      }
      setTimeout(() => {
        app.changeLoading(false);
      }, 200);
    },
    resetConv() {
      this.conv = null;
    },
    setCurrentMessage(content: string) {
      this.currentMessage = content;
    },
    updateCurrentChat() {
      if (!this.conv) return;
      this.histories = this.histories.filter((item) => item.id !== this.conv?.id);
      this.histories.unshift(this.conv);
    },
    async init() {
      this.histories = await fetchConversations();
    },
    change(con: IConversation, addNew?: boolean) {
      if (!con) return;
      if (addNew) this.histories.unshift(con);
      else {
        let existIndex = this.histories.findIndex((item) => item.id === con.id);
        if (existIndex > -1) this.histories[existIndex] = con;
      }

      this.conv = con;
      let query = "";
      if (con.agent) {
        query = `?agent_id=${con.agent.id}`;
      }
      con && window.history.replaceState({}, "", `/c/${con.id}${query}`);
      document.title = con.name || "New Chat";
    },
    async delete(deleteItem: IConversation) {
      const app = useAppSetting();
      app.changeLoading(true);
      const rs = await deleteConversationById(deleteItem.id);
      if (rs) {
        this.histories = this.histories.filter((item) => item.id !== deleteItem.id);
        if (deleteItem.id === this.conv?.id) {
          document.title = "New Chat";
          this.conv && window.history.replaceState({}, "", `/c`);
          this.conv = null;
        }
      } else {
        toast({
          description: "Delete conversation failer",
          duration: 3000,
        });
      }
      setTimeout(() => app.changeLoading(false), 300);
    },
  },
});
