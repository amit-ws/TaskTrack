import { useState } from "react";
import { Badge } from "@/components/ui/badge";

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import clsx from "clsx";
import { Button } from "@/components/ui/button";

const orphanedRoles = [
  { roleName: "ADMIN", roleType: "INSTANCE ROLE", creationDate: "Jul 28, 2025, 12:38 PM" },
  { roleName: "DEVELOPER", roleType: "INSTANCE ROLE", creationDate: "Jul 28, 2025, 12:38 PM" },
  { roleName: "ENGINEER", roleType: "INSTANCE ROLE", creationDate: "Jul 28, 2025, 12:38 PM" },
  { roleName: "READER", roleType: "INSTANCE ROLE", creationDate: "Jul 28, 2025, 12:38 PM" },
  { roleName: "VIEWER", roleType: "INSTANCE ROLE", creationDate: "Jul 28, 2025, 12:38 PM" },
  { roleName: "USER", roleType: "INSTANCE ROLE", creationDate: "Jul 28, 2025, 12:38 PM" },
  { roleName: "SAMPLE ROLE 1", roleType: "ROLE", creationDate: "Aug 3, 2025, 1:34 PM" },
  { roleName: "TEST ROLE 1", roleType: "ROLE", creationDate: "Aug 3, 2025, 11:18 PM" },
];

const highRiskRoleNames = ["Select Role", "ACCOUNTADMIN", "ORGADMIN", "SECURITYADMIN", "SYSADMIN", "USERADMIN"];

const highRiskData: Record<string, any[]> = {
  ORGADMIN: [
    {
      privilege: "MANAGE BILLING",
      grantedOn: "ACCOUNT",
      objectName: "ZM08212",
      grantOption: "TRUE",
      createdOn: "Jul 28, 2025, 12:32 PM",
    },
    {
      privilege: "CREATE LISTING",
      grantedOn: "ACCOUNT",
      objectName: "ZM08212",
      grantOption: "TRUE",
      createdOn: "Jul 28, 2025, 12:32 PM",
    },
    {
      privilege: "MANAGE LISTING AUTO FULFILLMENT",
      grantedOn: "ACCOUNT",
      objectName: "ZM08212",
      grantOption: "TRUE",
      createdOn: "Jul 28, 2025, 12:32 PM",
    },
    {
      privilege: "PURCHASE DATA EXCHANGE LISTING",
      grantedOn: "ACCOUNT",
      objectName: "ZM08212",
      grantOption: "TRUE",
      createdOn: "Jul 28, 2025, 12:32 PM",
    },
    {
      privilege: "MANAGE ORGANIZATION SUPPORT CASES",
      grantedOn: "ACCOUNT",
      objectName: "ZM08212",
      grantOption: "TRUE",
      createdOn: "Jul 28, 2025, 12:32 PM",
    },
    {
      privilege: "APPLY TAG",
      grantedOn: "ACCOUNT",
      objectName: "ZM08212",
      grantOption: "TRUE",
      createdOn: "Jul 28, 2025, 12:32 PM",
    },
  ],
};

const grantedUsersData = [
  {
    user_name: "AMITP",
    grant_type: "Direct",
    grant_via: null,
    total_queries: 148,
    gross_data_modified: 1240,
    bytes_consumed: 115,
  },
  {
    user_name: "API_USER",
    grant_type: "Inherited",
    grant_via: "SECURITY_ADMIN",
    total_queries: 245,
    gross_data_modified: 482,
    bytes_consumed: 73,
  },
  {
    user_name: "VMAMIDI",
    grant_type: "Direct",
    grant_via: null,
    total_queries: 102,
    gross_data_modified: 234,
    bytes_consumed: 36,
  },
  {
    user_name: "DEV_USER",
    grant_type: "Inherited",
    grant_via: "SYS_ADMIN",
    total_queries: 88,
    gross_data_modified: 18,
    bytes_consumed: 13,
  },
];

// Helper function to get badge color based on bytes_consumed (red scale)
function getBytesConsumedColor(bytes: number) {
  if (bytes > 100) return "bg-red-600 text-white";
  if (bytes > 50) return "bg-red-500 text-white";
  if (bytes > 20) return "bg-red-400 text-white";
  return "bg-red-300 text-black";
}

// Generate a consistent color badge for user_name based on hashing or simple color map
const userColors = [
  "bg-blue-600 text-white",
  "bg-green-600 text-white",
  "bg-purple-600 text-white",
  "bg-yellow-600 text-black",
  "bg-pink-600 text-white",
];
function getUserColor(userName: string) {
  // simple hash to pick color
  let hash = 0;
  for (let i = 0; i < userName.length; i++) {
    hash = userName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % userColors.length;
  return userColors[index];
}

export default function RBAC() {
  const [selectedRole, setSelectedRole] = useState("ORGADMIN");

  return (
    <Card className="backdrop-blur-md bg-black/80 border border-slate-800 rounded-xl shadow-2xl p-6">
      <CardHeader className="border-b border-slate-700 mb-4">
        <CardTitle className="text-2xl font-bold text-white tracking-wide">
          🛡️ Role-Based Access Control
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="orphaned-roles" className="w-full">
          <TabsList className="flex gap-2 mb-6 bg-black/40 border border-slate-800 rounded-lg p-1 justify-start">
            <TabsTrigger
              value="orphaned-roles"
              className="text-white text-sm px-4 py-2 rounded-md transition-all data-[state=active]:bg-slate-700 font-medium"
            >
              🧩 Orphaned Roles
            </TabsTrigger>
            <TabsTrigger
              value="high-risk-roles"
              className="text-white text-sm px-4 py-2 rounded-md transition-all data-[state=active]:bg-slate-700 font-medium"
            >
              🔥 High-Risk Roles
            </TabsTrigger>
          </TabsList>

          {/* Orphaned Roles */}
          <TabsContent value="orphaned-roles" className="space-y-4">
            <div className="overflow-auto rounded-lg border border-slate-700">
              <table className="min-w-full bg-black text-slate-200 text-xs">
                <thead className="uppercase bg-slate-900 text-slate-400 border-b border-slate-700">
                  <tr>
                    <th className="px-6 py-3 text-left">Role Name</th>
                    <th className="px-6 py-3 text-left">Role Type</th>
                    <th className="px-6 py-3 text-left">Created At</th>
                    <th className="px-6 py-3 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orphanedRoles.map((role, idx) => (
                    <tr
                      key={role.roleName}
                      className={clsx(
                        idx % 2 === 0 ? "bg-slate-900/60" : "bg-slate-800/60"
                      )}
                    >
                      <td className="px-6 py-3 font-medium">{role.roleName}</td>
                      <td className="px-6 py-3">{role.roleType}</td>
                      <td className="px-6 py-3">{role.creationDate}</td>
                      <td className="px-6 py-3">
                        <Button
                          variant="ghost"
                          className="text-red-400 hover:text-red-500 px-2 py-1 text-xs border border-red-400 hover:border-red-500 rounded transition-all"
                        >
                          Delete Role
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* High-Risk Roles */}
          <TabsContent value="high-risk-roles" className="space-y-6">
            {/* Role selector and privileges header */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="bg-black text-white border border-slate-700 rounded-md w-52 focus:ring-2 focus:ring-slate-600">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent className="bg-black text-white border border-slate-700 rounded-md">
                  {highRiskRoleNames.map((roleName) => (
                    <SelectItem key={roleName} value={roleName}>
                      {roleName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="text-xs text-slate-300">
                Showing privileges for:{" "}
                <span className="font-bold text-slate-100">{selectedRole}</span>
              </div>
            </div>

            {/* Privileges table */}
            <div className="overflow-auto rounded-lg border border-slate-700">
              <table className="min-w-full bg-black text-slate-200 text-xs">
                <thead className="uppercase bg-slate-900 text-slate-400 border-b border-slate-700">
                  <tr>
                    <th className="px-6 py-3 text-left">Privilege</th>
                    <th className="px-6 py-3 text-left">Granted On</th>
                    <th className="px-6 py-3 text-left">Object</th>
                    <th className="px-6 py-3 text-left">Grant Option</th>
                    <th className="px-6 py-3 text-left">Created On</th>
                  </tr>
                </thead>
                <tbody>
                  {(highRiskData[selectedRole] || []).map((item, idx) => (
                    <tr
                      key={idx}
                      className={clsx(
                        idx % 2 === 0 ? "bg-slate-900/60" : "bg-slate-800/60"
                      )}
                    >
                      <td className="px-6 py-3 font-medium">{item.privilege}</td>
                      <td className="px-6 py-3">{item.grantedOn}</td>
                      <td className="px-6 py-3">{item.objectName}</td>
                      <td className="px-6 py-3">{item.grantOption}</td>
                      <td className="px-6 py-3">{item.createdOn}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

{selectedRole === "ORGADMIN" && (
  <>
    {/* New Granted Users header */}
    <div className="mt-8 text-xs text-slate-300">
      Showing granted users for:{" "}
      <span className="font-bold text-slate-100">{selectedRole}</span>
    </div>

    {/* Granted users table */}
    <div className="overflow-auto rounded-lg border border-slate-700">
      <table className="min-w-full bg-black text-slate-200 text-xs">
        <thead className="uppercase bg-slate-900 text-slate-400 border-b border-slate-700">
          <tr>
            <th className="px-6 py-3 text-left">User Name</th>
            <th className="px-6 py-3 text-left">Grant Type</th>
            <th className="px-6 py-3 text-left">Granted Via</th>
            <th className="px-6 py-3 text-left">Total Queries</th>
            <th className="px-6 py-3 text-left">Gross Data Modified</th>
            <th className="px-6 py-3 text-left">Bytes Consumed (in MB)</th>
          </tr>
        </thead>
        <tbody>
          {grantedUsersData.map((user, idx) => (
            <tr
              key={user.user_name}
              className={clsx(
                idx % 2 === 0 ? "bg-slate-900/60" : "bg-slate-800/60"
              )}
            >
              <td className="px-6 py-3 text-green-400 font-bold">
                {user.user_name}
              </td>
              <td className="px-6 py-3">{user.grant_type}</td>
              <td className="px-6 py-3">{user.grant_via || "-"}</td>
              <td className="px-6 py-3">{user.total_queries}</td>
              <td className="px-6 py-3">{user.gross_data_modified}</td>
              <td className="px-6 py-3">
                <span
                  className={clsx(
                    "inline-block px-2 py-1 rounded text-xs font-semibold",
                    getBytesConsumedColor(user.bytes_consumed)
                  )}
                >
                  {user.bytes_consumed}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
)}


          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

