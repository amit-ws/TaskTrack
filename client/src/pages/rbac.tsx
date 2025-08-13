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

const users = [
  { id: "API_USER", name: "API_USER" },
  { id: "User_2", name: "User_2" },
  { id: "User_3", name: "User_3" },
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
            users_count: 5,
            users_list: ["user1", "user2", "user3", "user4", "user5"],
            privileges: {
              SELECT: ["TESTDB.PUBLIC.ORDERS", "TESTDB.PUBLIC.ORDER_ITEMS"],
              UPDATE: ["TESTDB.PUBLIC.PRODUCTS"],
            },
            children: [
              {
                name: "Role_2",
                type: "role",
                users_count: 2,
                users_list: ["user2", "user3"],
                privileges: {
                  INSERT: ["TESTDB.PUBLIC.CUSTOMERS"],
                },
                children: [
                  {
                    name: "Role_3",
                    type: "role",
                    users_count: 3,
                    users_list: ["user2", "user3", "user4"],
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
                users_count: 1,
                users_list: ["user5"],
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
            name: "Self Grants Privileges",
            type: "role",
            users_count: 3,
            users_list: ["user1", "user2", "user3"],
            privileges: {
              SELECT: ["TESTDB.PUBLIC.ORDERS_SUMARY", "DEMODB.PUBLIC.SALES_SUMARY"],
              INSERT: ["TESTDB.PUBLIC.USERS"],
              DELETE: ["TESTDB.PUBLIC.ADDRESSES"],
            },
            children: [],
          },
        ],
      },
    ],
  },
};

export default function RBACGraphTab() {
  const [selectedUser, setSelectedUser] = useState<string>("API_USER");

  const typeColors: Record<string, { card: string; badge: string; text: string }> = {
    user: { card: "border-blue-500 bg-[#0d1b2a]", badge: "bg-blue-900 text-blue-300", text: "text-blue-400" },
    category: { card: "border-green-500 bg-[#0d2a1d]", badge: "bg-green-900 text-green-300", text: "text-green-400" },
    role: { card: "border-purple-500 bg-[#1a1425]", badge: "bg-purple-900 text-purple-300", text: "text-purple-400" },
  };

  // Render privileges from object: privilegeName => [objects]
  const renderPrivileges = (privilegesObj: Record<string, string[]>) => {
    if (!privilegesObj) return null;

    const entries = Object.entries(privilegesObj);
    if (entries.length === 0) return null;

    return (
      <div className="flex flex-col items-center mt-2 space-y-1 max-w-xs">
        {entries.map(([privName, objects]) => (
          <TooltipProvider key={privName}>
            <Tooltip>
              <TooltipTrigger className="text-sm cursor-pointer hover:underline text-gray-300 font-semibold">
                {privName} <span className="text-white-500">({objects.length})</span>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-sm space-y-1">
                  {objects.map((obj, i) => (
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

  // Render users badge with tooltip
  const renderUsers = (users_count?: number, users_list?: string[]) => {
    if (!users_count || !users_list || users_count === 0) return null;

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <div className="mt-3 px-2 py-0.5 rounded-full bg-yellow-700 text-yellow-200 text-xs font-semibold cursor-pointer select-none">
              Users: {users_count}
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <div className="text-sm space-y-0.5">
              {users_list.map((u, i) => (
                <div key={i}>{u}</div>
              ))}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  const renderNode = (node: any) => {
    // Skip rendering "Self Grants Privileges" node
    if (node.name === "Self Grants Privileges") return null;

    const colors = typeColors[node.type] || typeColors.role;

    return (
      <div className="flex flex-col items-center">
        <Card
          className={`px-3 py-2 rounded-xl shadow-lg border-2 ${colors.card} ${colors.text} min-w-[140px] flex flex-col items-center`}
        >
          <div className="font-bold text-md uppercase text-center">{node.name}</div>

          {node.privileges && renderPrivileges(node.privileges)}

          {renderUsers(node.users_count, node.users_list)}
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

  const userGraph = graphData[selectedUser];

  return (
    <div className="p-6 bg-black min-h-screen text-white overflow-x-auto">
      {/* User Selector */}
      <div className="flex items-center mb-6 space-x-4">
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

      {/* Show the user node at top */}
      <div className="flex flex-col items-center mb-8">
        {renderNode(userGraph)}
      </div>

      {/* Render children categories side-by-side */}
      <div className="flex justify-center space-x-8">
        {userGraph.children && userGraph.children.map((child: any, idx: number) => (
          <div key={idx}>{renderNode(child)}</div>
        ))}
      </div>
    </div>
  );
}
