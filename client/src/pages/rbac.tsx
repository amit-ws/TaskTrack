import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const users = ["API_USER", "AMITP", "VMAMIDI", "DEV_USER"];

const rbacData = {
  API_USER: {
    user: "API_USER",
    days: 30,
    roles: [
      {
        role_name: "ROLE1",
        grant_type: "Direct_Role",
        objects: ["TESTDB.PUBLIC.ORDERS", "TESTDB.PUBLIC.CUSTOMERS"],
        privileges: ["SELECT", "UPDATE"],
        usage: {
          credits_consumed: 3.5,
          total_queries_fired: 120,
          total_data_processed_in_mb: 1850,
          bytes_written: 104857600,
          rows_inserted: 3000,
          rows_updated: 1500,
          rows_deleted: 500,
          execution_time_ms: 985000,
          queued_overload_time_ms: 15000,
        },
      },
      {
        role_name: "ROLE2",
        grant_type: "Inherited_Role",
        objects: ["TESTDB.PUBLIC.SALES"],
        privileges: ["INSERT"],
        usage: {
          credits_consumed: 1.2,
          total_queries_fired: 45,
          total_data_processed_in_mb: 760,
          bytes_written: 52428800,
          rows_inserted: 5000,
          rows_updated: 0,
          rows_deleted: 0,
          execution_time_ms: 375000,
          queued_overload_time_ms: 9000,
        },
      },
      {
        role_name: "ROLE3",
        grant_type: "Inherited_Role",
        objects: ["TESTDB.ANALYTICS.REPORTS"],
        privileges: ["SELECT", "UPDATE", "DELETE"],
        usage: {
          credits_consumed: 2.8,
          total_queries_fired: 82,
          total_data_processed_in_mb: 990,
          bytes_written: 20971520,
          rows_inserted: 0,
          rows_updated: 1200,
          rows_deleted: 800,
          execution_time_ms: 445000,
          queued_overload_time_ms: 10000,
        },
      },
      {
        role_name: "ROLE4",
        grant_type: "Inherited_Role",
        objects: ["TESTDB.STAGING.TEMP_DATA"],
        privileges: ["DELETE", "UPDATE"],
        usage: {
          credits_consumed: 0.6,
          total_queries_fired: 27,
          total_data_processed_in_mb: 410,
          bytes_written: 10485760,
          rows_inserted: 0,
          rows_updated: 300,
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

export default function RbacSection() {
  const [selectedUser, setSelectedUser] = useState("API_USER");

  const data = rbacData[selectedUser];

  return (
    <section className="space-y-6">
      <Card style={{ backgroundColor: "var(--slate-900)", borderColor: "var(--slate-700)" }}>
        <div className="p-6" style={{ borderBottom: "1px solid var(--slate-700)" }}>
          <h3 className="text-lg font-semibold text-white">RBAC Roles & Usage</h3>
          <p className="text-sm mt-1" style={{ color: "var(--slate-400)" }}>
            Role-based access control details & usage for selected users.
          </p>
        </div>

        <div className="p-6">
          {/* User dropdown */}
          <select
            className="mb-6 px-3 py-1 text-sm rounded-md bg-slate-800 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            aria-label="Select user"
            data-testid="user-select"
          >
            {users.map((user) => (
              <option key={user} value={user}>
                {user}
              </option>
            ))}
          </select>

          {/* Roles Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ color: "var(--slate-400)", borderBottom: "1px solid var(--slate-700)" }}>
                  <th className="text-left py-3">Role Name</th>
                  <th className="text-left py-3">Grant Type</th>
                  <th className="text-left py-3">Objects</th>
                  <th className="text-left py-3">Privileges</th>
                  <th className="text-left py-3">Credits Consumed</th>
                  <th className="text-left py-3">Queries Fired</th>
                  <th className="text-left py-3">Data Processed (MB)</th>
                  <th className="text-left py-3">Rows Inserted</th>
                  <th className="text-left py-3">Rows Updated</th>
                  <th className="text-left py-3">Rows Deleted</th>
                  <th className="text-left py-3">Execution Time (s)</th>
                  <th className="text-left py-3">Queued Overload Time (s)</th>
                </tr>
              </thead>
              <tbody style={{ color: "var(--slate-300)" }}>
                {data.roles.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="py-4 text-center text-slate-500 italic">
                      No roles assigned for {selectedUser}
                    </td>
                  </tr>
                ) : (
                  data.roles.map((role) => (
                    <tr key={role.role_name} className="table-row" style={{ borderBottom: "1px solid var(--slate-800)" }}>
                      <td className="py-3 font-semibold">{role.role_name}</td>
                      <td className="py-3">
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
                      <td className="py-3">
                        {role.objects.map((obj, i) => (
                          <div key={i}>{obj}</div>
                        ))}
                      </td>
                      <td className="py-3">
                        {role.privileges.map((priv, i) => (
                          <Badge key={i} className="text-xs bg-green-500/20 text-green-400 mr-1">
                            {priv}
                          </Badge>
                        ))}
                      </td>
                      <td className="py-3">{role.usage.credits_consumed}</td>
                      <td className="py-3">{role.usage.total_queries_fired.toLocaleString()}</td>
                      <td className="py-3">{role.usage.total_data_processed_in_mb.toLocaleString()}</td>
                      <td className="py-3">{role.usage.rows_inserted.toLocaleString()}</td>
                      <td className="py-3">{role.usage.rows_updated.toLocaleString()}</td>
                      <td className="py-3">{role.usage.rows_deleted.toLocaleString()}</td>
                      <td className="py-3">{(role.usage.execution_time_ms / 1000).toFixed(1)}</td>
                      <td className="py-3">{(role.usage.queued_overload_time_ms / 1000).toFixed(1)}</td>
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
