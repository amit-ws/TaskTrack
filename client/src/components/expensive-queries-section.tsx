import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { DollarSign } from "lucide-react";
import type { ExpensiveQueries } from "@shared/schema";

export default function ExpensiveQueriesSection() {
  const [activeTab, setActiveTab] = useState("query_hash");

  const { data: queryHashQueries } = useQuery<ExpensiveQueries[]>({
    queryKey: ["/api/expensive-queries"],
    select: (data) => data.filter(q => q.groupingType === "query_hash"),
  });

  const { data: userRoleQueries } = useQuery<ExpensiveQueries[]>({
    queryKey: ["/api/expensive-queries"],
    select: (data) => data.filter(q => q.groupingType === "user_role"),
  });

  const { data: userQueryQueries } = useQuery<ExpensiveQueries[]>({
    queryKey: ["/api/expensive-queries"],
    select: (data) => data.filter(q => q.groupingType === "user_query"),
  });

  const getCurrentData = () => {
    switch (activeTab) {
      case "query_hash":
        return queryHashQueries || [];
      case "user_role":
        return userRoleQueries || [];
      case "user_query":
        return userQueryQueries || [];
      default:
        return [];
    }
  };

  return (
    <section className="space-y-6">
      <Card style={{ backgroundColor: "var(--slate-900)", borderColor: "var(--slate-700)" }}>
        <div className="p-6" style={{ borderBottom: "1px solid var(--slate-700)" }}>
          <h3 className="text-lg font-semibold text-white flex items-center">
            <DollarSign className="mr-2" style={{ color: "var(--red-400)" }} size={20} />
            Most Expensive Queries (Last 7 Days)
          </h3>
          <p className="text-sm mt-1" style={{ color: "var(--slate-400)" }}>Top 50 resource-intensive queries for cost optimization</p>
        </div>
        
        <div className="p-6">
          {/* Grouping Tabs */}
          <div className="flex space-x-1 mb-6 p-1 rounded-lg" style={{ backgroundColor: "var(--slate-800)" }}>
            <button
              onClick={() => setActiveTab("query_hash")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "query_hash" 
                  ? "bg-red-600 text-white" 
                  : "text-slate-400 hover:text-white"
              }`}
              data-testid="query-hash-tab"
            >
              By Query Hash
            </button>
            <button
              onClick={() => setActiveTab("user_role")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "user_role" 
                  ? "bg-red-600 text-white" 
                  : "text-slate-400 hover:text-white"
              }`}
              data-testid="user-role-tab"
            >
              By User + Role
            </button>
            <button
              onClick={() => setActiveTab("user_query")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "user_query" 
                  ? "bg-red-600 text-white" 
                  : "text-slate-400 hover:text-white"
              }`}
              data-testid="user-query-tab"
            >
              User + Role + Query
            </button>
          </div>

          {/* Query Hash Grouping */}
          {activeTab === "query_hash" && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ color: "var(--slate-400)", borderBottom: "1px solid var(--slate-700)" }}>
                    <th className="text-left py-3">Sample Query</th>
                    <th className="text-left py-3">Users</th>
                    <th className="text-left py-3">Roles</th>
                    <th className="text-left py-3">Warehouses</th>
                    <th className="text-left py-3">Executions</th>
                    <th className="text-left py-3">Credits</th>
                    <th className="text-left py-3">Data Scanned</th>
                    <th className="text-left py-3">Runtime</th>
                  </tr>
                </thead>
                <tbody style={{ color: "var(--slate-300)" }}>
                  {getCurrentData().map((query) => (
                    <tr key={query.id} className="table-row" style={{ borderBottom: "1px solid var(--slate-800)" }}>
                      <td className="py-3 max-w-xs">
                        <div className="truncate">
                          <code className="text-xs px-2 py-1 rounded" style={{ backgroundColor: "var(--slate-800)" }}>
                            {query.sampleQueryText}
                          </code>
                        </div>
                      </td>
                      <td className="py-3">{query.users}</td>
                      <td className="py-3">{query.roles}</td>
                      <td className="py-3">{query.warehouses}</td>
                      <td className="py-3">{query.totalExecutions?.toLocaleString()}</td>
                      <td className="py-3">
                        <span className="font-semibold" style={{ color: "var(--red-400)" }}>
                          {query.totalCreditsUsed}
                        </span>
                      </td>
                      <td className="py-3">{(parseFloat(query.totalMbScanned || "0") / 1000).toFixed(1)} GB</td>
                      <td className="py-3">{query.totalRuntimeSec}s</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* User + Role Grouping */}
          {activeTab === "user_role" && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ color: "var(--slate-400)", borderBottom: "1px solid var(--slate-700)" }}>
                    <th className="text-left py-3">User</th>
                    <th className="text-left py-3">Role Used</th>
                    <th className="text-left py-3">Total Executions</th>
                    <th className="text-left py-3">Total Credits</th>
                    <th className="text-left py-3">Total Data Scanned</th>
                    <th className="text-left py-3">Total Runtime</th>
                    <th className="text-left py-3">First Seen</th>
                    <th className="text-left py-3">Last Seen</th>
                  </tr>
                </thead>
                <tbody style={{ color: "var(--slate-300)" }}>
                  {getCurrentData().map((query) => (
                    <tr key={query.id} className="table-row" style={{ borderBottom: "1px solid var(--slate-800)" }}>
                      <td className="py-3">{query.userName}</td>
                      <td className="py-3">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-400">
                          {query.roleName}
                        </span>
                      </td>
                      <td className="py-3">{query.totalExecutions?.toLocaleString()}</td>
                      <td className="py-3">
                        <span className="font-semibold" style={{ color: "var(--red-400)" }}>
                          {query.totalCreditsUsed}
                        </span>
                      </td>
                      <td className="py-3">{(parseFloat(query.totalMbScanned || "0") / 1000).toFixed(1)} GB</td>
                      <td className="py-3">{query.totalRuntimeSec}s</td>
                      <td className="py-3">
                        {query.firstSeen ? new Date(query.firstSeen).toLocaleDateString() : "N/A"}
                      </td>
                      <td className="py-3">
                        {query.lastSeen ? new Date(query.lastSeen).toLocaleDateString() : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* User + Role + Query Grouping */}
          {activeTab === "user_query" && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ color: "var(--slate-400)", borderBottom: "1px solid var(--slate-700)" }}>
                    <th className="text-left py-3">User</th>
                    <th className="text-left py-3">Role</th>
                    <th className="text-left py-3">Sample Query</th>
                    <th className="text-left py-3">Executions</th>
                    <th className="text-left py-3">Credits</th>
                    <th className="text-left py-3">Data Scanned</th>
                    <th className="text-left py-3">Runtime</th>
                  </tr>
                </thead>
                <tbody style={{ color: "var(--slate-300)" }}>
                  {getCurrentData().map((query) => (
                    <tr key={query.id} className="table-row" style={{ borderBottom: "1px solid var(--slate-800)" }}>
                      <td className="py-3">{query.userName}</td>
                      <td className="py-3">{query.roleName}</td>
                      <td className="py-3 max-w-xs">
                        <div className="truncate">
                          <code className="text-xs px-2 py-1 rounded" style={{ backgroundColor: "var(--slate-800)" }}>
                            {query.sampleQueryText}
                          </code>
                        </div>
                      </td>
                      <td className="py-3">{query.totalExecutions?.toLocaleString()}</td>
                      <td className="py-3">
                        <span className="font-semibold" style={{ color: "var(--red-400)" }}>
                          {query.totalCreditsUsed}
                        </span>
                      </td>
                      <td className="py-3">{(parseFloat(query.totalMbScanned || "0") / 1000).toFixed(1)} GB</td>
                      <td className="py-3">{query.totalRuntimeSec}s</td>
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