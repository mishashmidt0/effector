import { fork, Scope, serialize } from 'effector';
import { Provider } from 'effector-react/scope';

import '../styles/globals.css';

let clientScope: Scope;

export default function App({ Component, pageProps }: any) {
  const scope = fork({
    values: {
      ...(clientScope && serialize(clientScope)),
      ...pageProps.initialState,
    },
  });

  if (typeof window !== 'undefined') clientScope = scope;

  console.log('scope', serialize(scope));

  return (
    <Provider value={scope}>
      <Component {...pageProps} />
    </Provider>
  );
}
