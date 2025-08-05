import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { GitBranch, Workflow, Link, ExternalLink, BarChart, Users } from "lucide-react";
import type { LineageDependencies, UserObjectAccess } from "@shared/schema";

export default function LineageSection() {
  const [selectedObject, setSelectedObject] = useState("USERS_FACT_TABLE");

  const { data: dependencies } = useQuery<LineageDependencies[]>({
    queryKey: ["/api/lineage-dependencies", selectedObject],
  });

  const { data: userAccess } = useQuery<UserObjectAccess[]>({
    queryKey: ["/api/user-object-access", selectedObject],
  });

  const logicalDependencies = dependencies?.filter(dep => dep.dependencyType === "logical") || [];
  const fkDependencies = dependencies?.filter(dep => dep.dependencyType === "fk") || [];
  const externalDependencies = dependencies?.filter(dep => dep.dependencyType === "external") || [];

  const getDependencyIcon = (dependencyType: string) => {
    switch (dependencyType) {
      case "logical":
        return <Workflow size={16} style={{ color: "var(--blue-400)" }} />;
      case "fk":
        return <Link size={16} style={{ color: "var(--yellow-400)" }} />;
      case "external":
        return <ExternalLink size={16} style={{ color: "var(--red-400)" }} />;
      default:
        return <GitBranch size={16} style={{ color: "var(--slate-400)" }} />;
    }
  };

  const getImpactLevelBadge = (impactLevel: string) => {
    const colors = {
      "High": "bg-red-500/20 text-red-400",
      "Medium": "bg-amber-500/20 text-amber-400",
      "Low": "bg-green-500/20 text-green-400",
    };
    return colors[impactLevel as keyof typeof colors] || "bg-slate-500/20 text-slate-400";
  };

  const getUserInitial = (userName: string) => {
    return userName.charAt(0).toUpperCase();
  };

  const getUserColor = (userName: string) => {
    const colors = [
      "var(--blue-500)",
      "var(--orange-500)",
      "var(--green-500)",
      "var(--purple-500)",
      "var(--cyan-500)",
    ];
    const index = userName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  };

  const availableObjects = [
    "USERS_FACT_TABLE",
    "ORDERS_ANALYTICS_VIEW", 
    "INVENTORY_MASTER",
    "CUSTOMER_METRICS"
  ];

  return (
    <section className="space-y-6">
      <Card style={{ backgroundColor: "var(--slate-900)", borderColor: "var(--slate-700)" }}>
        <div className="p-6" style={{ borderBottom: "1px solid var(--slate-700)" }}>
          <h3 className="text-lg font-semibold text-white flex items-center">
            <GitBranch className="mr-2" style={{ color: "var(--indigo-400)" }} size={20} />
            Lineage Tracking - Dependency Analysis
          </h3>
          <p className="text-sm mt-1" style={{ color: "var(--slate-400)" }}>Who depends on me? Complete dependency mapping and impact analysis</p>
        </div>
        
        <div className="p-6">
          {/* Object Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2" style={{ color: "var(--slate-300)" }}>
              Analyze Dependencies For:
            </label>
            <Select value={selectedObject} onValueChange={setSelectedObject} data-testid="lineage-object-select">
              <SelectTrigger className="w-full md:w-auto" style={{ backgroundColor: "var(--slate-800)", borderColor: "var(--slate-600)" }}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableObjects.map((obj) => (
                  <SelectItem key={obj} value={obj}>
                    {obj}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Dependency Visualization */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Logical Dependencies */}
            <Card style={{ backgroundColor: "var(--slate-800)" }}>
              <CardContent className="p-6">
                <h4 className="text-sm font-medium mb-4 flex items-center" style={{ color: "var(--slate-300)" }}>
                  <Workflow className="mr-2" style={{ color: "var(--blue-400)" }} size={16} />
                  Logical Dependencies
                </h4>
                <div className="space-y-3">
                  {logicalDependencies.map((dep) => (
                    <div key={dep.id} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: "var(--slate-700)" }}>
                      <div className="flex items-center space-x-3">
                        {getDependencyIcon(dep.dependencyType)}
                        <div>
                          <p className="text-sm font-medium text-white">{dep.dependentObject}</p>
                          <p className="text-xs" style={{ color: "var(--slate-400)" }}>
                            {dep.dependentObject.includes("VIEW") ? "View depending on this table" :
                             dep.dependentObject.includes("FUNCTION") ? "Function using this table" :
                             "Stored procedure dependency"}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs" style={{ color: "var(--green-400)" }}>
                        {dep.status || "Active"}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* FK Dependencies */}
            <Card style={{ backgroundColor: "var(--slate-800)" }}>
              <CardContent className="p-6">
                <h4 className="text-sm font-medium mb-4 flex items-center" style={{ color: "var(--slate-300)" }}>
                  <Link className="mr-2" style={{ color: "var(--yellow-400)" }} size={16} />
                  Foreign Key Dependencies
                </h4>
                <div className="space-y-3">
                  {fkDependencies.map((dep) => (
                    <div key={dep.id} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: "var(--slate-700)" }}>
                      <div className="flex items-center space-x-3">
                        {getDependencyIcon(dep.dependencyType)}
                        <div>
                          <p className="text-sm font-medium text-white">{dep.dependentObject}</p>
                          <p className="text-xs" style={{ color: "var(--slate-400)" }}>
                            FK: {dep.constraintName}
                          </p>
                        </div>
                      </div>
                      <Badge className="text-xs bg-blue-500/20 text-blue-400">
                        FK_CONSTRAINT
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* External Dependencies */}
          <Card className="mb-6" style={{ backgroundColor: "var(--slate-800)" }}>
            <CardContent className="p-6">
              <h4 className="text-sm font-medium mb-4 flex items-center" style={{ color: "var(--slate-300)" }}>
                <ExternalLink className="mr-2" style={{ color: "var(--red-400)" }} size={16} />
                External Dependencies (Outside Snowflake)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg" style={{ backgroundColor: "var(--slate-700)" }}>
                  <div className="flex items-center space-x-2 mb-2">
                    <BarChart size={16} style={{ color: "var(--blue-400)" }} />
                    <span className="text-sm font-medium text-white">BI Dashboards</span>
                  </div>
                  <ul className="text-xs space-y-1" style={{ color: "var(--slate-400)" }}>
                    <li>• Tableau User Analytics Dashboard</li>
                    <li>• PowerBI User Metrics Report</li>
                    <li>• Looker User Insights</li>
                  </ul>
                </div>
                <div className="p-4 rounded-lg" style={{ backgroundColor: "var(--slate-700)" }}>
                  <div className="flex items-center space-x-2 mb-2">
                    <Workflow size={16} style={{ color: "var(--purple-400)" }} />
                    <span className="text-sm font-medium text-white">ETL Pipelines</span>
                  </div>
                  <ul className="text-xs space-y-1" style={{ color: "var(--slate-400)" }}>
                    <li>• Airflow DAG: user_data_pipeline</li>
                    <li>• dbt model: user_transformations</li>
                    <li>• Spark job: user_analytics_batch</li>
                  </ul>
                </div>
                <div className="p-4 rounded-lg" style={{ backgroundColor: "var(--slate-700)" }}>
                  <div className="flex items-center space-x-2 mb-2">
                    <GitBranch size={16} style={{ color: "var(--green-400)" }} />
                    <span className="text-sm font-medium text-white">ML/AI Jobs</span>
                  </div>
                  <ul className="text-xs space-y-1" style={{ color: "var(--slate-400)" }}>
                    <li>• User Behavior Prediction Model</li>
                    <li>• Churn Prediction Pipeline</li>
                    <li>• Recommendation Engine</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Access Patterns */}
          <Card style={{ backgroundColor: "var(--slate-800)" }}>
            <CardContent className="p-6">
              <h4 className="text-sm font-medium mb-4 flex items-center" style={{ color: "var(--slate-300)" }}>
                <Users className="mr-2" style={{ color: "var(--cyan-400)" }} size={16} />
                Top Users Accessing This Object
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ color: "var(--slate-400)", borderBottom: "1px solid var(--slate-700)" }}>
                      <th className="text-left py-2">User</th>
                      <th className="text-left py-2">Role</th>
                      <th className="text-left py-2">Query Type</th>
                      <th className="text-left py-2">Access Count</th>
                      <th className="text-left py-2">Credits Used</th>
                      <th className="text-left py-2">Last Access</th>
                      <th className="text-left py-2">Impact Level</th>
                    </tr>
                  </thead>
                  <tbody style={{ color: "var(--slate-300)" }}>
                    {userAccess?.map((access) => (
                      <tr key={access.id} className="table-row" style={{ borderBottom: "1px solid var(--slate-800)" }}>
                        <td className="py-3">
                          <div className="flex items-center space-x-2">
                            <div 
                              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                              style={{ backgroundColor: getUserColor(access.userName) }}
                            >
                              {getUserInitial(access.userName)}
                            </div>
                            <span data-testid={`lineage-user-${access.userName}`}>{access.userName}</span>
                          </div>
                        </td>
                        <td className="py-3">{access.roleName}</td>
                        <td className="py-3">
                          <Badge className="text-xs bg-blue-500/20 text-blue-400">
                            {access.queryType}
                          </Badge>
                        </td>
                        <td className="py-3">{access.accessCount?.toLocaleString()}</td>
                        <td className="py-3">{access.creditsUsed}</td>
                        <td className="py-3">
                          {access.lastAccess ? new Date(access.lastAccess).toLocaleString() : "N/A"}
                        </td>
                        <td className="py-3">
                          <Badge className={`text-xs ${getImpactLevelBadge(access.impactLevel || "Low")}`}>
                            {access.impactLevel}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </Card>
    </section>
  );
}