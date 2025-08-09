import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import OverviewSection from "@/components/overview-section";
import UserAnalyticsSection from "@/components/user-analytics-section";
import ActivitiesSection from "@/components/activities-section";
import ExpensiveQueriesSection from "@/components/expensive-queries-section";
import ObjectUsageSection from "@/components/object-usage-section";
import LineageSection from "@/components/lineage-section";
import WarehouseEfficiency from "@/pages/warehouse-efficiency";
import RBAC from "@/pages/rbac";  // <-- Import RBAC page

export default function Dashboard() {
  const [location, setLocation] = useLocation();
  const [activeSection, setActiveSection] = useState("overview");

  // Set section based on URL
  useEffect(() => {
    const sectionFromPath = location.replace("/", "") || "overview";
    setActiveSection(sectionFromPath);
  }, [location]);

  // Handle section change
  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    setLocation(`/${section}`);
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case "overview":
        return <OverviewSection />;
      case "user-analytics":
        return <UserAnalyticsSection />;
      case "activities":
        return <ActivitiesSection />;
      case "expensive-queries":
        return <ExpensiveQueriesSection />;
      case "object-usage":
        return <ObjectUsageSection />;
      case "lineage":
        return <LineageSection />;
      case "warehouse-efficiency":
        return <WarehouseEfficiency />;
      case "rbac":                 // <-- New RBAC route
        return <RBAC />;
      default:
        return <OverviewSection />;
    }
  };

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ backgroundColor: "var(--slate-950)" }}
    >
      <Sidebar activeSection={activeSection} onSectionChange={handleSectionChange} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6">{renderActiveSection()}</main>
      </div>
    </div>
  );
}
