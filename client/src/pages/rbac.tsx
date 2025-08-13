import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const roles = ["ROLE1", "ROLE2", "ROLE3", "ROLE4"];
const daysOptions = [7, 15, 30, -1]; // -1 for ALL-TIME

// Sample data - mapped to ROLE1 (for demo)
const roleAuditTrail = [
  {
    event_date: "2025-07-01T09:15:00Z",
    action: "CREATE_ROLE",
    description: "Role created",
    performed_by: "SYSTEM_ADMIN",
    details: "Role 'ANALYST_ROLE' created.",
  },
  {
    event_date: "2025-07-02T11:00:00Z",
    action: "GRANT",
    description: "Privilege granted",
    performed_by: "SECURITY_ADMIN",
    details: "USAGE privilege granted on WAREHOUSE 'COMPUTE_WH' to role 'ANALYST_ROLE'.",
  },
  {
    event_date: "2025-07-03T14:30:00Z",
    action: "GRANT",
    description: "Privilege granted",
    performed_by: "SECURITY_ADMIN",
    details: "SELECT privilege granted on DATABASE 'SALES_DB' to role 'ANALYST_ROLE'.",
  },
  {
    event_date: "2025-07-05T14:22:00Z",
    action: "GRANT",
    description: "Role granted to user",
    performed_by: "SECURITY_ADMIN",
    details: "Role 'ANALYST_ROLE' granted to user 'JANE_DOE'.",
  },
  {
    event_date: "2025-07-07T10:10:00Z",
    action: "GRANT",
    description: "Role granted to role",
    performed_by: "SECURITY_ADMIN",
    details: "Role 'ANALYST_ROLE' granted to role 'DEV_ROLE' (role inheritance).",
  },
  {
    event_date: "2025-07-10T16:45:00Z",
    action: "GRANT",
    description: "Role granted to role",
    performed_by: "SECURITY_ADMIN",
    details: "Role 'ANALYST_ROLE' granted to role 'DATA_SCIENTIST_ROLE' (role inheritance).",
  },
  {
    event_date: "2025-07-15T09:00:00Z",
    action: "REVOKE",
    description: "Privilege revoked",
    performed_by: "SECURITY_ADMIN",
    details: "SELECT privilege revoked on DATABASE 'SALES_DB' from role 'ANALYST_ROLE'.",
  },
  {
    event_date: "2025-07-18T08:30:00Z",
    action: "GRANT",
    description: "Role granted to user",
    performed_by: "SECURITY_ADMIN",
    details: "Role 'ANALYST_ROLE' granted to user 'JOHN_SMITH'.",
  },
  {
    event_date: "2025-07-20T10:10:00Z",
    action: "REVOKE",
    description: "Role revoked from user",
    performed_by: "SECURITY_ADMIN",
    details: "Role 'ANALYST_ROLE' revoked from user 'JOHN_SMITH'.",
  },
  {
    event_date: "2025-07-22T13:15:00Z",
    action: "GRANT",
    description: "Privilege granted",
    performed_by: "SECURITY_ADMIN",
    details: "INSERT privilege granted on TABLE 'SALES_DB.MONTHLY_REPORTS' to role 'ANALYST_ROLE'.",
  },
  {
    event_date: "2025-07-25T08:30:00Z",
    action: "ALTER",
    description: "Role modified",
    performed_by: "SYSTEM_ADMIN",
    details: "Role 'ANALYST_ROLE' description updated to 'Analyst level role with read-only access'.",
  },
];

// Map action to consistent badge colors
const actionColors: Record<string, string> = {
  CREATE_ROLE: "bg-green-500/20 text-green-400",
  GRANT: "bg-blue-500/20 text-blue-400",
  REVOKE: "bg-red-500/20 text-red-400",
  ALTER: "bg-orange-500/20 text-orange-400",
};

const daysToMilliseconds = (days: number) => days * 24 * 60 * 60 * 1000;

export default function RbacSection() {
  const [selectedRole, setSelectedRole] = useState("ROLE1");
  const [selectedDays, setSelectedDays] = useState(7);

  // Filtering logic:
  // - For demo: all data is for ROLE1, so other roles show no data
  // - Filter by date timeframe
  const now = new Date();
  const filteredData =
    selectedRole === "ROLE1"
      ? roleAuditTrail.filter(({ event_date }) => {
          if (selectedDays === -1) return true; // ALL-TIME
          const eventTime = new Date(event_date).getTime();
          return now.getTime() - eventTime <= daysToMilliseconds(selectedDays);
        })
      : [];

  return (
    <section className="space-y-6">
      <Card style={{ backgroundColor: "var(--slate-900)", borderColor: "var(--slate-700)" }}>
        <div className="p-6 border-b border-slate-700">
          <h3 className="text-lg font-semibold text-white">RBAC Role Audit Trail</h3>
          <p className="text-sm mt-1 text-slate-400">
            Audit details for selected roles and timeframes.
          </p>
        </div>

        <div className="p-6 space-y-4">
          {/* Filters */}
          <div className="flex items-center space-x-4">
            {/* Role dropdown */}
            <select
              className="px-4 py-2 text-sm rounded-md bg-slate-800 text-white border border-slate-700 focus:ring-2 focus:ring-blue-600"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>

            {/* Days dropdown */}
            <select
              className="px-4 py-2 text-sm rounded-md bg-slate-800 text-white border border-slate-700 focus:ring-2 focus:ring-blue-600"
              value={selectedDays}
              onChange={(e) => setSelectedDays(Number(e.target.value))}
            >
              <option value={7}>Last 7 days</option>
              <option value={15}>Last 15 days</option>
              <option value={30}>Last 30 days</option>
              <option value={-1}>All Time</option>
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-400 border-b border-slate-700">
                  <th className="text-left py-4 px-4">Event Date</th>
                  <th className="text-left py-4 px-4">Action</th>
                  <th className="text-left py-4 px-4">Description</th>
                  <th className="text-left py-4 px-4">Performed By</th>
                  <th className="text-left py-4 px-4">Details</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-slate-500 italic">
                      No audit events found for {selectedRole} in the last{" "}
                      {selectedDays === -1 ? "all time" : `${selectedDays} days`}
                    </td>
                  </tr>
                ) : (
                  filteredData.map((event, idx) => (
                    <tr key={idx} className="border-b border-slate-800">
                      <td className="py-4 px-4">
                        {new Date(event.event_date).toLocaleString(undefined, {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={`text-xs ${actionColors[event.action] ?? "bg-slate-600/20 text-slate-300"}`}>
                          {event.action}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">{event.description}</td>
                      <td className="py-4 px-4">{event.performed_by}</td>
                      <td className="py-4 px-4">{event.details}</td>
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
