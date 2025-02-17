import { Home } from "./components/pages";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CountriesProvider } from "./context/CountriesProvider";

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
      <CountriesProvider>
        <Home />
      </CountriesProvider>
    </QueryClientProvider>
  );
}

export default App;
