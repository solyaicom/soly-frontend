// react-dom >= 19, You only need to configure it globally once
import { createRoot } from 'react-dom/client'
import { setVeauryOptions } from 'veaury'
setVeauryOptions({
  react: {
    createRoot
  }
})

export default defineNuxtPlugin(() => {})
