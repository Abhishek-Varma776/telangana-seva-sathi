
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
import { useEffect } from "react";

// Import new issue pages
import DrainageIssue from "./pages/DrainageIssue";
import PotholesIssue from "./pages/PotholesIssue";
import StreetlightIssue from "./pages/StreetlightIssue";
import GarbageIssue from "./pages/GarbageIssue";
import SafetyIssue from "./pages/SafetyIssue";
import AreaIssues from "./pages/AreaIssues";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Initialize API connection when app loads
    if (window.apiConnect) {
      console.log("API Connection initialized");
    } else {
      console.error("API Connection failed to initialize");
    }
  }, []);

  return (
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
            
            {/* New issue routes */}
            <Route path="/issue/drainage" element={<DrainageIssue />} />
            <Route path="/issue/potholes" element={<PotholesIssue />} />
            <Route path="/issue/streetlight" element={<StreetlightIssue />} />
            <Route path="/issue/garbage" element={<GarbageIssue />} />
            <Route path="/issue/safety" element={<SafetyIssue />} />
            <Route path="/area-issues" element={<AreaIssues />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
