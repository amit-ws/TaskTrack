import { useState } from "react";
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

const highRiskRoleNames = ["ACCOUNTADMIN", "ORGADMIN", "SECURITYADMIN", "SYSADMIN", "USERADMIN"];

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

export default function RBAC() {
  const [selectedRole, setSelectedRole] = useState("ORGADMIN");

  return (
    <Card className="backdrop-blur-md bg-gradient-to-br from-slate-900/80 to-slate-800/60 border border-slate-700 rounded-xl shadow-2xl p-6">
      <CardHeader className="border-b border-slate-700 mb-4">
        <CardTitle className="text-2xl font-bold text-white tracking-wide">
          🛡️ Role-Based Access Control
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="orphaned-roles" className="w-full">
          <TabsList className="flex gap-2 mb-6 bg-slate-800/40 border border-slate-700 rounded-lg p-1">
            <TabsTrigger
              value="orphaned-roles"
              className="text-white text-sm px-4 py-2 rounded-md transition-all duration-200 hover:bg-blue-700/30 data-[state=active]:bg-blue-600/60 data-[state=active]:text-white font-medium"
            >
              🧩 Orphaned Roles
            </TabsTrigger>
            <TabsTrigger
              value="high-risk-roles"
              className="text-white text-sm px-4 py-2 rounded-md transition-all duration-200 hover:bg-red-700/30 data-[state=active]:bg-red-600/60 data-[state=active]:text-white font-medium"
            >
              🔥 High-Risk Roles
            </TabsTrigger>
          </TabsList>

          {/* Orphaned Roles */}
          <TabsContent value="orphaned-roles" className="animate-fade-in space-y-4">
            <div className="overflow-auto rounded-lg border border-slate-700 shadow-inner">
              <table className="min-w-full bg-slate-900/60 text-slate-200">
                <thead className="text-xs uppercase bg-slate-800/70 text-slate-400 border-b border-slate-700">
                  <tr>
                    <th className="px-6 py-3 text-left">Role Name</th>
                    <th className="px-6 py-3 text-left">Role Type</th>
                    <th className="px-6 py-3 text-left">Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {orphanedRoles.map((role, idx) => (
                    <tr
                      key={role.roleName}
                      className={clsx(
                        idx % 2 === 0 ? "bg-slate-800/50" : "bg-slate-800/30",
                        "hover:bg-blue-900/50 transition-colors cursor-pointer"
                      )}
                    >
                      <td className="px-6 py-4 font-semibold">{role.roleName}</td>
                      <td className="px-6 py-4">{role.roleType}</td>
                      <td className="px-6 py-4">{role.creationDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* High-Risk Roles */}
          <TabsContent value="high-risk-roles" className="animate-fade-in space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="bg-slate-800 text-white border border-slate-600 rounded-md w-52 focus:ring-2 focus:ring-blue-500 focus:outline-none">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 text-white border border-slate-700 rounded-md">
                  {highRiskRoleNames.map((roleName) => (
                    <SelectItem key={roleName} value={roleName}>
                      {roleName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="text-sm text-slate-300">
                Viewing privileges for:{" "}
                <span className="font-bold text-blue-400">{selectedRole}</span>
              </div>
            </div>

            <div className="overflow-auto rounded-lg border border-slate-700 shadow-inner">
              <table className="min-w-full bg-slate-900/60 text-slate-200">
                <thead className="text-xs uppercase bg-slate-800/70 text-slate-400 border-b border-slate-700">
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
                        idx % 2 === 0 ? "bg-slate-800/50" : "bg-slate-800/30",
                        "hover:bg-red-900/50 transition-colors cursor-pointer"
                      )}
                    >
                      <td className="px-6 py-4 font-semibold">{item.privilege}</td>
                      <td className="px-6 py-4">{item.grantedOn}</td>
                      <td className="px-6 py-4">{item.objectName}</td>
                      <td className="px-6 py-4">{item.grantOption}</td>
                      <td className="px-6 py-4">{item.createdOn}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
