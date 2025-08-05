import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3 } from "lucide-react";
import type { SnowflakeUser, UserAnalytics } from "@shared/schema";

declare global {
  interface Window {
    Chart: any;
  }
}

export default function UserAnalyticsSection() {
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const chartRefs = useRef<{ [key: string]: HTMLCanvasElement | null }>({});

  const { data: users } = useQuery<SnowflakeUser[]>({
    queryKey: ["/api/snowflake-users"],
  });

  const { data: analytics } = useQuery<UserAnalytics>({
    queryKey: ["/api/user-analytics", selectedUserId],
    enabled: !!selectedUserId,
  });

  // Include both human users AND NHI users
  const allUsers = users || [];

  // Set default user when users are loaded
  useEffect(() => {
    if (allUsers.length > 0 && !selectedUserId) {
      const amitpUser = allUsers.find(u => u.userName === "AMITP");
      if (amitpUser) {
        setSelectedUserId(amitpUser.id);
      } else {
        setSelectedUserId(allUsers[0].id);
      }
    }
  }, [allUsers, selectedUserId]);

  // Initialize charts
  useEffect(() => {
    if (analytics && typeof window !== 'undefined' && window.Chart) {
      // Query Type Distribution Chart
      const queryTypeCtx = chartRefs.current.queryTypeChart?.getContext('2d');
      if (queryTypeCtx) {
        new window.Chart(queryTypeCtx, {
          type: 'doughnut',
          data: {
            labels: ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'OTHER'],
            datasets: [{
              data: [65, 15, 10, 3, 4, 3],
              backgroundColor: [
                'hsl(207, 90%, 54%)',
                'hsl(142, 84%, 44%)',
                'hsl(45, 93%, 58%)',
                'hsl(0, 84%, 65%)',
                'hsl(262, 100%, 63%)',
                'hsl(220, 9%, 46%)'
              ],
              borderWidth: 0
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'right',
                labels: {
                  color: 'hsl(220, 14%, 71%)',
                  usePointStyle: true,
                  padding: 20
                }
              }
            }
          }
        });
      }

      // Credit Usage Trend Chart
      const creditUsageCtx = chartRefs.current.creditUsageChart?.getContext('2d');
      if (creditUsageCtx) {
        new window.Chart(creditUsageCtx, {
          type: 'line',
          data: {
            labels: ['Jan 8', 'Jan 9', 'Jan 10', 'Jan 11', 'Jan 12', 'Jan 13', 'Jan 14', 'Jan 15'],
            datasets: [{
              label: 'Credits Used',
              data: [120, 140, 110, 180, 160, 200, 190, 247],
              borderColor: 'hsl(207, 90%, 54%)',
              backgroundColor: 'hsla(207, 90%, 54%, 0.1)',
              fill: true,
              tension: 0.4
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                labels: {
                  color: 'hsl(220, 14%, 71%)'
                }
              }
            },
            scales: {
              x: {
                ticks: {
                  color: 'hsl(220, 14%, 71%)'
                },
                grid: {
                  color: 'hsla(220, 14%, 71%, 0.1)'
                }
              },
              y: {
                ticks: {
                  color: 'hsl(220, 14%, 71%)'
                },
                grid: {
                  color: 'hsla(220, 14%, 71%, 0.1)'
                }
              }
            }
          }
        });
      }
    }
  }, [analytics]);

  // Load Chart.js if not loaded
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.Chart) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  const selectedUser = users?.find(u => u.id === selectedUserId);

  return (
    <section className="space-y-6">
      <Card style={{ backgroundColor: "var(--slate-900)", borderColor: "var(--slate-700)" }}>
        <div className="p-6" style={{ borderBottom: "1px solid var(--slate-700)" }}>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <BarChart3 className="mr-2" style={{ color: "var(--green-400)" }} size={20} />
              User Analytics Deep Dive
            </h3>
            <Select value={selectedUserId} onValueChange={setSelectedUserId} data-testid="user-analytics-select">
              <SelectTrigger className="w-48" style={{ backgroundColor: "var(--slate-800)", borderColor: "var(--slate-600)" }}>
                <SelectValue placeholder="Select user" />
              </SelectTrigger>
              <SelectContent>
                {allUsers.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.userName} {user.isNHI ? "(NHI)" : "(Human)"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <p className="text-sm mt-1" style={{ color: "var(--slate-400)" }}>
            Detailed analytics for selected user (Currently showing: {selectedUser?.userName})
          </p>
        </div>
        
        {analytics ? (
          <div className="p-6 space-y-6">
            {/* Analytics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Query Metrics */}
              <Card style={{ backgroundColor: "var(--slate-800)" }}>
                <CardContent className="p-4">
                  <h4 className="text-sm font-medium mb-3" style={{ color: "var(--slate-300)" }}>Query Metrics</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs" style={{ color: "var(--slate-400)" }}>Total Queries</span>
                      <span className="text-sm font-semibold text-white" data-testid="total-queries-metric">
                        {analytics.totalQueries?.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs" style={{ color: "var(--slate-400)" }}>Avg Duration</span>
                      <span className="text-sm font-semibold text-white">{analytics.avgQueryDuration}s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs" style={{ color: "var(--slate-400)" }}>Most Used</span>
                      <span className="text-sm font-semibold" style={{ color: "var(--blue-400)" }}>
                        {analytics.mostUsedQueryType}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Data Access Patterns */}
              <Card style={{ backgroundColor: "var(--slate-800)" }}>
                <CardContent className="p-4">
                  <h4 className="text-sm font-medium mb-3" style={{ color: "var(--slate-300)" }}>Data Access</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs" style={{ color: "var(--slate-400)" }}>Databases</span>
                      <span className="text-sm font-semibold text-white">{analytics.distinctDatabases}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs" style={{ color: "var(--slate-400)" }}>Frequent Tables</span>
                      <span className="text-sm font-semibold text-white">{analytics.frequentTables}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs" style={{ color: "var(--slate-400)" }}>Schema Access</span>
                      <span className="text-sm font-semibold" style={{ color: "var(--blue-400)" }}>PUBLIC</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Resource Consumption */}
              <Card style={{ backgroundColor: "var(--slate-800)" }}>
                <CardContent className="p-4">
                  <h4 className="text-sm font-medium mb-3" style={{ color: "var(--slate-300)" }}>Resource Usage</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs" style={{ color: "var(--slate-400)" }}>Credits Used</span>
                      <span className="text-sm font-semibold text-white">{analytics.creditsUsed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs" style={{ color: "var(--slate-400)" }}>Warehouse</span>
                      <span className="text-sm font-semibold text-white">{analytics.warehouseUsage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs" style={{ color: "var(--slate-400)" }}>Data Scanned</span>
                      <span className="text-sm font-semibold" style={{ color: "var(--blue-400)" }}>
                        {analytics.dataScanned} GB
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Security & Roles */}
              <Card style={{ backgroundColor: "var(--slate-800)" }}>
                <CardContent className="p-4">
                  <h4 className="text-sm font-medium mb-3" style={{ color: "var(--slate-300)" }}>Security & Roles</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs" style={{ color: "var(--slate-400)" }}>Auth Method</span>
                      <span className="text-sm font-semibold text-white">
                        {selectedUser?.authenticationMethod}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs" style={{ color: "var(--slate-400)" }}>Unique Roles</span>
                      <span className="text-sm font-semibold text-white">{analytics.uniqueRoles}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs" style={{ color: "var(--slate-400)" }}>Privileges</span>
                      <span className="text-sm font-semibold" style={{ color: "var(--blue-400)" }}>
                        {analytics.uniquePrivileges}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Query Types Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card style={{ backgroundColor: "var(--slate-800)" }}>
                <CardContent className="p-4">
                  <h4 className="text-sm font-medium mb-4" style={{ color: "var(--slate-300)" }}>Query Type Distribution</h4>
                  <div className="chart-container">
                    <canvas ref={(el) => chartRefs.current.queryTypeChart = el} id="queryTypeChart"></canvas>
                  </div>
                </CardContent>
              </Card>
              <Card style={{ backgroundColor: "var(--slate-800)" }}>
                <CardContent className="p-4">
                  <h4 className="text-sm font-medium mb-4" style={{ color: "var(--slate-300)" }}>Credit Usage Trend</h4>
                  <div className="chart-container">
                    <canvas ref={(el) => chartRefs.current.creditUsageChart = el} id="creditUsageChart"></canvas>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <p className="text-center" style={{ color: "var(--slate-400)" }}>
              No analytics data available for the selected user.
            </p>
          </div>
        )}
      </Card>
    </section>
  );
}