import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CitizenAuth from "./pages/CitizenAuth";
import OfficerAuth from "./pages/OfficerAuth";
import CitizenDashboard from "./pages/CitizenDashboard";
import OfficerDashboard from "./pages/OfficerDashboard";
import TrackComplaint from "./pages/TrackComplaint";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/citizen-login" element={<CitizenAuth />} />
          <Route path="/citizen-register" element={<CitizenAuth />} />
          <Route path="/officer-login" element={<OfficerAuth />} />
          <Route path="/officer-register" element={<OfficerAuth />} />
          <Route path="/citizen-dashboard" element={<CitizenDashboard />} />
          <Route path="/officer-dashboard" element={<OfficerDashboard />} />
          <Route path="/track-complaint" element={<TrackComplaint />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
