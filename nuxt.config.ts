// https://nuxt.com/docs/api/configuration/nuxt-config
import { nodePolyfills } from "vite-plugin-node-polyfills";

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
    "nuxt-qrcode",
  ],

  vite: {
    plugins: [
      nodePolyfills({
        // To exclude specific polyfills, add them to this list.
        exclude: [
          "fs", // Excludes the polyfill for `fs` and `node:fs`.
        ],
        // Whether to polyfill specific globals.
        globals: {
          Buffer: true, // can also be 'build', 'dev', or false
          global: true,
          process: true,
        },
        // Whether to polyfill `node:` protocol imports.
        protocolImports: true,
      }),
    ],
  },

  runtimeConfig: {
    public: {},
  },

  app: {
    head: {
      style: [{ children: "body { margin: 0 }" }],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.png" }],

      script: [],
    },
  },

  ssr: false,

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
      Inter: [200, 300, 400, 500, 600, 700, 800, 900],
    },
  },

  components: [
    {
      path: "~/components",
      pathPrefix: true,
    },
  ],

  compatibilityDate: "2025-01-03",
});
