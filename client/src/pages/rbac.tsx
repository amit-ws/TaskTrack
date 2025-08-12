import React, { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UserIcon } from "lucide-react";

const users = [
  { id: "User_1", name: "John Doe" },
  { id: "User_2", name: "Jane Smith" },
];

// UserGraph.tsx

const graphData = {
  name: "User_1",
  type: "user",
  children: [
    {
      name: "Roles",
      type: "category",
      children: [
        {
          name: "Role1",
          type: "role",
          privileges: [
            { name: "SELECT", count: 5 },
            { name: "UPDATE", count: 1 },
          ],
          children: [
            {
              name: "Role2",
              type: "role",
              privileges: [
                { name: "SELECT", count: 3 },
                { name: "UPDATE", count: 2 },
              ],
              children: [],
            },
            {
              name: "Role3", // Now direct under Role1
              type: "role",
              privileges: [
                { name: "SELECT", count: 2 },
                { name: "UPDATE", count: 1 },
              ],
              children: [],
            },
          ],
        },
      ],
    },
    {
      name: "Direct Grants",
      type: "category",
      privileges: [
        { name: "SELECT", count: 2 },
        { name: "INSERT", count: 3 },
      ],
      children: [],
    },
  ],
};


export default function RBACGraphTab() {
  const [selectedUser, setSelectedUser] = useState<string>("User_1");

  const renderPrivileges = (privileges: Record<string, string[]>) => {
    return Object.entries(privileges).map(([priv, users]) => (
      <TooltipProvider key={priv}>
        <Tooltip>
          <TooltipTrigger className="text-sm cursor-pointer hover:underline text-gray-800">
            {priv} <span className="text-gray-500">({users.length})</span>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-sm space-y-1">
              {users.map((u, i) => (
                <div key={i}>{u}</div>
              ))}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ));
  };

  const renderRole = (roleName: string, roleData: any) => {
    return (
      <div className="flex flex-col items-center">
        <Card className="px-4 py-2 rounded-lg shadow-md border border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="font-semibold text-gray-800">{roleName}</div>
          <div className="flex flex-col items-start mt-1 space-y-1">
            {renderPrivileges(roleData.privileges)}
          </div>
        </Card>
        {Object.keys(roleData.children).length > 0 && (
          <div className="flex flex-col items-center mt-4">
            <div className="h-6 w-px bg-gray-400"></div>
            <div className="flex space-x-8">
              {Object.entries(roleData.children).map(([childName, childData]) => (
                <div key={childName} className="flex flex-col items-center">
                  {renderRole(childName, childData)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const userGraph = graphData[selectedUser];

  return (
    <div className="p-6">
      {/* User Selector */}
      <div className="flex items-center mb-6 space-x-4">
        <Select value={selectedUser} onValueChange={setSelectedUser}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Select a user" />
          </SelectTrigger>
          <SelectContent>
            {users.map((user) => (
              <SelectItem key={user.id} value={user.id}>
                {user.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center space-x-2">
          <UserIcon className="w-5 h-5 text-gray-700" />
          <span className="font-medium text-gray-800">
            {users.find((u) => u.id === selectedUser)?.name}
          </span>
        </div>
      </div>

      {/* Graph */}
      <div className="flex justify-center">
        <div className="flex flex-col items-center">
          {/* User Node */}
          <Card className="px-6 py-3 rounded-lg shadow-md border border-gray-300 bg-gradient-to-r from-purple-50 to-purple-100">
            <div className="font-bold text-gray-800">
              {users.find((u) => u.id === selectedUser)?.name}
            </div>
          </Card>

          {/* Connector to Roles & Direct Grants */}
          <div className="flex flex-col items-center">
            <div className="h-6 w-px bg-gray-400"></div>
            <div className="flex space-x-16">
              {/* Roles Branch */}
              <div className="flex flex-col items-center">
                <Card className="px-4 py-2 rounded-lg shadow-md border border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
                  <div className="font-semibold text-gray-800">Roles</div>
                </Card>
                <div className="h-6 w-px bg-gray-400"></div>
                {Object.entries(userGraph.roles).map(([roleName, roleData]) =>
                  renderRole(roleName, roleData)
                )}
              </div>

              {/* Direct Grants Branch */}
              <div className="flex flex-col items-center">
                <Card className="px-4 py-2 rounded-lg shadow-md border border-gray-200 bg-gradient-to-r from-green-50 to-green-100">
                  <div className="font-semibold text-gray-800">Direct Grants</div>
                  <div className="flex flex-col items-start mt-1 space-y-1">
                    {renderPrivileges(userGraph.directGrants)}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
