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
import { Database } from "lucide-react";

const users = [
  { id: "API_USER", name: "API User" },
  { id: "AMITP", name: "Amit P" },
  { id: "DEV_USER", name: "Developer User" },
  { id: "VMAMIDI", name: "V Mamidi" },
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
            name: "Role1",
            type: "role",
            privileges: {
              SELECT: ["TESTDB.PUBLIC.ORDERS", "TESTDB.PUBLIC.ORDER_ITEMS"],
              UPDATE: ["TESTDB.PUBLIC.PRODUCTS"],
            },
            children: [
              {
                name: "Role2",
                type: "role",
                privileges: {
                  INSERT: ["TESTDB.PUBLIC.CUSTOMERS"],
                },
                children: [],
              },
              {
                name: "Role3",
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
        privileges: {
          SELECT: ["TESTDB.PUBLIC.ORDERS_SUMARY", "DEMODB.PUBLIC.SALES_SUMARY"],
          INSERT: ["TESTDB.PUBLIC.USERS"],
        },
        children: [],
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

  const renderPrivileges = (privileges: Record<string, string[]>) => {
    if (!privileges) return null;
    return (
      <div className="flex flex-col items-center mt-2 space-y-1">
        {Object.entries(privileges).map(([priv, objs]) => (
          <TooltipProvider key={priv}>
            <Tooltip>
              <TooltipTrigger className="text-xs cursor-pointer hover:underline text-gray-300">
                {priv} <span className="text-gray-500">({objs.length})</span>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-sm space-y-1">
                  {objs.map((u, i) => (
                    <div key={i}>{u}</div>
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
        <Card
          className={`px-6 py-4 rounded-xl shadow-lg border-2 ${colors.card} ${colors.text} min-w-[180px] flex flex-col items-center`}
        >
          <Database className="w-8 h-8 mb-2" />
          <div className="font-bold text-lg uppercase text-center">{node.name}</div>
          <div
            className={`mt-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${colors.badge}`}
          >
            {node.type}
          </div>
          {renderPrivileges(node.privileges)}
        </Card>

        {node.children && node.children.length > 0 && (
          <div className="flex flex-col items-center">
            {/* Vertical connector */}
            <div className="h-8 w-px bg-gray-500"></div>
            {/* Horizontal branch */}
            <div className="flex space-x-8">
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
