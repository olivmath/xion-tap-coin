import { AbstraxionProvider } from "@burnt-labs/abstraxion";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { XionProvider } from "@/contexts/XionContext";
import { getTreasuryConfig } from '@/blockchain/config/xion';
import Index from "./pages/Index";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AbstraxionProvider config={getTreasuryConfig()}>
      <XionProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<Index />} />
          </Routes>
        </BrowserRouter>
      </XionProvider>
    </AbstraxionProvider>
  </QueryClientProvider>
);

export default App;
