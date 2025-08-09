import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

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
    <Card className="bg-slate-900 border-slate-800 shadow-lg">
      <CardHeader>
        <CardTitle>RBAC</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="orphaned-roles" className="w-full">
          <TabsList className="mb-4 border-b border-slate-700">
            <TabsTrigger value="orphaned-roles" className="text-sm font-semibold text-slate-300 hover:text-white">
              Orphaned / Unused Roles
            </TabsTrigger>
            <TabsTrigger value="high-risk-roles" className="text-sm font-semibold text-slate-300 hover:text-white">
              High Risk Roles
            </TabsTrigger>
          </TabsList>

          {/* Orphaned Roles Tab */}
          <TabsContent value="orphaned-roles" className="pt-2">
            <table className="w-full text-left text-sm border-collapse border border-slate-700">
              <thead>
                <tr className="bg-slate-800">
                  <th className="p-3 border border-slate-700 font-semibold text-slate-300">Role Name</th>
                  <th className="p-3 border border-slate-700 font-semibold text-slate-300">Role Type</th>
                  <th className="p-3 border border-slate-700 font-semibold text-slate-300">Creation Date</th>
                </tr>
              </thead>
              <tbody>
                {orphanedRoles.map((role) => (
                  <tr key={role.roleName} className="even:bg-slate-800 odd:bg-slate-900 hover:bg-slate-700 transition-colors cursor-pointer">
                    <td className="p-3 border border-slate-700">{role.roleName}</td>
                    <td className="p-3 border border-slate-700">{role.roleType}</td>
                    <td className="p-3 border border-slate-700">{role.creationDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TabsContent>

          {/* High Risk Roles Tab */}
          <TabsContent value="high-risk-roles" className="pt-2 space-y-4">
            <Select
              value={selectedRole}
              onValueChange={setSelectedRole}
              className="w-40"
            >
              <SelectTrigger className="bg-slate-800 text-white border-slate-700 rounded-md">
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 text-white border-slate-700 rounded-md">
                {highRiskRoleNames.map((roleName) => (
                  <SelectItem key={roleName} value={roleName}>
                    {roleName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="text-white font-semibold text-sm">
              Showing results for <span className="text-blue-400">{selectedRole}</span>
            </div>

            <table className="w-full text-left text-sm border-collapse border border-slate-700">
              <thead>
                <tr className="bg-slate-800">
                  <th className="p-3 border border-slate-700 font-semibold text-slate-300">Privilege</th>
                  <th className="p-3 border border-slate-700 font-semibold text-slate-300">Granted On</th>
                  <th className="p-3 border border-slate-700 font-semibold text-slate-300">Object Name</th>
                  <th className="p-3 border border-slate-700 font-semibold text-slate-300">Grant Option</th>
                  <th className="p-3 border border-slate-700 font-semibold text-slate-300">Created On</th>
                </tr>
              </thead>
              <tbody>
                {(highRiskData[selectedRole] || []).map((item, idx) => (
                  <tr key={idx} className="even:bg-slate-800 odd:bg-slate-900 hover:bg-slate-700 transition-colors cursor-pointer">
                    <td className="p-3 border border-slate-700">{item.privilege}</td>
                    <td className="p-3 border border-slate-700">{item.grantedOn}</td>
                    <td className="p-3 border border-slate-700">{item.objectName}</td>
                    <td className="p-3 border border-slate-700">{item.grantOption}</td>
                    <td className="p-3 border border-slate-700">{item.createdOn}</td>
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
