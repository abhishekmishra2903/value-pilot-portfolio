
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PortfolioProvider } from "./context/PortfolioContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Dashboard from "./pages/Dashboard";
import Holdings from "./pages/Holdings";
import Performance from "./pages/Performance";
import Reports from "./pages/Reports";
import Investments from "./pages/Investments";
import Auth from "./pages/Auth";
import Layout from "./components/Layout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <PortfolioProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<Dashboard />} />
                <Route path="/holdings" element={<Holdings />} />
                <Route path="/performance" element={<Performance />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/investments" element={<Investments />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </PortfolioProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
