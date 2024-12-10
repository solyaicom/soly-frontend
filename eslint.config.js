import antfu from "@antfu/eslint-config";

export default antfu(
  {
    stylistic: {
      indent: 2,
      quotes: "double",
    },
    rules: {
      "style/semi": ["error", "always"],
      "@typescript-eslint/consistent-type-imports": false,
    },
    typescript: true,
    vue: true,
  },
  {
    // Remember to specify the file glob here, otherwise it might cause the vue plugin to handle non-vue files
    files: ["**/*.vue"],
    rules: {
      "vue/operator-linebreak": ["error", "before"],
      curly: "off",
    },
  }
);
