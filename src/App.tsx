import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AbstraxionProvider } from "@burnt-labs/abstraxion";
import { XionProvider } from "@/contexts/XionContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const treasuryConfig = {
  treasury: "xion1svpts9q2ml4ahgc4tuu95w8cqzv988s6mf5mupt5kt56gvdnklks9hzar4",
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AbstraxionProvider config={treasuryConfig}>
      <XionProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </XionProvider>
    </AbstraxionProvider>
  </QueryClientProvider>
);

export default App;
