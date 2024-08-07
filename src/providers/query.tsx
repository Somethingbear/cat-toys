"use client";

import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const onError = (error: any) => {
    // console.log(error?.msgHead?.code, t(error?.msgHead?.code));
    // showMessage(t(error?.msgHead?.code) || error, {
    //   variant: "error",
    // });
  };

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // staleTime: 60 * 60 * 1000,
        staleTime: Infinity,
        retry: 0,
        refetchOnWindowFocus: false,
      },
    },
    queryCache: new QueryCache({
      onError,
    }),
    mutationCache: new MutationCache({
      onError,
    }),
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
