// react-dom >= 19, You only need to configure it globally once
// @ts-ignore
import { createRoot } from "react-dom/client";
import { setVeauryOptions } from "veaury";
setVeauryOptions({
  react: {
    createRoot,
  },
});

export default defineNuxtPlugin(() => {});
