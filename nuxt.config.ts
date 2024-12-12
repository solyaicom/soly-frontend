// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: [
    "@nuxtjs/tailwindcss",
    "shadcn-nuxt",
    "@nuxtjs/google-fonts",
    "@vueuse/nuxt",
    "nuxt-icons",
    "@pinia/nuxt",
    "nuxt-vue3-google-signin",
    "@sentry/nuxt/module",
  ],
  runtimeConfig: {
    public: {},
  },

  app: {
    head: {
      style: [{ children: "body { margin: 0 }" }],
      script: [],
    },
  },
  ssr: false,
  spaLoadingTemplate: "splash-loading.html",
  googleSignIn: {
    clientId: "320448324963-luc2s6c99ksmhh3viirt2tfcpkjth6jh.apps.googleusercontent.com",
  },
  nitro: {
    prerender: {
      ignore: [(path) => path !== "/"],
    },
    preset: "cloudflare-pages-static",
    hooks: {
      async compiled(nitro) {
        // Override compiled hook to skip generate empty _redirect file which cause cloudflare error
      },
    },
  },
  webpack: {},
  // @ts-ignore
  pinia: {
    storesDirs: ["./stores/**"],
  },

  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: "",
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: "./components/ui",
  },
  googleFonts: {
    families: {
      Montserrat: [200, 300, 400, 500, 600, 700, 800, 900],
    },
  },
  components: [
    {
      path: "~/components",
      pathPrefix: true,
    },
  ],
});
