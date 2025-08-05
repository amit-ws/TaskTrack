import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Coins, Search, Database, Eye, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { SnowflakeUser } from "@shared/schema";

export default function OverviewSection() {
  const { data: users, isLoading: usersLoading } = useQuery<SnowflakeUser[]>({
    queryKey: ["/api/snowflake-users"],
  });

  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ["/api/dashboard-summary"],
  });

  if (usersLoading || summaryLoading) {
    return <div className="text-white">Loading...</div>;
  }

  const humanUsers = users?.filter(user => !user.isNHI) || [];
  const nhiUsers = users?.filter(user => user.isNHI) || [];

  const getStatusBadge = (status: string) => {
    const isActive = status === "Active";
    return (
      <Badge 
        className={`text-xs ${isActive ? "bg-green-500/20 text-green-400" : "bg-amber-500/20 text-amber-400"}`}
      >
        <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isActive ? "bg-green-400" : "bg-amber-400"}`} />
        {status}
      </Badge>
    );
  };

  const getUserInitial = (userName: string) => {
    return userName.charAt(0).toUpperCase();
  };

  const getUserColor = (userName: string) => {
    const colors = [
      "var(--blue-500)",
      "var(--purple-500)", 
      "var(--green-500)",
      "var(--orange-500)",
      "var(--cyan-500)",
      "var(--yellow-500)",
      "var(--indigo-500)"
    ];
    const index = userName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  };

  return (
    <section className="space-y-6">
      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="metric-card border" style={{ borderColor: "var(--slate-700)" }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: "var(--slate-400)" }}>Total Users</p>
                <p className="text-2xl font-bold text-white mt-1" data-testid="total-users">
                  {summary?.totalUsers || 0}
                </p>
                <p className="text-sm mt-1" style={{ color: "var(--green-400)" }}>
                  <span className="mr-1">↑</span>{summary?.activeUsers || 0} Active
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: "var(--blue-500)/20" }}>
                <Users className="text-xl" style={{ color: "var(--blue-400)" }} size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card border" style={{ borderColor: "var(--slate-700)" }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: "var(--slate-400)" }}>Credits Used</p>
                <p className="text-2xl font-bold text-white mt-1" data-testid="total-credits">
                  {summary?.totalCredits || "0"}
                </p>
                <p className="text-sm mt-1" style={{ color: "var(--red-400)" }}>
                  <span className="mr-1">↑</span>+12% vs last week
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: "var(--amber-500)/20" }}>
                <Coins className="text-xl" style={{ color: "var(--amber-400)" }} size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card border" style={{ borderColor: "var(--slate-700)" }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: "var(--slate-400)" }}>Queries Executed</p>
                <p className="text-2xl font-bold text-white mt-1" data-testid="total-queries">
                  {summary?.totalQueries?.toLocaleString() || "0"}
                </p>
                <p className="text-sm mt-1" style={{ color: "var(--green-400)" }}>
                  <span className="mr-1">↑</span>+8% efficiency
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: "var(--green-500)/20" }}>
                <Search className="text-xl" style={{ color: "var(--green-400)" }} size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card border" style={{ borderColor: "var(--slate-700)" }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: "var(--slate-400)" }}>Data Scanned</p>
                <p className="text-2xl font-bold text-white mt-1" data-testid="total-data-scanned">
                  {summary?.totalDataScanned || "0"} GB
                </p>
                <p className="text-sm mt-1" style={{ color: "var(--slate-400)" }}>
                  Avg 121 GB/day
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: "var(--purple-500)/20" }}>
                <Database className="text-xl" style={{ color: "var(--purple-400)" }} size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Identity Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Human Users */}
        <Card style={{ backgroundColor: "var(--slate-900)", borderColor: "var(--slate-700)" }}>
          <div className="p-6" style={{ borderBottom: "1px solid var(--slate-700)" }}>
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Users className="mr-2" style={{ color: "var(--blue-400)" }} size={20} />
              Human Users
            </h3>
            <p className="text-sm mt-1" style={{ color: "var(--slate-400)" }}>Active user accounts and authentication status</p>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ color: "var(--slate-400)", borderBottom: "1px solid var(--slate-700)" }}>
                    <th className="text-left py-2">User Name</th>
                    <th className="text-left py-2">Owner</th>
                    <th className="text-left py-2">Last Login</th>
                    <th className="text-left py-2">Status</th>
                  </tr>
                </thead>
                <tbody style={{ color: "var(--slate-300)" }}>
                  {humanUsers.map((user) => (
                    <tr key={user.id} className="table-row" style={{ borderBottom: "1px solid var(--slate-800)" }}>
                      <td className="py-3">
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                            style={{ backgroundColor: getUserColor(user.userName) }}
                          >
                            {getUserInitial(user.userName)}
                          </div>
                          <span data-testid={`user-name-${user.userName}`}>{user.userName}</span>
                        </div>
                      </td>
                      <td className="py-3">{user.userOwner}</td>
                      <td className="py-3">
                        {user.lastSuccessfulLogin ? new Date(user.lastSuccessfulLogin).toLocaleString() : "Never"}
                      </td>
                      <td className="py-3">
                        {getStatusBadge(user.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>

        {/* NHI (Non-Human Identities) */}
        <Card style={{ backgroundColor: "var(--slate-900)", borderColor: "var(--slate-700)" }}>
          <div className="p-6" style={{ borderBottom: "1px solid var(--slate-700)" }}>
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Settings className="mr-2" style={{ color: "var(--purple-400)" }} size={20} />
              NHI (Non-Human Identities)
            </h3>
            <p className="text-sm mt-1" style={{ color: "var(--slate-400)" }}>Service accounts and automated integrations</p>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ color: "var(--slate-400)", borderBottom: "1px solid var(--slate-700)" }}>
                    <th className="text-left py-2">Identity Name</th>
                    <th className="text-left py-2">Owner</th>
                    <th className="text-left py-2">Token Type</th>
                    <th className="text-left py-2">Status</th>
                  </tr>
                </thead>
                <tbody style={{ color: "var(--slate-300)" }}>
                  {nhiUsers.map((user) => (
                    <tr key={user.id} className="table-row" style={{ borderBottom: "1px solid var(--slate-800)" }}>
                      <td className="py-3">
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-6 h-6 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: getUserColor(user.userName) }}
                          >
                            <Settings size={12} />
                          </div>
                          <span data-testid={`nhi-name-${user.userName}`}>{user.userName}</span>
                        </div>
                      </td>
                      <td className="py-3">{user.humanOwner}</td>
                      <td className="py-3">
                        <Badge className={`text-xs ${
                          user.tokenType === "OAUTH_ACCESS_TOKEN" 
                            ? "bg-blue-500/20 text-blue-400" 
                            : "bg-purple-500/20 text-purple-400"
                        }`}>
                          {user.tokenType}
                        </Badge>
                      </td>
                      <td className="py-3">
                        {getStatusBadge(user.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
