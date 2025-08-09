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
    <Card className="bg-slate-900 border-slate-800 shadow-lg rounded-lg">
      <CardHeader className="border-b border-slate-700">
        <CardTitle className="text-xl text-white font-semibold">RBAC</CardTitle>
      </CardHeader>
      <CardContent className="px-4 py-6">
        <Tabs defaultValue="orphaned-roles" className="w-full">
          <TabsList className="mb-6 border-b border-slate-700">
            <TabsTrigger
              value="orphaned-roles"
              className="text-sm font-semibold text-slate-300 hover:text-white px-4 py-2 rounded-t-lg"
            >
              Orphaned / Unused Roles
            </TabsTrigger>
            <TabsTrigger
              value="high-risk-roles"
              className="text-sm font-semibold text-slate-300 hover:text-white px-4 py-2 rounded-t-lg"
            >
              High Risk Roles
            </TabsTrigger>
          </TabsList>

          {/* Orphaned Roles Tab */}
          <TabsContent value="orphaned-roles" className="pt-2">
            <div className="overflow-x-auto rounded-lg shadow-md">
              <table className="min-w-full bg-slate-800 text-white rounded-lg">
                <thead className="bg-slate-900 text-slate-300 uppercase text-xs font-semibold tracking-wider select-none">
                  <tr>
                    <th className="px-6 py-3 border-b border-slate-700">Role Name</th>
                    <th className="px-6 py-3 border-b border-slate-700">Role Type</th>
                    <th className="px-6 py-3 border-b border-slate-700">Creation Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orphanedRoles.map((role, i) => (
                    <tr
                      key={role.roleName}
                      className={`${
                        i % 2 === 0 ? "bg-slate-700" : "bg-slate-800"
                      } hover:bg-blue-900 transition-colors cursor-pointer`}
                    >
                      <td className="px-6 py-4 font-medium whitespace-nowrap">{role.roleName}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{role.roleType}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{role.creationDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* High Risk Roles Tab */}
          <TabsContent value="high-risk-roles" className="pt-2 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-start gap-4">
              <Select
                value={selectedRole}
                onValueChange={setSelectedRole}
                className="w-48"
              >
                <SelectTrigger className="bg-slate-800 text-white border-slate-700 rounded-md">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 text-white border-slate-700 rounded-md max-h-60 overflow-auto">
                  {highRiskRoleNames.map((roleName) => (
                    <SelectItem key={roleName} value={roleName}>
                      {roleName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="text-white font-semibold text-sm whitespace-nowrap">
                Showing results for <span className="text-blue-400">{selectedRole}</span>
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg shadow-md">
              <table className="min-w-full bg-slate-800 text-white rounded-lg">
                <thead className="bg-slate-900 text-slate-300 uppercase text-xs font-semibold tracking-wider select-none">
                  <tr>
                    <th className="px-6 py-3 border-b border-slate-700">Privilege</th>
                    <th className="px-6 py-3 border-b border-slate-700">Granted On</th>
                    <th className="px-6 py-3 border-b border-slate-700">Object Name</th>
                    <th className="px-6 py-3 border-b border-slate-700">Grant Option</th>
                    <th className="px-6 py-3 border-b border-slate-700">Created On</th>
                  </tr>
                </thead>
                <tbody>
                  {(highRiskData[selectedRole] || []).map((item, idx) => (
                    <tr
                      key={idx}
                      className={`${
                        idx % 2 === 0 ? "bg-slate-700" : "bg-slate-800"
                      } hover:bg-blue-900 transition-colors cursor-pointer`}
                    >
                      <td className="px-6 py-4 font-medium whitespace-nowrap">{item.privilege}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.grantedOn}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.objectName}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.grantOption}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.createdOn}</td>
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
