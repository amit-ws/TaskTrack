import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Sidebar from "@/components/sidebar";
import Dashboard from "@/pages/dashboard";
import WarehouseEfficiency from "@/pages/warehouse-efficiency";
import NotFound from "@/pages/not-found";
import { useState } from "react";

// Shared layout with sidebar + content area
function Layout({ children }: { children: React.ReactNode }) {
  const [activeSection, setActiveSection] = useState("overview");

  return (
    <div className="flex h-screen">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <div className="flex-1 overflow-auto p-4">{children}</div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/">
        <Layout>
          <Dashboard />
        </Layout>
      </Route>
      <Route path="/warehouse-efficiency">
        <Layout>
          <WarehouseEfficiency />
        </Layout>
      </Route>
      {/* Add other sidebar-linked pages here */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
