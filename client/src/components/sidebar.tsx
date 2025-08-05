import { Snowflake, Users, Activity, DollarSign, Database, GitBranch, User } from "lucide-react";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export default function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const navigation = [
    { id: "overview", name: "Overview", icon: Snowflake },
    { id: "user-analytics", name: "User Analytics", icon: Users },
    { id: "activities", name: "Activities Tracking", icon: Activity },
    { id: "expensive-queries", name: "Expensive Queries", icon: DollarSign },
    { id: "object-usage", name: "Object Usage", icon: Database },
    { id: "lineage", name: "Lineage Tracking", icon: GitBranch },
  ];

  return (
    <div className="w-64 flex flex-col" style={{ backgroundColor: "var(--slate-900)", borderRight: "1px solid var(--slate-800)" }}>
      <div className="p-6" style={{ borderBottom: "1px solid var(--slate-800)" }}>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "var(--blue-600)" }}>
            <Snowflake className="text-white text-sm" size={16} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Snowflake Analytics</h1>
            <p className="text-xs" style={{ color: "var(--slate-400)" }}>Observability Platform</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`sidebar-link flex items-center space-x-3 px-3 py-2 rounded-lg w-full text-left text-sm font-medium ${
                isActive 
                  ? "text-blue-400 bg-blue-500/10" 
                  : "text-slate-300 hover:text-white"
              }`}
              data-testid={`nav-${item.id}`}
            >
              <Icon size={18} />
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>
      
      <div className="p-4" style={{ borderTop: "1px solid var(--slate-800)" }}>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: "var(--slate-700)" }}>
            <User className="text-slate-400 text-sm" size={16} />
          </div>
          <div>
            <p className="text-sm font-medium text-white">Admin User</p>
            <p className="text-xs" style={{ color: "var(--slate-400)" }}>Analytics Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
}