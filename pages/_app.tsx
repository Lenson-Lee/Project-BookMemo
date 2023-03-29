import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { AuthUserProvider } from "@/contexts/auth_user.context";

import { QueryClientProvider, QueryClient, Hydrate } from "react-query";
import { useRef } from "react";
function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const queryClientRef = useRef<QueryClient>();
  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient();
  }
  // const queryClientRef = React.useRef<QueryClient>();
  // if (!queryClientRef.current) {
  //   queryClientRef.current = new QueryClient();
  // }
  return (
    <>
      {/* pageProps 가 2개가 들어가있으면 GetStaticProps가 넘어가지 않는다. 일단 페이지 구성부터 하고, 문법을 찾아봐야 할 듯 */}
      <QueryClientProvider client={queryClientRef.current}>
        <Hydrate state={pageProps.dehydratedProps}>
          <SessionProvider session={pageProps.session}>
            <AuthUserProvider>
              <Component {...pageProps}></Component>
            </AuthUserProvider>
          </SessionProvider>
        </Hydrate>
      </QueryClientProvider>
    </>
  );
}

export default MyApp;
