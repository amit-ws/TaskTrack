import { useState } from "react";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import OverviewSection from "@/components/overview-section";
import UserAnalyticsSection from "@/components/user-analytics-section";
import ActivitiesSection from "@/components/activities-section";
import ExpensiveQueriesSection from "@/components/expensive-queries-section";
import ObjectUsageSection from "@/components/object-usage-section";
import LineageSection from "@/components/lineage-section";

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("overview");

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
      default:
        return <OverviewSection />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: "var(--slate-950)" }}>
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          {renderActiveSection()}
        </main>
      </div>
    </div>
  );
}
