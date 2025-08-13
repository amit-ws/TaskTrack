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
        name: "Direct Grants",
        type: "category",
        children: [
          {
            name: "Direct Grants Privileges",
            type: "role",
                  "users_count": 3,
            "users_list": ["user1", "user2", "user3"],
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

export default function RBACGraphTab() {
  const [selectedUser, setSelectedUser] = useState<string>("API_USER");

  const typeColors: Record<string, { card: string; badge: string; text: string }> = {
    user: {
      card: "border-blue-500 bg-[#0d1b2a]",
      badge: "bg-blue-900 text-blue-300",
      text: "text-blue-400",
    },
    category: {
      card: "border-green-500 bg-[#0d2a1d]",
      badge: "bg-green-900 text-green-300",
      text: "text-green-400",
    },
    role: {
      card: "border-purple-500 bg-[#1a1425]",
      badge: "bg-purple-900 text-purple-300",
      text: "text-purple-400",
    },
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
    // Skip "Self Grants Privileges" node entirely
    if (node.name === "Self Grants Privileges") {
      return null;
    }

    const colors = typeColors[node.type] || typeColors.role;

    return (
      <div className="flex flex-col items-center">
        <Card
          className={`px-3 py-2 rounded-xl shadow-lg border-2 ${colors.card} ${colors.text} min-w-[140px] flex flex-col items-center`}
        >
          {/* Hide node name for "Direct Grants Privileges" */}
          <div className="font-bold text-md uppercase text-center">
            {node.name === "Direct Grants Privileges" ? null : node.name}
          </div>

          {renderPrivileges(node.privileges)}

          {/* Show users count + tooltip if this is a role with users_count */}
{node.type === "role" && node.users_count !== undefined && node.users_list && (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger>
        <div
          className="mt-2 text-sm cursor-pointer underline text-purple-900 bg-yellow-400 px-2 rounded select-none"
          style={{ userSelect: "none" }}
        >
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

      {/* Graph */}
      <div className="flex justify-center">{userGraph && renderNode(userGraph)}</div>
    </div>
  );
}
