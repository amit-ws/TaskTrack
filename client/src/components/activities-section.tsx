import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity } from "lucide-react";
import type { UserActivities, SnowflakeUser } from "@shared/schema";

export default function ActivitiesSection() {
  const [activeTab, setActiveTab] = useState("sessions");

  const { data: users } = useQuery<SnowflakeUser[]>({
    queryKey: ["/api/snowflake-users"],
  });

  const { data: activities } = useQuery<UserActivities[]>({
    queryKey: ["/api/user-activities"],
  });

  const getUserDetails = (userId: string) => {
    return users?.find(user => user.id === userId);
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
      <Card style={{ backgroundColor: "var(--slate-900)", borderColor: "var(--slate-700)" }}>
        <div className="p-6" style={{ borderBottom: "1px solid var(--slate-700)" }}>
          <h3 className="text-lg font-semibold text-white flex items-center">
            <Activity className="mr-2" style={{ color: "var(--purple-400)" }} size={20} />
            User Activities Tracking
          </h3>
          <p className="text-sm mt-1" style={{ color: "var(--slate-400)" }}>Session-based and day-wise activity monitoring</p>
        </div>
        
        <div className="p-6">
          {/* Tabs */}
          <div className="flex space-x-1 mb-6 p-1 rounded-lg" style={{ backgroundColor: "var(--slate-800)" }}>
            <button
              onClick={() => setActiveTab("sessions")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "sessions" 
                  ? "bg-blue-600 text-white" 
                  : "text-slate-400 hover:text-white"
              }`}
              data-testid="sessions-tab"
            >
              Session Based
            </button>
            <button
              onClick={() => setActiveTab("daily")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "daily" 
                  ? "bg-blue-600 text-white" 
                  : "text-slate-400 hover:text-white"
              }`}
              data-testid="daily-tab"
            >
              Day Wise
            </button>
          </div>

          {/* Session Based Content */}
          {activeTab === "sessions" && (
            <div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ color: "var(--slate-400)", borderBottom: "1px solid var(--slate-700)" }}>
                      <th className="text-left py-3">User</th>
                      <th className="text-left py-3">Login Time</th>
                      <th className="text-left py-3">IP Address</th>
                      <th className="text-left py-3">Roles</th>
                      <th className="text-left py-3">Objects Accessed</th>
                      <th className="text-left py-3">Credits</th>
                      <th className="text-left py-3">Queries</th>
                      <th className="text-left py-3">Data Scanned</th>
                    </tr>
                  </thead>
                  <tbody style={{ color: "var(--slate-300)" }}>
                    {activities?.map((activity) => {
                      const userDetails = getUserDetails(activity.userId);
                      return (
                        <tr key={activity.id} className="table-row" style={{ borderBottom: "1px solid var(--slate-800)" }}>
                          <td className="py-3">
                            {userDetails && (
                              <div className="flex items-center space-x-2">
                                <div 
                                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                                  style={{ backgroundColor: getUserColor(userDetails.userName) }}
                                >
                                  {getUserInitial(userDetails.userName)}
                                </div>
                                <span data-testid={`activity-user-${userDetails.userName}`}>
                                  {userDetails.userName}
                                </span>
                              </div>
                            )}
                          </td>
                          <td className="py-3">
                            {new Date(activity.loginTime).toLocaleString()}
                          </td>
                          <td className="py-3">{activity.ipAddress}</td>
                          <td className="py-3">
                            <Badge className="text-xs bg-blue-500/20 text-blue-400">
                              {activity.roles}
                            </Badge>
                          </td>
                          <td className="py-3">{activity.objectsAccessed}</td>
                          <td className="py-3">{activity.creditsConsumed}</td>
                          <td className="py-3">{activity.queriesExecuted?.toLocaleString()}</td>
                          <td className="py-3">{activity.dataScanned} GB</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Day Wise Content */}
          {activeTab === "daily" && (
            <div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <Card style={{ backgroundColor: "var(--slate-800)" }}>
                  <CardContent className="p-4">
                    <h4 className="text-sm font-medium mb-3" style={{ color: "var(--slate-300)" }}>7 Days Activity</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-xs" style={{ color: "var(--slate-400)" }}>Avg Daily Queries</span>
                        <span className="text-sm font-semibold text-white">2,204</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs" style={{ color: "var(--slate-400)" }}>Peak Day</span>
                        <span className="text-sm font-semibold" style={{ color: "var(--blue-400)" }}>Jan 14</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card style={{ backgroundColor: "var(--slate-800)" }}>
                  <CardContent className="p-4">
                    <h4 className="text-sm font-medium mb-3" style={{ color: "var(--slate-300)" }}>15 Days Trend</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-xs" style={{ color: "var(--slate-400)" }}>Credits/Day</span>
                        <span className="text-sm font-semibold text-white">406.7</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs" style={{ color: "var(--slate-400)" }}>Growth</span>
                        <span className="text-sm font-semibold" style={{ color: "var(--green-400)" }}>+12%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card style={{ backgroundColor: "var(--slate-800)" }}>
                  <CardContent className="p-4">
                    <h4 className="text-sm font-medium mb-3" style={{ color: "var(--slate-300)" }}>30 Days Overview</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-xs" style={{ color: "var(--slate-400)" }}>Data Processed</span>
                        <span className="text-sm font-semibold text-white">2.4 TB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs" style={{ color: "var(--slate-400)" }}>Efficiency</span>
                        <span className="text-sm font-semibold" style={{ color: "var(--green-400)" }}>92%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </Card>
    </section>
  );
}
