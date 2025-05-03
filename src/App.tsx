import { Home } from "./components/pages";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CountriesProvider } from "./context/CountriesProvider";
import { SessionProvider } from "./context/SessionProvider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <CountriesProvider>
          <Home />
        </CountriesProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
}

export default App;
