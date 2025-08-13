import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const roles = ["ROLE1", "ROLE2", "ROLE3", "ROLE4"];
const daysOptions = [7, 15, 30, -1]; // -1 = ALL-TIME

const roleAuditTrail = [
  {
    event_date: "2025-08-01T09:00:00Z",
    action: "CREATE_ROLE",
    description: "Role created",
    performed_by_user: "SYSTEM_ADMIN",
    performed_by_role: "SYSTEM_ADMIN",
    user_type: "HUMAN",
    details: "Role 'Role1' created.",
  },
  {
    event_date: "2025-08-02T10:15:00Z",
    action: "GRANT",
    description: "Privilege granted",
    performed_by_user: "AMITP",
    performed_by_role: "SECURITY_ADMIN",
    user_type: "HUMAN",
    details: "USAGE privilege granted on WAREHOUSE 'PROD_WH' to role 'Role1'.",
  },
  {
    event_date: "2025-08-03T11:30:00Z",
    action: "GRANT",
    description: "Role granted to role",
    performed_by_user: "VMAMIDI",
    performed_by_role: "SECURITY_ADMIN",
    user_type: "HUMAN",
    details: "Role 'Role1' granted to role 'Role2' (role inheritance).",
  },
  {
    event_date: "2025-08-04T14:00:00Z",
    action: "GRANT",
    description: "Role granted to user",
    performed_by_user: "API_USER",
    performed_by_role: "SECURITY_ADMIN",
    user_type: "HUMAN",
    details: "Role 'Role1' granted to user 'DEV_USER'.",
  },
  {
    event_date: "2025-08-05T09:45:00Z",
    action: "REVOKE",
    description: "Privilege revoked",
    performed_by_user: "SB_INTEGRATION",
    performed_by_role: "SECURITY_ADMIN",
    user_type: "PROGRAMMATIC_TOKEN",
    details: "SELECT privilege revoked on DATABASE 'HR_DB' from role 'Role1'.",
  },
  {
    event_date: "2025-08-06T12:30:00Z",
    action: "GRANT",
    description: "Role granted to role",
    performed_by_user: "AMITP",
    performed_by_role: "SECURITY_ADMIN",
    user_type: "HUMAN",
    details: "Role 'Role3' granted to role 'Role1' (role inheritance).",
  },
  {
    event_date: "2025-08-07T08:00:00Z",
    action: "GRANT",
    description: "Privilege granted",
    performed_by_user: "VMAMIDI",
    performed_by_role: "SECURITY_ADMIN",
    user_type: "HUMAN",
    details: "INSERT privilege granted on TABLE 'SALES.REPORTS' to role 'Role1'.",
  },
  {
    event_date: "2025-08-08T16:15:00Z",
    action: "REVOKE",
    description: "Role revoked from user",
    performed_by_user: "API_PIPELINE_BOT",
    performed_by_role: "SECURITY_ADMIN",
    user_type: "PROGRAMMATIC_TOKEN",
    details: "Role 'Role1' revoked from user 'AMITP'.",
  },
  {
    event_date: "2025-08-09T10:45:00Z",
    action: "ALTER",
    description: "Role modified",
    performed_by_user: "SYSTEM_ADMIN",
    performed_by_role: "SYSTEM_ADMIN",
    user_type: "HUMAN",
    details: "Role 'Role1' description updated to 'Role1 with extended read-write access'.",
  },
  {
    event_date: "2025-08-10T13:30:00Z",
    action: "GRANT",
    description: "Role granted to role",
    performed_by_user: "AMITP",
    performed_by_role: "SECURITY_ADMIN",
    user_type: "HUMAN",
    details: "Role 'Role4' granted to role 'Role1' (role inheritance).",
  },
  {
    event_date: "2025-08-11T15:00:00Z",
    action: "GRANT",
    description: "Role granted to user",
    performed_by_user: "SB_INTEGRATION",
    performed_by_role: "SECURITY_ADMIN",
    user_type: "PROGRAMMATIC_TOKEN",
    details: "Role 'Role1' granted to user 'VMAMIDI'.",
  },
  {
    event_date: "2025-08-12T09:30:00Z",
    action: "GRANT",
    description: "Role granted to user",
    performed_by_user: "DEV_USER",
    performed_by_role: "SECURITY_ADMIN",
    user_type: "HUMAN",
    details: "Role 'Role1' granted to user 'API_USER'.",
  },
];

// Role badge colors
const roleColors: Record<string, string> = {
  SYSTEM_ADMIN: "bg-purple-500/20 text-purple-400",
  SECURITY_ADMIN: "bg-teal-500/20 text-teal-400",
  DEFAULT: "bg-slate-600/20 text-slate-300",
};

// Action badge colors
const actionColors: Record<string, string> = {
  CREATE_ROLE: "bg-green-500/20 text-green-400",
  GRANT: "bg-blue-500/20 text-blue-400",
  REVOKE: "bg-red-500/20 text-red-400",
  ALTER: "bg-orange-500/20 text-orange-400",
};

const daysToMilliseconds = (days: number) => days * 24 * 60 * 60 * 1000;

export default function RbacSection() {
  const [selectedRole, setSelectedRole] = useState("ROLE1");
  const [selectedDays, setSelectedDays] = useState(-1); // Default to ALL-TIME

  const now = new Date();

  const filteredData =
    selectedRole === "ROLE1"
      ? roleAuditTrail.filter(({ event_date }) => {
          if (selectedDays === -1) return true;
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
            Audit trail for selected role and timeframe.
          </p>
        </div>

        <div className="p-6 space-y-4">
          {/* Filters */}
          <div className="flex items-center space-x-4">
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
                  <th className="text-left py-4 px-4">Using Role</th>
                  <th className="text-left py-4 px-4">Details</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-slate-500 italic">
                      No audit trail entries for {selectedRole} in selected timeframe.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((entry, index) => (
                    <tr key={index} className="border-b border-slate-800">
                      <td className="py-4 px-4">
                        {new Date(entry.event_date).toLocaleString()}
                      </td>

                      <td className="py-4 px-4">
                        <Badge className={`text-xs ${actionColors[entry.action] || "bg-slate-700/20 text-slate-300"}`}>
                          {entry.action}
                        </Badge>
                      </td>

                      <td className="py-4 px-4">{entry.description}</td>

                      <td className="py-4 px-4">{entry.performed_by_user}</td>

                      <td className="py-4 px-4">
                        <Badge className={`text-xs ${roleColors[entry.performed_by_role] || roleColors.DEFAULT}`}>
                          {entry.performed_by_role}
                        </Badge>
                      </td>

                      <td className="py-4 px-4">{entry.details}</td>
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
