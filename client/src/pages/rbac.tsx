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
    <Card className="bg-slate-900 border border-slate-700 rounded-lg shadow-lg">
      <CardHeader className="border-b border-slate-700 px-6 py-4">
        <CardTitle className="text-white text-xl font-semibold">RBAC Management</CardTitle>
      </CardHeader>
      <CardContent className="px-6 py-5">
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
          <TabsContent value="orphaned-roles" className="pt-1">
            <div className="overflow-x-auto">
              <table className="min-w-full border border-slate-700 rounded-lg overflow-hidden">
                <thead className="bg-slate-800">
                  <tr>
                    {["Role Name", "Role Type", "Creation Date"].map((header) => (
                      <th
                        key={header}
                        className="text-left px-6 py-3 text-slate-300 text-sm font-semibold tracking-wide select-none"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orphanedRoles.map((role, idx) => (
                    <tr
                      key={role.roleName}
                      className={`cursor-pointer transition-colors ${
                        idx % 2 === 0 ? "bg-slate-900" : "bg-slate-800"
                      } hover:bg-blue-900`}
                    >
                      <td className="px-6 py-3 text-white whitespace-nowrap">{role.roleName}</td>
                      <td className="px-6 py-3 text-slate-300 whitespace-nowrap">{role.roleType}</td>
                      <td className="px-6 py-3 text-slate-300 whitespace-nowrap">{role.creationDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* High Risk Roles Tab */}
          <TabsContent value="high-risk-roles" className="pt-1 space-y-6">
            <div className="max-w-xs">
              <label className="block mb-2 text-sm font-semibold text-slate-300 select-none" htmlFor="role-select">
                Select Role
              </label>
              <Select
                id="role-select"
                value={selectedRole}
                onValueChange={setSelectedRole}
                className="bg-slate-800 text-white rounded-md border border-slate-700 w-full"
              >
                <SelectTrigger className="px-3 py-2">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 text-white border border-slate-700 rounded-md max-h-60 overflow-auto">
                  {highRiskRoleNames.map((roleName) => (
                    <SelectItem key={roleName} value={roleName}>
                      {roleName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="text-white font-semibold text-lg">
              Showing results for <span className="text-blue-400">{selectedRole}</span>
            </div>

            <div className="overflow-x-auto rounded-lg border border-slate-700 shadow-sm">
              <table className="min-w-full table-auto border-collapse border border-slate-700">
                <thead className="bg-slate-800">
                  <tr>
                    {["Privilege", "Granted On", "Object Name", "Grant Option", "Created On"].map((header) => (
                      <th
                        key={header}
                        className="text-left px-6 py-3 text-slate-300 text-sm font-semibold tracking-wide select-none"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(highRiskData[selectedRole] || []).map((item, idx) => (
                    <tr
                      key={idx}
                      className={`cursor-pointer transition-colors ${
                        idx % 2 === 0 ? "bg-slate-900" : "bg-slate-800"
                      } hover:bg-blue-900`}
                    >
                      <td className="px-6 py-3 text-white whitespace-nowrap">{item.privilege}</td>
                      <td className="px-6 py-3 text-slate-300 whitespace-nowrap">{item.grantedOn}</td>
                      <td className="px-6 py-3 text-slate-300 whitespace-nowrap">{item.objectName}</td>
                      <td className="px-6 py-3 text-slate-300 whitespace-nowrap">{item.grantOption}</td>
                      <td className="px-6 py-3 text-slate-300 whitespace-nowrap">{item.createdOn}</td>
                    </tr>
                  ))}
                  {(!highRiskData[selectedRole] || highRiskData[selectedRole].length === 0) && (
                    <tr>
                      <td colSpan={5} className="text-center py-6 text-slate-400 italic">
                        No data available for this role.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
