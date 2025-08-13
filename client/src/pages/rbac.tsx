import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Static users and filter options
const users = ["API_USER", "AMITP", "VMAMIDI", "DEV_USER"];
const daysOptions = [7, 15, 30];

// Updated RBAC JSON data
const rbacData = {
  API_USER: {
    user: "API_USER",
    days: 30,
    roles: [
      {
        role_name: "ROLE1",
        grant_type: "Direct_Role",
        grant_via: null,
        objects: ["TESTDB.PUBLIC.ORDERS", "TESTDB.PUBLIC.CUSTOMERS"],
        privileges: ["SELECT", "UPDATE"],
        usage: {
          credits_consumed: 3.5,
          total_queries_fired: 120,
          total_data_processed_in_mb: 1850,
          bytes_written: 104857600,
          rows_inserted: 0,
          rows_updated: 20,
          rows_deleted: 0,
          execution_time_ms: 985000,
          queued_overload_time_ms: 15000,
        },
      },
      {
        role_name: "ROLE2",
        grant_type: "Inherited_Role",
        grant_via: "ROLE1",
        objects: ["TESTDB.PUBLIC.SALES"],
        privileges: ["INSERT"],
        usage: {
          credits_consumed: 1.2,
          total_queries_fired: 45,
          total_data_processed_in_mb: 760,
          bytes_written: 52428800,
          rows_inserted: 50,
          rows_updated: 0,
          rows_deleted: 0,
          execution_time_ms: 375000,
          queued_overload_time_ms: 9000,
        },
      },
      {
        role_name: "ROLE3",
        grant_type: "Inherited_Role",
        grant_via: "ROLE2",
        objects: ["TESTDB.ANALYTICS.REPORTS"],
        privileges: ["SELECT", "UPDATE", "DELETE"],
        usage: {
          credits_consumed: 2.8,
          total_queries_fired: 82,
          total_data_processed_in_mb: 990,
          bytes_written: 20971520,
          rows_inserted: 0,
          rows_updated: 120,
          rows_deleted: 800,
          execution_time_ms: 445000,
          queued_overload_time_ms: 10000,
        },
      },
      {
        role_name: "ROLE4",
        grant_type: "Inherited_Role",
        grant_via: "ROLE1",
        objects: ["TESTDB.STAGING.TEMP_DATA"],
        privileges: ["DELETE", "UPDATE"],
        usage: {
          credits_consumed: 0.6,
          total_queries_fired: 27,
          total_data_processed_in_mb: 410,
          bytes_written: 10485760,
          rows_inserted: 0,
          rows_updated: 30,
          rows_deleted: 150,
          execution_time_ms: 128000,
          queued_overload_time_ms: 2000,
        },
      },
    ],
  },
  AMITP: { user: "AMITP", days: 30, roles: [] },
  VMAMIDI: { user: "VMAMIDI", days: 30, roles: [] },
  DEV_USER: { user: "DEV_USER", days: 30, roles: [] },
};

// Helper to calculate color from red to green
const getCreditColor = (value: number, max: number) => {
  const ratio = value / max;
  const r = Math.round(255 * ratio);
  const g = Math.round(255 * (1 - ratio));
  return `rgb(${r}, ${g}, 100)`;
};

export default function RbacSection() {
  const [selectedUser, setSelectedUser] = useState("API_USER");
  const [selectedDays, setSelectedDays] = useState(7);

  const data = rbacData[selectedUser];
  const filteredRoles = data.roles.filter(() => data.days >= selectedDays);

  const maxCredits = Math.max(...filteredRoles.map(r => r.usage.credits_consumed || 0), 1);

  return (
    <section className="space-y-6">
      <Card style={{ backgroundColor: "var(--slate-900)", borderColor: "var(--slate-700)" }}>
        <div className="p-6" style={{ borderBottom: "1px solid var(--slate-700)" }}>
          <h3 className="text-lg font-semibold text-white">RBAC Roles & Usage</h3>
          <p className="text-sm mt-1" style={{ color: "var(--slate-400)" }}>
            Role-based access control details & usage for selected users.
          </p>
        </div>

        <div className="p-6 space-y-4">
          {/* Filters */}
          <div className="flex items-center space-x-4">
            <select
              className="px-4 py-2 text-sm rounded-md bg-slate-800 text-white border border-slate-700 focus:outline-none"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              {users.map((user) => (
                <option key={user} value={user}>
                  {user}
                </option>
              ))}
            </select>

            <select
              className="px-4 py-2 text-sm rounded-md bg-slate-800 text-white border border-slate-700 focus:outline-none"
              value={selectedDays}
              onChange={(e) => setSelectedDays(Number(e.target.value))}
            >
              {daysOptions.map((day) => (
                <option key={day} value={day}>
                  Last {day} days
                </option>
              ))}
            </select>
          </div>

          {/* Roles Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ color: "var(--slate-400)", borderBottom: "1px solid var(--slate-700)" }}>
                  <th className="text-left py-4 px-4">Role Name</th>
                  <th className="text-left py-4 px-4">Grant Type</th>
                  <th className="text-left py-4 px-4">Grant Via</th>
                  <th className="text-left py-4 px-4">Objects</th>
                  <th className="text-left py-4 px-4">Privileges</th>
                  <th className="text-left py-4 px-4">Credits Consumed</th>
                  <th className="text-left py-4 px-4">Queries Fired</th>
                  <th className="text-left py-4 px-4">Data Processed (MB)</th>
                  <th className="text-left py-4 px-4">Rows Inserted</th>
                  <th className="text-left py-4 px-4">Rows Updated</th>
                  <th className="text-left py-4 px-4">Rows Deleted</th>
                  <th className="text-left py-4 px-4">Execution Time (s)</th>
                </tr>
              </thead>
              <tbody style={{ color: "var(--slate-300)" }}>
                {filteredRoles.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="py-6 text-center text-slate-500 italic">
                      No roles assigned for {selectedUser} in the last {selectedDays} days
                    </td>
                  </tr>
                ) : (
                  filteredRoles
                    .sort((a, b) => b.usage.credits_consumed - a.usage.credits_consumed)
                    .map((role) => (
                      <tr
                        key={role.role_name}
                        className="table-row"
                        style={{ borderBottom: "1px solid var(--slate-800)" }}
                      >
                        <td className="py-4 px-4 font-semibold">{role.role_name}</td>
                        <td className="py-4 px-4">
                          <Badge
                            className={`text-xs ${
                              role.grant_type === "Direct_Role"
                                ? "bg-blue-500/20 text-blue-400"
                                : "bg-purple-500/20 text-purple-400"
                            }`}
                          >
                            {role.grant_type === "Direct_Role" ? "Direct" : "Inherited"}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">{role.grant_via ?? "-"}</td>
                        <td className="py-4 px-4">
                          {role.objects.map((obj, i) => (
                            <div key={i}>{obj}</div>
                          ))}
                        </td>
                        <td className="py-4 px-4">
                          {role.privileges.map((priv, i) => (
                            <Badge key={i} className="text-xs bg-slate-600/20 text-slate-300 mr-1">
                              {priv}
                            </Badge>
                          ))}
                        </td>
                        <td
                          className="py-4 px-4 font-semibold"
                          style={{
                            backgroundColor: getCreditColor(role.usage.credits_consumed, maxCredits),
                            color: "black",
                            borderRadius: 4,
                            textAlign: "center",
                          }}
                        >
                          {role.usage.credits_consumed}
                        </td>
                        <td className="py-4 px-4">{role.usage.total_queries_fired}</td>
                        <td className="py-4 px-4">{role.usage.total_data_processed_in_mb}</td>
                        <td className="py-4 px-4">{role.usage.rows_inserted}</td>
                        <td className="py-4 px-4">{role.usage.rows_updated}</td>
                        <td className="py-4 px-4">{role.usage.rows_deleted}</td>
                        <td className="py-4 px-4">{(role.usage.execution_time_ms / 1000).toFixed(1)}</td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </section>
  );
}
