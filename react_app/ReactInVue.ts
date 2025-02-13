import { useLogin, LoginModal, usePrivy, useDelegatedActions } from "@privy-io/react-auth";

import { createCrossingProviderForPureVueInReact } from "veaury";

// Execute 'useReactRouterForVue' in the setup function of the vue component to get the object returned by the incoming function
const [hook, ReactForVueProvider] = createCrossingProviderForPureVueInReact(
  // This incoming function can execute react hooks
  function () {
    return {
      privy: usePrivy(),
      delegate: useDelegatedActions(),
    };
  }
);

const useReactForVue = hook as () => { privy: any; delegate: any };

export { useReactForVue, ReactForVueProvider };
