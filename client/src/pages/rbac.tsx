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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import clsx from "clsx";

// ------------------------------
// Orphaned & High-Risk Roles Data
// ------------------------------
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

// ------------------------------
// User Permissions Mapping Data
// ------------------------------
const users = [
  { id: "API_USER", name: "API_USER" },
  { id: "AMITP", name: "AMITP" },
  { id: "DEV_USER", name: "DEV_USER" },
  { id: "VMAMIDI", name: "VMAMIDI" },
];

const graphData: Record<string, any> = {
  API_USER: {
    name: "API_USER",
    type: "user",
    children: [
      {
        name: "Roles",
        type: "category",
        children: [
          {
            name: "Role_1",
            type: "role",
            privileges: {
              SELECT: ["TESTDB.PUBLIC.ORDERS", "TESTDB.PUBLIC.ORDER_ITEMS"],
              UPDATE: ["TESTDB.PUBLIC.PRODUCTS"],
            },
            children: [
              {
                name: "Role_2",
                type: "role",
                privileges: {
                  INSERT: ["TESTDB.PUBLIC.CUSTOMERS"],
                },
                children: [
                  {
                    name: "Role_3",
                    type: "role",
                    privileges: {
                      SELECT: ["TESTDB.PUBLIC.REVIEWS"],
                      UPDATE: ["TESTDB.PUBLIC.USERS"],
                      DELETE: ["TESTDB.PUBLIC.SESSIONS"],
                    },
                    children: [],
                  },
                ],
              },
              {
                name: "Role_4",
                type: "role",
                privileges: {
                  DELETE: ["DEMODB.PUBLIC.INVENTORY"],
                  UPDATE: ["DEMODB.PUBLIC.SALES"],
                },
                children: [],
              },
            ],
          },
        ],
      },
      {
        name: "Direct Grants",
        type: "category",
        children: [
          {
            name: "Direct Grants Privileges",
            type: "role",
            privileges: {
              SELECT: ["TESTDB.PUBLIC.ORDERS_SUMARY", "DEMODB.PUBLIC.SALES_SUMARY"],
              INSERT: ["TESTDB.PUBLIC.USERS"],
              DELETE: ["TESTDB.PUBLIC.ADDRESSES"],
            },
          },
        ],
      },
    ],
  },
};

// ------------------------------
// Role Permissions Mapping Data
// ------------------------------
const roleUsers = [
  { id: "ROLE_1", name: "ROLE_1" },
  { id: "ROLE_2", name: "ROLE_2" },
  { id: "ROLE_3", name: "ROLE_3" },
];

const roleGraphData: Record<string, any> = {
  ROLE_1: {
    name: "ROLE_1",
    type: "user",
    children: [
      {
        name: "Inherits",
        type: "category",
        children: [
          {
            name: "Role_2",
            type: "role",
            users_count: 4,
            users_list: ["AMITP", "API_USER", "VMAMIDI", "DEV_USER"],
            privileges: {
              SELECT: ["TESTDB.PUBLIC.ORDERS", "TESTDB.PUBLIC.ORDER_ITEMS"],
              UPDATE: ["TESTDB.PUBLIC.PRODUCTS"],
            },
            children: [
              {
                name: "Role_3",
                type: "role",
                users_count: 2,
                users_list: ["AMITP", "VMAMIDI"],
                privileges: {
                  INSERT: ["TESTDB.PUBLIC.CUSTOMERS"],
                },
                children: [],
              },
              {
                name: "Role_5",
                type: "role",
                users_count: 1,
                users_list: ["AMITP"],
                privileges: {
                  DELETE: ["DEMODB.PUBLIC.INVENTORY"],
                  UPDATE: ["DEMODB.PUBLIC.SALES"],
                },
                children: [],
              },
            ],
          },
        ],
      },
      {
        name: "Self",
        type: "category",
        children: [
          {
            name: "Direct Grants Privileges",
            type: "role",
                  "users_count": 3,
            "users_list": ["API_USER", "AMITP", "DEV_USER"],
            privileges: {
              SELECT: ["TESTDB.PUBLIC.ORDERS_SUMARY", "DEMODB.PUBLIC.SALES_SUMARY"],
              INSERT: ["TESTDB.PUBLIC.USERS"],
              DELETE: ["TESTDB.PUBLIC.ADDRESSES"],
            },
          },
        ],
      },
    ],
  },
};

// ------------------------------
// Main Component
// ------------------------------
export default function RBAC() {
  const [selectedRole, setSelectedRole] = useState("ORGADMIN");
  const [selectedUser, setSelectedUser] = useState("API_USER");
  const [selectedRoleForMapping, setSelectedRoleForMapping] = useState("ROLE_1");

  const typeColors: Record<string, { card: string; text: string }> = {
    user: { card: "border-blue-500 bg-[#0d1b2a]", text: "text-blue-400" },
    category: { card: "border-green-500 bg-[#0d2a1d]", text: "text-green-400" },
    role: { card: "border-purple-500 bg-[#1a1425]", text: "text-purple-400" },
  };

  const renderPrivileges = (privileges: Record<string, string[]> | undefined) => {
    if (!privileges) return null;
    return (
      <div className="flex flex-col items-center mt-2 space-y-1">
        {Object.entries(privileges).map(([priv, objs]) => (
          <TooltipProvider key={priv}>
            <Tooltip>
              <TooltipTrigger className="text-sm cursor-pointer hover:underline text-gray-300 font-semibold">
                {priv} <span className="text-white-500">({objs.length})</span>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-sm space-y-1 max-w-xs">
                  {objs.map((obj, i) => (
                    <div key={i}>{obj}</div>
                  ))}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    );
  };

  const renderNode = (node: any) => {
    const colors = typeColors[node.type] || typeColors.role;
    return (
      <div className="flex flex-col items-center">
        <Card className={`px-3 py-2 rounded-xl shadow-lg border-2 ${colors.card} ${colors.text} min-w-[140px] flex flex-col items-center`}>
          <div className="font-bold text-md uppercase text-center">
            {node.name === "Direct Grants Privileges" ? null : node.name}
          </div>
          {renderPrivileges(node.privileges)}
        </Card>
        {node.children && node.children.length > 0 && (
          <div className="flex flex-col items-center">
            <div className="h-8 w-px bg-gray-500"></div>
            <div className="flex space-x-6">
              {node.children.map((child: any, idx: number) => (
                <div key={idx} className="flex flex-col items-center">
                  {renderNode(child)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Role Permissions Mapping render logic (with users_count tooltip, etc.)
  const renderRoleNode = (node: any) => {
    if (node.name === "Self Grants Privileges") {
      return null;
    }
    const colors = typeColors[node.type] || typeColors.role;
    return (
      <div className="flex flex-col items-center">
        <Card className={`px-3 py-2 rounded-xl shadow-lg border-2 ${colors.card} ${colors.text} min-w-[140px] flex flex-col items-center`}>
          <div className="font-bold text-md uppercase text-center">
            {node.name === "Direct Grants Privileges" ? null : node.name}
          </div>
          {renderPrivileges(node.privileges)}
          {node.type === "role" && node.users_count !== undefined && node.users_list && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  {/* <div className="mt-2 text-sm cursor-pointer underline text-purple-900 bg-yellow-400 px-2 rounded select-none"> */}
                  <div className="mt-2 text-sm cursor-pointer underline text-purple-900 px-2 rounded select-none" style={{ backgroundColor: 'gold' }}>

                    Users ({node.users_count})
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-sm space-y-1 max-w-xs">
                    {node.users_list.map((user: string, idx: number) => (
                      <div key={idx}>{user}</div>
                    ))}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </Card>
        {node.children && node.children.length > 0 && (
          <div className="flex flex-col items-center">
            <div className="h-8 w-px bg-gray-500"></div>
            <div className="flex space-x-6">
              {node.children.map((child: any, idx: number) => (
                <div key={idx} className="flex flex-col items-center">
                  {renderRoleNode(child)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

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
            <TabsTrigger value="orphaned-roles">🧩 Orphaned Roles</TabsTrigger>
            <TabsTrigger value="high-risk-roles">🔥 High-Risk Roles</TabsTrigger>
            <TabsTrigger value="user-permissions">🧭 User Permissions Mapping</TabsTrigger>
            <TabsTrigger value="role-permissions">🔗 Role Permissions Mapping</TabsTrigger>
          </TabsList>

          {/* Orphaned Roles */}
      <TabsContent value="orphaned-roles">
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
                      className={clsx(idx % 2 === 0 ? "bg-slate-900/60" : "bg-slate-800/60")}
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
          <TabsContent value="high-risk-roles">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="bg-black text-white border border-slate-700 rounded-md w-52">
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
                Viewing privileges for:{" "}
                <span className="font-bold text-slate-100">{selectedRole}</span>
              </div>
            </div>
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
                      className={clsx(idx % 2 === 0 ? "bg-slate-900/60" : "bg-slate-800/60")}
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
          </TabsContent>

          {/* User Permissions Mapping */}
     <TabsContent value="user-permissions">
            <div className="p-2 text-white overflow-x-auto">
              <div className="mb-6">
                <Select value={selectedUser} onValueChange={setSelectedUser}>
                  <SelectTrigger className="w-64 bg-gray-900 text-white border-gray-700">
                    <SelectValue placeholder="Select a user" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 text-white">
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-center">
                {graphData[selectedUser] && renderNode(graphData[selectedUser])}
              </div>
            </div>
          </TabsContent>

          {/* Role Permissions Mapping */}
          <TabsContent value="role-permissions">
            <div className="p-2 text-white overflow-x-auto">
              <div className="mb-6">
                <Select value={selectedRoleForMapping} onValueChange={setSelectedRoleForMapping}>
                  <SelectTrigger className="w-64 bg-gray-900 text-white border-gray-700">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 text-white">
                    {roleUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-center">
                {roleGraphData[selectedRoleForMapping] && renderRoleNode(roleGraphData[selectedRoleForMapping])}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
