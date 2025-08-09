import { Switch, Route } from "wouter";
import { useState } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Sidebar from "@/components/sidebar";
import Dashboard from "@/pages/dashboard";
import WarehouseEfficiency from "@/pages/warehouse-efficiency";
import NotFound from "@/pages/not-found";

function AppLayout() {
  const [activeSection, setActiveSection] = useState("overview");

  return (
    <div className="flex h-screen">
      {/* Sidebar stays on the left */}
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />

      {/* Main content area */}
      <div className="flex-1 overflow-auto p-4">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/warehouse-efficiency" component={WarehouseEfficiency} />
          {/* Add your other routes here as needed */}
          <Route component={NotFound} />
        </Switch>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AppLayout />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
