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
  { id: "User_1", name: "User_1" },
  { id: "User_2", name: "User_2" },
  { id: "User_3", name: "User_3" },
];

const graphData: Record<string, any> = {
  User_1: {
    name: "User_1",
    type: "user",
    children: [
      {
        name: "Inherits",
        type: "category",
        children: [
          {
            name: "Role1",
            type: "role",
            users_count: 5,
            users_list: ["user1", "user2", "user3", "user4", "user5"],
            privileges: [
              {
                name: "SELECT",
                count: 2,
                objects: ["TESTDB.PUBLIC.ORDERS", "TESTDB.PUBLIC.ORDER_ITEMS"],
              },
              {
                name: "UPDATE",
                count: 1,
                objects: ["TESTDB.PUBLIC.ORDERS"],
              },
            ],
            children: [
              {
                name: "Role2",
                type: "role",
                users_count: 2,
                users_list: ["user2", "user3"],
                privileges: [
                  {
                    name: "SELECT",
                    count: 2,
                    objects: ["TESTDB.PUBLIC.CUSTOMERS", "TESTDB.PUBLIC.INVOICES"],
                  },
                  {
                    name: "UPDATE",
                    count: 1,
                    objects: ["TESTDB.PUBLIC.INVOICES"],
                  },
                ],
                children: [],
              },
              {
                name: "Role3",
                type: "role",
                users_count: 4,
                users_list: ["user1", "user2", "user3", "user4"],
                privileges: [
                  {
                    name: "SELECT",
                    count: 2,
                    objects: ["TESTDB.PUBLIC.PRODUCTS", "TESTDB.PUBLIC.CATEGORIES"],
                  },
                  {
                    name: "UPDATE",
                    count: 1,
                    objects: ["TESTDB.PUBLIC.PRODUCTS"],
                  },
                ],
                children: [],
              },
            ],
          },
        ],
      },
      // Remove "Self" from children, make it standalone below
    ],
    self: {
      name: "Self",
      type: "role",  // treat Self as a role for purple card
      users_count: 3,
      users_list: ["user1", "user2", "user3"],
      privileges: [
        {
          name: "SELECT",
          count: 2,
          objects: ["TESTDB.PUBLIC.REVIEWS", "TESTDB.PUBLIC.USERS"],
        },
        {
          name: "INSERT",
          count: 1,
          objects: ["TESTDB.PUBLIC.ORDERS"],
        },
      ],
    },
  },
};

export default function RBACGraphTab() {
  const [selectedUser, setSelectedUser] = useState<string>("User_1");

  const typeColors: Record<string, { card: string; badge: string; text: string }> = {
    user: { card: "border-blue-500 bg-[#0d1b2a]", badge: "bg-blue-900 text-blue-300", text: "text-blue-400" },
    category: { card: "border-green-500 bg-[#0d2a1d]", badge: "bg-green-900 text-green-300", text: "text-green-400" },
    role: { card: "border-purple-500 bg-[#1a1425]", badge: "bg-purple-900 text-purple-300", text: "text-purple-400" },
  };

  const renderPrivileges = (privileges: any[]) => {
    if (!privileges || privileges.length === 0) return null;

    return (
      <div className="flex flex-col items-center mt-2 space-y-1 max-w-xs">
        {privileges.map((priv) => (
          <TooltipProvider key={priv.name}>
            <Tooltip>
              <TooltipTrigger className="text-sm cursor-pointer hover:underline text-gray-300 font-semibold">
                {priv.name} <span className="text-white-500">({priv.count})</span>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-sm space-y-1">
                  {priv.objects.map((obj: string, i: number) => (
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

  const renderUsers = (users_count: number | undefined, users_list: string[] | undefined) => {
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
    const colors = typeColors[node.type] || typeColors.role;

    return (
      <div className="flex flex-col items-center">
        <Card
          className={`px-3 py-2 rounded-xl shadow-lg border-2 ${colors.card} ${colors.text} min-w-[140px] flex flex-col items-center`}
        >
          <div className="font-bold text-md uppercase text-center">{node.name}</div>

          {renderPrivileges(node.privileges)}

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

      {/* Graph: Inherits and Self side-by-side */}
      <div className="flex justify-center space-x-8">
        {userGraph.children && userGraph.children.map((child: any, idx: number) => (
          <div key={idx}>{renderNode(child)}</div>
        ))}

        {/* Render Self box as sibling */}
        {userGraph.self && renderNode(userGraph.self)}
      </div>
    </div>
  );
}
