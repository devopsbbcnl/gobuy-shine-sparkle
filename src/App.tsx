import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Vendors from "./pages/Vendors.tsx";
import Riders from "./pages/Riders.tsx";
import Food from "./pages/Food.tsx";
import Groceries from "./pages/Groceries.tsx";
import Pharmacy from "./pages/Pharmacy.tsx";
import Errands from "./pages/Errands.tsx";
import Affiliate from "./pages/Affiliate.tsx";
import Press from "./pages/Press.tsx";
import Contact from "./pages/Contact.tsx";
import Terms from "./pages/Terms.tsx";
import Privacy from "./pages/Privacy.tsx";
import Downloads from "./pages/Downloads.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/riders" element={<Riders />} />
          <Route path="/food" element={<Food />} />
          <Route path="/groceries" element={<Groceries />} />
          <Route path="/pharmacy" element={<Pharmacy />} />
          <Route path="/errands" element={<Errands />} />
          <Route path="/affiliate" element={<Affiliate />} />
          <Route path="/press" element={<Press />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/downloads" element={<Downloads />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
