import { defineStore } from "pinia";
import { toast } from "~/components/ui/toast";
import { createNewConversation, deleteConversationById, fetchConversations, findConversationById } from "~/services/api/chat/api";
import { IAgent, IChatMessage, IConversation } from "~/services/api/chat/type";

export const useConversationStore = defineStore("conversations", {
  state: () => ({
    histories: [] as IConversation[],
    conv: null as IConversation | null,
    currentMessage: "",
    messages: [] as IChatMessage[],
    currentAgent: undefined as IAgent | undefined,
  }),
  actions: {
    setMessages(messages: IChatMessage[]) {
      this.messages = messages;
    },
    addMessage(message: IChatMessage) {
      this.messages.push(message);
    },
    setCurrentAgent(agent?: IAgent) {
      this.currentAgent = agent;
    },
    async newConversation(agent_id?: string) {
      const app = useAppSetting();
      app.changeLoading(true);
      const selectAgent = agent_id || this.currentAgent?.id || app.agents[0].id;
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
    async init(id?: string) {
      const route = useRoute();
      const app = useAppSetting();
      const params = route.params;
      const listPromise: any[] = [fetchConversations()];
      if (params.conv_id || id) {
        listPromise.push(findConversationById(id || (params.conv_id as string)));
      }

      const [histories, con] = await Promise.all(listPromise);

      this.histories = histories;

      con && this.change(con || app.agents[0]);
    },
    async change(con?: IConversation, addNew?: boolean) {
      if (!con) {
        this.conv = { agent: this.currentAgent, name: "New Chat" } as any;
        return window.history.replaceState({}, "", `/c`);
      }
      if (addNew) this.histories.unshift(con);
      else {
        let existIndex = this.histories.findIndex((item) => item.id === con.id);
        if (existIndex > -1) this.histories[existIndex] = con;
      }

      this.conv = con;

      con && window.history.replaceState({}, "", `/c/${con.id}`);
    },
    async delete(deleteItem: IConversation) {
      const app = useAppSetting();
      app.changeLoading(true);
      const rs = await deleteConversationById(deleteItem.id);
      if (rs) {
        this.histories = this.histories.filter((item) => item.id !== deleteItem.id);
        if (deleteItem.id === this.conv?.id) {
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
