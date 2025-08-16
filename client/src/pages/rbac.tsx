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
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { Badge } from "@/components/ui/badge";
import { Trash2, Shield } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";


// -------------- Existing Data and Helpers --------------
// const orphanedRoles = [
//   { roleName: "ADMIN", roleType: "INSTANCE ROLE", creationDate: "Jul 28, 2025, 12:38 PM" },
//   { roleName: "DEVELOPER", roleType: "INSTANCE ROLE", creationDate: "Jul 28, 2025, 12:38 PM" },
//   { roleName: "ENGINEER", roleType: "INSTANCE ROLE", creationDate: "Jul 28, 2025, 12:38 PM" },
//   { roleName: "READER", roleType: "INSTANCE ROLE", creationDate: "Jul 28, 2025, 12:38 PM" },
//   { roleName: "VIEWER", roleType: "INSTANCE ROLE", creationDate: "Jul 28, 2025, 12:38 PM" },
//   { roleName: "USER", roleType: "INSTANCE ROLE", creationDate: "Jul 28, 2025, 12:38 PM" },
//   { roleName: "SAMPLE ROLE 1", roleType: "ROLE", creationDate: "Aug 3, 2025, 1:34 PM" },
//   { roleName: "TEST ROLE 1", roleType: "ROLE", creationDate: "Aug 3, 2025, 11:18 PM" },
// ];

const highRiskRoleNames = ["Select Role", "ACCOUNTADMIN", "ORGADMIN", "SECURITYADMIN", "SYSADMIN", "USERADMIN"];

const highRiskData: Record<string, any[]> = {
  ORGADMIN: [
    { privilege: "MANAGE BILLING", grantedOn: "ACCOUNT", objectName: "ZM08212", grantOption: "TRUE", createdOn: "Jul 28, 2025, 12:32 PM" },
    { privilege: "CREATE LISTING", grantedOn: "ACCOUNT", objectName: "ZM08212", grantOption: "TRUE", createdOn: "Jul 28, 2025, 12:32 PM" },
    { privilege: "MANAGE LISTING AUTO FULFILLMENT", grantedOn: "ACCOUNT", objectName: "ZM08212", grantOption: "TRUE", createdOn: "Jul 28, 2025, 12:32 PM" },
    { privilege: "PURCHASE DATA EXCHANGE LISTING", grantedOn: "ACCOUNT", objectName: "ZM08212", grantOption: "TRUE", createdOn: "Jul 28, 2025, 12:32 PM" },
    { privilege: "MANAGE ORGANIZATION SUPPORT CASES", grantedOn: "ACCOUNT", objectName: "ZM08212", grantOption: "TRUE", createdOn: "Jul 28, 2025, 12:32 PM" },
    { privilege: "APPLY TAG", grantedOn: "ACCOUNT", objectName: "ZM08212", grantOption: "TRUE", createdOn: "Jul 28, 2025, 12:32 PM" },
  ],
};

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
                privileges: { INSERT: ["TESTDB.PUBLIC.CUSTOMERS"] },
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
                privileges: { INSERT: ["TESTDB.PUBLIC.CUSTOMERS"] },
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
            users_count: 3,
            users_list: ["API_USER", "AMITP", "DEV_USER"],
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

function getBytesConsumedColor(bytes: number) {
  if (bytes > 100) return "bg-red-600 text-white";
  if (bytes > 50) return "bg-red-500 text-white";
  if (bytes > 20) return "bg-red-400 text-white";
  return "bg-red-300 text-black";
}

// -------------- Role Usage Tab Implementation --------------
const roles = ["ROLE1", "ROLE2", "ROLE3", "ROLE4"];
const usageUsers = ["API_USER", "AMITP", "VMAMIDI", "DEV_USER"];
const daysOptions = [7, 15, 30, -1]; // -1 = ALL-TIME

const rbacData: Record<string, any> = {
  API_USER: {
    user: "API_USER",
    days: 30,
    roles: [
      {
        role_name: "ROLE1",
        grant_type: "Direct_Role",
        grant_via: null,
        objects: ["TESTDB.PUBLIC.ORDERS", "TESTDB.PUBLIC.CUSTOMERS"],
        privileges: ["SELECT", "UPDATE"],
        usage: {
          credits_consumed: 5.5,
          total_queries_fired: 120,
          total_data_processed_in_mb: 1850,
          bytes_written: 104857600,
          rows_inserted: 0,
          rows_updated: 1500,
          rows_deleted: 0,
          execution_time_ms: 985000,
          queued_overload_time_ms: 15000,
        },
      },
      {
        role_name: "ROLE2",
        grant_type: "Inherited_Role",
        grant_via: "ROLE1",
        objects: ["TESTDB.PUBLIC.SALES"],
        privileges: ["INSERT"],
        usage: {
          credits_consumed: 3.8,
          total_queries_fired: 45,
          total_data_processed_in_mb: 760,
          bytes_written: 52428800,
          rows_inserted: 5000,
          rows_updated: 0,
          rows_deleted: 0,
          execution_time_ms: 375000,
          queued_overload_time_ms: 9000,
        },
      },
      {
        role_name: "ROLE3",
        grant_type: "Inherited_Role",
        grant_via: "ROLE2",
        objects: ["TESTDB.ANALYTICS.REPORTS"],
        privileges: ["SELECT", "UPDATE", "DELETE"],
        usage: {
          credits_consumed: 2.4,
          total_queries_fired: 82,
          total_data_processed_in_mb: 990,
          bytes_written: 20971520,
          rows_inserted: 0,
          rows_updated: 1200,
          rows_deleted: 800,
          execution_time_ms: 445000,
          queued_overload_time_ms: 10000,
        },
      },
      {
        role_name: "ROLE4",
        grant_type: "Inherited_Role",
        grant_via: "ROLE1",
        objects: ["TESTDB.STAGING.TEMP_DATA"],
        privileges: ["DELETE", "UPDATE"],
        usage: {
          credits_consumed: 0.6,
          total_queries_fired: 27,
          total_data_processed_in_mb: 410,
          bytes_written: 10485760,
          rows_inserted: 0,
          rows_updated: 300,
          rows_deleted: 150,
          execution_time_ms: 128000,
          queued_overload_time_ms: 2000,
        },
      },
    ],
  },
  AMITP: { user: "AMITP", days: 30, roles: [] },
  VMAMIDI: { user: "VMAMIDI", days: 30, roles: [] },
  DEV_USER: { user: "DEV_USER", days: 30, roles: [] },
};

const getCreditColor = (value: number, max: number) => {
  const intensity = value / max;
  if (intensity > 0.8) return "bg-red-500/20 text-red-400";
  if (intensity > 0.6) return "bg-orange-500/20 text-orange-400";
  if (intensity > 0.4) return "bg-yellow-500/20 text-yellow-400";
  if (intensity > 0.2) return "bg-green-500/20 text-green-400";
  return "bg-slate-600/20 text-slate-300";
};


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
    performed_by_user: "SB_INTEGRATION",
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

const roleColors: Record<string, string> = {
  SYSTEM_ADMIN: "bg-purple-500/20 text-purple-400",
  SECURITY_ADMIN: "bg-teal-500/20 text-teal-400",
  DEFAULT: "bg-slate-600/20 text-slate-300",
};

const actionColors: Record<string, string> = {
  CREATE_ROLE: "bg-green-500/20 text-green-400",
  GRANT: "bg-blue-500/20 text-blue-400",
  REVOKE: "bg-red-500/20 text-red-400",
  ALTER: "bg-orange-500/20 text-orange-400",
};


const orphanedRolesList = [
  { roleName: "ADMIN", roleType: "INSTANCE ROLE", createdBy: "VMAMIDI", creationDate: "Jul 28, 2025, 12:38 PM" },
  { roleName: "DEVELOPER", roleType: "INSTANCE ROLE", createdBy: "API_USER", creationDate: "Jul 28, 2025, 12:38 PM" },
  { roleName: "ENGINEER", roleType: "INSTANCE ROLE", createdBy: "DEV_USER", creationDate: "Jul 28, 2025, 12:38 PM" },
  { roleName: "READER", roleType: "INSTANCE ROLE", createdBy: "AMITP", creationDate: "Jul 28, 2025, 12:38 PM" },
  { roleName: "VIEWER", roleType: "INSTANCE ROLE", createdBy: "VMAMIDI", creationDate: "Jul 28, 2025, 12:38 PM" },
  { roleName: "USER", roleType: "INSTANCE ROLE", createdBy: "API_USER", creationDate: "Jul 28, 2025, 12:38 PM" },
  { roleName: "SAMPLE ROLE 1", roleType: "ROLE", createdBy: "DEV_USER", creationDate: "Aug 3, 2025, 1:34 PM" },
  { roleName: "TEST ROLE 1", roleType: "ROLE", createdBy: "AMITP", creationDate: "Aug 3, 2025, 11:18 PM" },
];



const daysToMilliseconds = (days: number) => days * 24 * 60 * 60 * 1000;

function OrphanedRolesSection({ orphanedRolesList }: { orphanedRolesList: any[] }) {
  if (!orphanedRolesList || orphanedRolesList.length === 0) {
    return (
      <Card className="bg-black/40 border border-slate-800 text-slate-300">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white">
            Orphaned Roles
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center text-slate-400">
          🎉 No orphaned roles found
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black/40 border border-slate-800 text-slate-300">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-white">
          Orphaned Roles
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {orphanedRolesList.map((role) => (
          <div
            key={role.roleName}
            className="flex items-center justify-between p-4 bg-slate-900/60 rounded-xl border border-slate-800 hover:bg-slate-900/80 transition"
          >
            {/* Left side: Icon + Role info */}
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-sky-400" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium">{role.roleName}</span>
                  <Badge className="bg-sky-600/20 text-sky-400">Orphaned</Badge>
                </div>
                <div className="text-xs text-slate-400">
                  Created by: <span className="text-slate-300">{role.createdBy}</span> ·{" "}
                  <span className="text-slate-300">{role.creationDate}</span>
                </div>
              </div>
            </div>

            {/* Right side: Delete Action */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="gap-2">
                  <Trash2 className="w-4 h-4" /> Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Delete role "{role.roleName}"?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. The role will be permanently removed.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}


function RoleAuditSection() {
  const [selectedRole, setSelectedRole] = useState("ROLE1");
  const [selectedDays, setSelectedDays] = useState(-1); // All Time
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
      <Card className="bg-[#0d1b2a] border border-slate-700">
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
              {roles.map((role) => <option key={role} value={role}>{role}</option>)}
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
          {/* Audit Table */}
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
                  filteredData.map((entry, idx) => (
                    <tr key={idx} className="border-b border-slate-800">
                      <td className="py-4 px-4">{new Date(entry.event_date).toLocaleString()}</td>
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


function RoleUsageSection() {
  const [selectedUser, setSelectedUser] = useState("API_USER");
  const [selectedDays, setSelectedDays] = useState(7);

  const data = rbacData[selectedUser];
  const filteredRoles = data.roles.filter(() => data.days >= selectedDays);

  const maxCredits = filteredRoles.length > 0
    ? Math.max(...filteredRoles.map((r) => r.usage.credits_consumed))
    : 0;

  return (
    <section className="space-y-6 text-white">
      <Card className="bg-[#0d1b2a] border border-slate-700">
        <div className="p-6 border-b border-slate-700">
          <h3 className="text-lg font-semibold text-white">RBAC Roles &amp; Usage</h3>
          <p className="text-sm mt-1 text-slate-400">
            Role-based access control details & usage for selected users.
          </p>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center space-x-4">
            <select
              className="px-4 py-2 text-sm rounded-md bg-slate-800 text-white border border-slate-700 focus:ring-2 focus:ring-blue-600"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              {usageUsers.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
            <select
              className="px-4 py-2 text-sm rounded-md bg-slate-800 text-white border border-slate-700 focus:ring-2 focus:ring-blue-600"
              value={selectedDays}
              onChange={(e) => setSelectedDays(Number(e.target.value))}
            >
              {daysOptions.map((d) => (
                <option key={d} value={d}>{`Last ${d} days`}</option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-400 border-b border-slate-700">
                  <th className="text-left py-4 px-4">Role Name</th>
                  <th className="text-left py-4 px-4">Grant Type</th>
                  <th className="text-left py-4 px-4">Grant Via</th>
                  <th className="text-left py-4 px-4">Objects</th>
                  <th className="text-left py-4 px-4">Privileges</th>
                  <th className="text-left py-4 px-4">Credits Consumed</th>
                  <th className="text-left py-4 px-4">Queries Fired</th>
                  <th className="text-left py-4 px-4">Data Processed (MB)</th>
                  <th className="text-left py-4 px-4">Rows Inserted</th>
                  <th className="text-left py-4 px-4">Rows Updated</th>
                  <th className="text-left py-4 px-4">Rows Deleted</th>
                  <th className="text-left py-4 px-4">Execution Time (s)</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                {filteredRoles.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="py-6 text-center text-slate-500 italic">
                      No roles assigned for {selectedUser} in the last {selectedDays} days
                    </td>
                  </tr>
                ) : (
                  filteredRoles.map((role) => (
                    <tr key={role.role_name} className="border-b border-slate-800">
                      <td className="py-4 px-4 font-semibold">{role.role_name}</td>
                      <td className="py-4 px-4">
                        <Badge
                          className={`text-xs ${
                            role.grant_type === "Direct_Role"
                              ? "bg-blue-500/20 text-blue-400"
                              : "bg-purple-500/20 text-purple-400"
                          }`}
                        >
                          {role.grant_type === "Direct_Role" ? "Direct" : "Inherited"}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        {role.grant_via ? (
                          <Badge className="text-xs bg-slate-600/20 text-slate-300">{role.grant_via}</Badge>
                        ) : (
                          <span className="text-slate-500 italic text-xs">—</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        {role.objects.map((obj, i) => <div key={i}>{obj}</div>)}
                      </td>
                      <td className="py-4 px-4">
                        {role.privileges.map((priv, i) => (
                          <Badge key={i} className="text-xs bg-green-500/20 text-green-400 mr-1">{priv}</Badge>
                        ))}
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={`text-xs ${getCreditColor(role.usage.credits_consumed, maxCredits)}`}>
                          {role.usage.credits_consumed}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">{role.usage.total_queries_fired.toLocaleString()}</td>
                      <td className="py-4 px-4">{role.usage.total_data_processed_in_mb.toLocaleString()}</td>
                      <td className="py-4 px-4">{role.usage.rows_inserted.toLocaleString()}</td>
                      <td className="py-4 px-4">{role.usage.rows_updated.toLocaleString()}</td>
                      <td className="py-4 px-4">{role.usage.rows_deleted.toLocaleString()}</td>
                      <td className="py-4 px-4">{(role.usage.execution_time_ms / 1000).toFixed(1)}</td>
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

// -------------- Reusable Helpers for Tree Rendering --------------
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
                {objs.map((obj, i) => <div key={i}>{obj}</div>)}
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
      {node.children?.length > 0 && (
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

const renderRoleNode = (node: any) => {
  if (node.name === "Self Grants Privileges") return null;
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
                <div className="mt-2 text-sm cursor-pointer underline text-purple-900 px-2 rounded select-none" style={{ backgroundColor: "gold" }}>
                  Users ({node.users_count})
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-sm space-y-1 max-w-xs">
                  {node.users_list.map((u: string, i: number) => <div key={i}>{u}</div>)}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </Card>
      {node.children?.length > 0 && (
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

// --------------------------- Main RBAC Component ---------------------------
export default function RBAC() {
  const [selectedRole, setSelectedRole] = useState("ORGADMIN");
  const [selectedUser, setSelectedUser] = useState("API_USER");
  const [selectedRoleForMapping, setSelectedRoleForMapping] = useState("ROLE_1");
const activeTabClass = "data-[state=active]:bg-[#0e7fb0] data-[state=active]:text-white data-[state=active]:font-bold";


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
            <TabsTrigger value="orphaned-roles" className={activeTabClass}>🧩 Orphaned Roles</TabsTrigger>
            <TabsTrigger value="high-risk-roles" className={activeTabClass}>🔥 High-Risk Roles</TabsTrigger>
            <TabsTrigger value="user-permissions" className={activeTabClass}>🧭 User Permissions Mapping</TabsTrigger>
            <TabsTrigger value="role-permissions" className={activeTabClass}>🔗 Role Permissions Mapping</TabsTrigger>
            <TabsTrigger value="role-usage" className={activeTabClass}>📊 Role Usage</TabsTrigger>
            <TabsTrigger value="role-audit" className={activeTabClass}>⏱ Role Timeline Audit</TabsTrigger>
          </TabsList>

          {/* Tab Contents */}
                    {/* Orphaned Roles */}
     {/* <TabsContent value="orphaned-roles">
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
          </TabsContent> */}
        <TabsContent value="orphaned-roles">
          <OrphanedRolesSection orphanedRoles={orphanedRolesList} />
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

{selectedRole === "ORGADMIN" && (
  <>
    <div className="mt-8 text-xs text-slate-300">
      Showing granted users for:{" "}
      <span className="font-bold text-slate-100">{selectedRole}</span>
    </div>

    <div className="overflow-auto rounded-lg border border-slate-700 mt-2">
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

          <TabsContent value="role-usage">
            <RoleUsageSection />
          </TabsContent>
          {/* Role Audit Tab */}
          <TabsContent value="role-audit">
            <RoleAuditSection />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
