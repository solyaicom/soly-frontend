import { defineStore } from "pinia";
import { toast } from "~/components/ui/toast";
import { createNewConversation, deleteConversationById, fetchConversations, findConversationById } from "~/services/api/chat/api";
import { IAgent, IChatMessage, IConversation } from "~/services/api/chat/type";

type ConversationState = {
  histories: IConversation[],
  conv?: IConversation,
  convID?: string,
  currentMessage: string,
  messages: IChatMessage[],
  currentAgent?: IAgent,
};

export const useConversationStore = defineStore("conversations", {
  state: ():ConversationState => ({
    histories: [],
    conv: undefined,
    convID: undefined,
    currentMessage: "",
    messages: [] ,
    currentAgent: undefined,
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
      this.conv = undefined;
    },
    setCurrentMessage(content: string) {
      this.currentMessage = content;
    },
    updateCurrentChat() {
      if (!this.conv) return;
      this.histories = this.histories.filter((item) => item.id !== this.conv?.id);
      this.histories.unshift(this.conv);
    },
    setConvID(id: string) {
      this.convID = id;
    },
    async init(conv?: IConversation) {
      if (!this.histories.length) {
        this.histories = await fetchConversations()
      }


      if (!conv && this.convID) {
        conv = await findConversationById(this.convID)
      }

      if (conv) {
        return this.change(conv)
      }
    },
    async change(conv?: IConversation, addNew?: boolean) {
      if (!conv) {
        this.convID = '';
        this.conv = { agent: this.currentAgent, name: "New Chat" } as any;
        return window.history.replaceState({}, "", `/c`);
      }
      if (addNew) this.histories.unshift(conv);
      else {
        let existIndex = this.histories.findIndex((item) => item.id === conv.id);
        if (existIndex > -1) this.histories[existIndex] = conv;
      }

      this.conv = conv;
      this.convID = conv.id

      conv && window.history.replaceState({}, "", `/c/${conv.id}`);
    },
    async delete(deleteItem: IConversation) {
      const app = useAppSetting();
      app.changeLoading(true);
      const rs = await deleteConversationById(deleteItem.id);
      if (rs) {
        this.histories = this.histories.filter((item) => item.id !== deleteItem.id);
        if (deleteItem.id === this.conv?.id) {
          this.conv && window.history.replaceState({}, "", `/c`);
          this.conv = undefined;
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
