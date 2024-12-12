export const AppConfig = {
  name: "Stavax Account",
  env: {
    API_BASE_URL:
      //@ts-ignore
      import.meta.env.VITE_API_BASE_URL || "https://s-ai-agent-api.stavax.io",
  },
  link: {},
};
