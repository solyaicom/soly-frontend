// https://nuxt.com/docs/api/configuration/nuxt-config
import { nodePolyfills } from "vite-plugin-node-polyfills";
// @ts-ignore
import veauryVitePlugins from "veaury/vite/index.js";

export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    "@nuxtjs/tailwindcss",
    "shadcn-nuxt",
    "@nuxtjs/google-fonts",
    "@vueuse/nuxt",
    "nuxt-icons",
    "@pinia/nuxt",
    "@sentry/nuxt/module",
    "nuxt-qrcode",
  ],
  experimental: { appManifest: false },
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
      // @ts-ignore
      veauryVitePlugins({
        type: "vue",
        isNuxt: true,
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
      title: "Soly AI",
      script: [
        {
          src: "https://www.googletagmanager.com/gtag/js?id=G-3PY9BMF9B5",
          async: true,
        },
        {
          innerHTML: `

  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-3PY9BMF9B5');
`,
        },
      ],
    },
  },

  ssr: false,
  spaLoadingTemplate: "splash-loading.html",

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
