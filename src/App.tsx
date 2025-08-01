import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { AnimalProfile } from "./pages/AnimalProfile";
import { ForSale } from "./pages/ForSale";
import { AuthPage } from "./pages/AuthPage";
import { SellerDashboard } from "./pages/SellerDashboard";
import { Header } from "./components/Header";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/animal/:id" element={<AnimalProfile />} />
          <Route path="/for-sale" element={<ForSale />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/seller-dashboard" element={<SellerDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
