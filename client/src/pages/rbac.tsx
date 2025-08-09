import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const orphanedRoles = [
  { roleName: "ADMIN", roleType: "INSTANCE ROLE", creationDate: "2025-07-28 12:38:36.199 -0700" },
  { roleName: "DEVELOPER", roleType: "INSTANCE ROLE", creationDate: "2025-07-28 12:38:36.247 -0700" },
  { roleName: "ENGINEER", roleType: "INSTANCE ROLE", creationDate: "2025-07-28 12:38:36.260 -0700" },
  { roleName: "READER", roleType: "INSTANCE ROLE", creationDate: "2025-07-28 12:38:36.285 -0700" },
  { roleName: "VIEWER", roleType: "INSTANCE ROLE", creationDate: "2025-07-28 12:38:36.312 -0700" },
  { roleName: "USER", roleType: "INSTANCE ROLE", creationDate: "2025-07-28 12:38:58.236 -0700" },
  { roleName: "SAMPLE ROLE 1", roleType: "ROLE", creationDate: "2025-08-03 13:34:24.180 -0700" },
  { roleName: "TEST ROLE 1", roleType: "ROLE", creationDate: "2025-08-03 23:18:35.746 -0700" },
];

const highRiskRoleNames = [
  "ACCOUNTADMIN",
  "ORGADMIN",
  "SECURITYADMIN",
  "SYSADMIN",
  "USERADMIN",
];

const highRiskData: Record<string, Array<{
  privilege: string;
  grantedOn: string;
  objectName: string;
  grantOption: string;
  createdOn: string;
}>> = {
  ORGADMIN: [
    {
      privilege: "MANAGE BILLING",
      grantedOn: "ACCOUNT",
      objectName: "ZM08212",
      grantOption: "TRUE",
      createdOn: "2025-07-28 12:32:43.829 -0700",
    },
    {
      privilege: "CREATE LISTING",
      grantedOn: "ACCOUNT",
      objectName: "ZM08212",
      grantOption: "TRUE",
      createdOn: "2025-07-28 12:32:43.830 -0700",
    },
    {
      privilege: "MANAGE LISTING AUTO FULFILLMENT",
      grantedOn: "ACCOUNT",
      objectName: "ZM08212",
      grantOption: "TRUE",
      createdOn: "2025-07-28 12:32:43.830 -0700",
    },
    {
      privilege: "PURCHASE DATA EXCHANGE LISTING",
      grantedOn: "ACCOUNT",
      objectName: "ZM08212",
      grantOption: "TRUE",
      createdOn: "2025-07-28 12:32:43.831 -0700",
    },
    {
      privilege: "MANAGE ORGANIZATION SUPPORT CASES",
      grantedOn: "ACCOUNT",
      objectName: "ZM08212",
      grantOption: "TRUE",
      createdOn: "2025-07-28 12:32:43.832 -0700",
    },
    {
      privilege: "APPLY TAG",
      grantedOn: "ACCOUNT",
      objectName: "ZM08212",
      grantOption: "TRUE",
      createdOn: "2025-07-28 12:32:43.832 -0700",
    },
  ],
  // Add more role data if needed...
};

export default function RBAC() {
  const [selectedRole, setSelectedRole] = useState("ORGADMIN");

  return (
    <div className="space-y-6 bg-black min-h-screen p-8 text-slate-300">
      <h1 className="text-3xl font-bold text-white mb-6">RBAC</h1>

      <Tabs defaultValue="orphaned" className="space-y-4">
        <TabsList className="bg-slate-900 rounded-md p-1">
          <TabsTrigger value="orphaned" className="text-white">Orphaned / Unused Roles</TabsTrigger>
          <TabsTrigger value="highrisk" className="text-white">High Risk Roles</TabsTrigger>
        </TabsList>

        {/* Section 1 - Orphaned / Unused Roles */}
        <TabsContent value="orphaned" className="bg-slate-900 rounded-md p-6">
          <Card className="bg-slate-800 border border-slate-700 shadow-lg">
            <CardContent className="p-0 overflow-x-auto">
              <table className="min-w-full table-auto border-collapse border border-slate-700 text-left text-sm">
                <thead className="bg-slate-700 text-slate-200">
                  <tr>
                    <th className="border border-slate-600 px-4 py-2">Role Name</th>
                    <th className="border border-slate-600 px-4 py-2">Role Type</th>
                    <th className="border border-slate-600 px-4 py-2">Creation Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orphanedRoles.map((role) => (
                    <tr key={role.roleName} className="even:bg-slate-900 odd:bg-slate-800 hover:bg-slate-700">
                      <td className="border border-slate-700 px-4 py-2">{role.roleName}</td>
                      <td className="border border-slate-700 px-4 py-2">{role.roleType}</td>
                      <td className="border border-slate-700 px-4 py-2">{role.creationDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Section 2 - High Risk Roles */}
        <TabsContent value="highrisk" className="bg-slate-900 rounded-md p-6 space-y-4">
          <Select value={selectedRole} onValueChange={setSelectedRole} className="w-[220px] bg-slate-800 border border-slate-700 text-white">
            <SelectTrigger>
              <SelectValue placeholder="Select Role" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 text-white border border-slate-700">
              {highRiskRoleNames.map((roleName) => (
                <SelectItem key={roleName} value={roleName}>
                  {roleName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Card className="bg-slate-800 border border-slate-700 shadow-lg">
            <CardContent className="p-0 overflow-x-auto">
              <table className="min-w-full table-auto border-collapse border border-slate-700 text-left text-sm">
                <thead className="bg-slate-700 text-slate-200">
                  <tr>
                    <th className="border border-slate-600 px-4 py-2">Privilege</th>
                    <th className="border border-slate-600 px-4 py-2">Granted On</th>
                    <th className="border border-slate-600 px-4 py-2">Object Name</th>
                    <th className="border border-slate-600 px-4 py-2">Grant Option</th>
                    <th className="border border-slate-600 px-4 py-2">Created On</th>
                  </tr>
                </thead>
                <tbody>
                  {(highRiskData[selectedRole] || []).map((row, idx) => (
                    <tr key={idx} className="even:bg-slate-900 odd:bg-slate-800 hover:bg-slate-700">
                      <td className="border border-slate-700 px-4 py-2">{row.privilege}</td>
                      <td className="border border-slate-700 px-4 py-2">{row.grantedOn}</td>
                      <td className="border border-slate-700 px-4 py-2">{row.objectName}</td>
                      <td className="border border-slate-700 px-4 py-2">{row.grantOption}</td>
                      <td className="border border-slate-700 px-4 py-2">{row.createdOn}</td>
                    </tr>
                  ))}
                  {(!highRiskData[selectedRole] || highRiskData[selectedRole].length === 0) && (
                    <tr>
                      <td colSpan={5} className="text-center py-6 text-slate-500">No data available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
