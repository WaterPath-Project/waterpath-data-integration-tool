import { Home, NotFound, Finetune, Success } from "./components/pages";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CountriesProvider } from "./context/CountriesProvider";
import { Toaster } from "sonner";
import { BrowserRouter, Route, Routes } from "react-router";
import { Areas } from "./components/pages/Areas";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <BrowserRouter basename="/waterpath-data-integration-tool/">
      <QueryClientProvider client={queryClient}>
        <CountriesProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/areas" element={<Areas />} />
            <Route path="/finetune/:session_id?" element={<Finetune />} />
            <Route path="/success" element={<Success />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster richColors />
        </CountriesProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
