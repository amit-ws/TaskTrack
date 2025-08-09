import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

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

const highRiskRoleNames = ["ACCOUNTADMIN", "ORGADMIN", "SECURITYADMIN", "SYSADMIN", "USERADMIN"];

const highRiskData: Record<string, any[]> = {
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
};

export default function RBAC() {
  const [selectedRole, setSelectedRole] = useState("ORGADMIN");

  return (
    <Card className="bg-slate-900 border-slate-800 shadow-lg">
      <CardHeader>
        <CardTitle>RBAC</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="orphaned-roles" className="w-full">
          <TabsList>
            <TabsTrigger value="orphaned-roles">Orphaned / Unused Roles</TabsTrigger>
            <TabsTrigger value="high-risk-roles">High Risk Roles</TabsTrigger>
          </TabsList>

          {/* Orphaned Roles Tab */}
          <TabsContent value="orphaned-roles" className="pt-4">
            <table className="w-full text-left text-sm border-collapse border border-slate-700">
              <thead>
                <tr className="bg-slate-800">
                  <th className="p-2 border border-slate-700">Role Name</th>
                  <th className="p-2 border border-slate-700">Role Type</th>
                  <th className="p-2 border border-slate-700">Creation Date</th>
                </tr>
              </thead>
              <tbody>
                {orphanedRoles.map((role) => (
                  <tr key={role.roleName} className="even:bg-slate-800 odd:bg-slate-900">
                    <td className="p-2 border border-slate-700">{role.roleName}</td>
                    <td className="p-2 border border-slate-700">{role.roleType}</td>
                    <td className="p-2 border border-slate-700">{role.creationDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TabsContent>

          {/* High Risk Roles Tab */}
          <TabsContent value="high-risk-roles" className="pt-4 space-y-4">
            <Select
              value={selectedRole}
              onValueChange={setSelectedRole}
              className="w-48"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                {highRiskRoleNames.map((roleName) => (
                  <SelectItem key={roleName} value={roleName}>
                    {roleName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="text-white font-semibold">
              Showing results for <span className="text-blue-400">{selectedRole}</span>
            </div>

            <table className="w-full text-left text-sm border-collapse border border-slate-700">
              <thead>
                <tr className="bg-slate-800">
                  <th className="p-2 border border-slate-700">Privilege</th>
                  <th className="p-2 border border-slate-700">Granted On</th>
                  <th className="p-2 border border-slate-700">Object Name</th>
                  <th className="p-2 border border-slate-700">Grant Option</th>
                  <th className="p-2 border border-slate-700">Created On</th>
                </tr>
              </thead>
              <tbody>
                {(highRiskData[selectedRole] || []).map((item, idx) => (
                  <tr key={idx} className="even:bg-slate-800 odd:bg-slate-900">
                    <td className="p-2 border border-slate-700">{item.privilege}</td>
                    <td className="p-2 border border-slate-700">{item.grantedOn}</td>
                    <td className="p-2 border border-slate-700">{item.objectName}</td>
                    <td className="p-2 border border-slate-700">{item.grantOption}</td>
                    <td className="p-2 border border-slate-700">{item.createdOn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
