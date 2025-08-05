import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, Table, Eye, Settings } from "lucide-react";
import type { ObjectUsage } from "@shared/schema";

export default function ObjectUsageSection() {
  const [activeTab, setActiveTab] = useState("READ");

  const { data: objectUsage } = useQuery<ObjectUsage[]>({
    queryKey: ["/api/object-usage", { operationType: activeTab }],
  });

  const getObjectIcon = (objectType: string) => {
    switch (objectType.toLowerCase()) {
      case "table":
        return <Table size={16} style={{ color: "var(--blue-400)" }} />;
      case "view":
        return <Eye size={16} style={{ color: "var(--green-400)" }} />;
      case "procedure":
        return <Settings size={16} style={{ color: "var(--purple-400)" }} />;
      default:
        return <Database size={16} style={{ color: "var(--slate-400)" }} />;
    }
  };

  const getObjectTypeBadge = (objectType: string) => {
    const colors = {
      "Table": "bg-blue-500/20 text-blue-400",
      "View": "bg-green-500/20 text-green-400",
      "Procedure": "bg-purple-500/20 text-purple-400",
    };
    return colors[objectType as keyof typeof colors] || "bg-slate-500/20 text-slate-400";
  };

  const getOperationTypeBadge = (operationType: string) => {
    const colors = {
      "INSERT": "bg-orange-500/20 text-orange-400",
      "UPDATE": "bg-yellow-500/20 text-yellow-400",
      "DELETE": "bg-red-500/20 text-red-400",
      "READ": "bg-blue-500/20 text-blue-400",
    };
    return colors[operationType as keyof typeof colors] || "bg-slate-500/20 text-slate-400";
  };

  const renderUniqueUsers = (uniqueUsers: string) => {
    const userList = uniqueUsers.split(", ");
    const colors = [
      "var(--blue-500)",
      "var(--orange-500)",
      "var(--green-500)",
      "var(--purple-500)",
      "var(--cyan-500)",
    ];
    
    return (
      <div className="flex -space-x-1">
        {userList.slice(0, 3).map((user, index) => (
          <div 
            key={user}
            className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold"
            style={{ 
              backgroundColor: colors[index % colors.length],
              borderColor: "var(--slate-900)"
            }}
          >
            {user.charAt(0)}
          </div>
        ))}
        {userList.length > 3 && (
          <div 
            className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs"
            style={{ 
              backgroundColor: "var(--slate-700)",
              borderColor: "var(--slate-900)",
              color: "var(--slate-300)"
            }}
          >
            +{userList.length - 3}
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="space-y-6">
      <Card style={{ backgroundColor: "var(--slate-900)", borderColor: "var(--slate-700)" }}>
        <div className="p-6" style={{ borderBottom: "1px solid var(--slate-700)" }}>
          <h3 className="text-lg font-semibold text-white flex items-center">
            <Database className="mr-2" style={{ color: "var(--cyan-400)" }} size={20} />
            Object Usage Analysis (READ/MODIFY)
          </h3>
          <p className="text-sm mt-1" style={{ color: "var(--slate-400)" }}>Top accessed objects with credit consumption and user patterns</p>
        </div>
        
        <div className="p-6">
          {/* Usage Type Tabs */}
          <div className="flex space-x-1 mb-6 p-1 rounded-lg" style={{ backgroundColor: "var(--slate-800)" }}>
            <button
              onClick={() => setActiveTab("READ")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "read" 
                  ? "bg-cyan-600 text-white" 
                  : "text-slate-400 hover:text-white"
              }`}
              data-testid="read-operations-tab"
            >
              READ Operations
            </button>
            <button
              onClick={() => setActiveTab("modify")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "modify" 
                  ? "bg-cyan-600 text-white" 
                  : "text-slate-400 hover:text-white"
              }`}
              data-testid="modify-operations-tab"
            >
              MODIFY Operations
            </button>
          </div>

          {/* READ Usage */}
          {activeTab === "read" && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ color: "var(--slate-400)", borderBottom: "1px solid var(--slate-700)" }}>
                    <th className="text-left py-3">Object Name</th>
                    <th className="text-left py-3">Object Type</th>
                    <th className="text-left py-3">Credits Consumed</th>
                    <th className="text-left py-3">Unique Users</th>
                    <th className="text-left py-3">Access Count</th>
                    <th className="text-left py-3">Last Accessed</th>
                    <th className="text-left py-3">Data Scanned</th>
                  </tr>
                </thead>
                <tbody style={{ color: "var(--slate-300)" }}>
                  {objectUsage?.filter(obj => obj.operationType === "READ").map((usage) => (
                    <tr key={usage.id} className="table-row" style={{ borderBottom: "1px solid var(--slate-800)" }}>
                      <td className="py-3">
                        <div className="flex items-center space-x-2">
                          {getObjectIcon(usage.objectType)}
                          <span data-testid={`object-${usage.objectName}`}>{usage.objectName}</span>
                        </div>
                      </td>
                      <td className="py-3">
                        <Badge className={`text-xs ${getObjectTypeBadge(usage.objectType)}`}>
                          {usage.objectType}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <span className="font-semibold" style={{ color: "var(--amber-400)" }}>
                          {usage.creditsConsumed}
                        </span>
                      </td>
                      <td className="py-3">
                        {usage.uniqueUsers && renderUniqueUsers(usage.uniqueUsers)}
                      </td>
                      <td className="py-3">{usage.accessCount?.toLocaleString()}</td>
                      <td className="py-3">
                        {usage.lastAccessed ? new Date(usage.lastAccessed).toLocaleString() : "N/A"}
                      </td>
                      <td className="py-3">{usage.dataScanned} GB</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* MODIFY Usage */}
          {activeTab === "modify" && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ color: "var(--slate-400)", borderBottom: "1px solid var(--slate-700)" }}>
                    <th className="text-left py-3">Object Name</th>
                    <th className="text-left py-3">Object Type</th>
                    <th className="text-left py-3">Operation Type</th>
                    <th className="text-left py-3">Credits Consumed</th>
                    <th className="text-left py-3">Unique Users</th>
                    <th className="text-left py-3">Modification Count</th>
                    <th className="text-left py-3">Last Modified</th>
                  </tr>
                </thead>
                <tbody style={{ color: "var(--slate-300)" }}>
                  {objectUsage?.filter(obj => obj.operationType !== "READ").map((usage) => (
                    <tr key={usage.id} className="table-row" style={{ borderBottom: "1px solid var(--slate-800)" }}>
                      <td className="py-3">
                        <div className="flex items-center space-x-2">
                          {getObjectIcon(usage.objectType)}
                          <span>{usage.objectName}</span>
                        </div>
                      </td>
                      <td className="py-3">
                        <Badge className={`text-xs ${getObjectTypeBadge(usage.objectType)}`}>
                          {usage.objectType}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <Badge className={`text-xs ${getOperationTypeBadge(usage.operationType || "")}`}>
                          {usage.operationType}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <span className="font-semibold" style={{ color: "var(--amber-400)" }}>
                          {usage.creditsConsumed}
                        </span>
                      </td>
                      <td className="py-3">
                        {usage.uniqueUsers && renderUniqueUsers(usage.uniqueUsers)}
                      </td>
                      <td className="py-3">{usage.accessCount?.toLocaleString()}</td>
                      <td className="py-3">
                        {usage.lastAccessed ? new Date(usage.lastAccessed).toLocaleString() : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Card>
    </section>
  );
}
