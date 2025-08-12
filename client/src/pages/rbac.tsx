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

const graphData: Record<string, any> = {
  User_1: {
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
            privileges: {
              SELECT: ["UserA", "UserB", "UserC", "UserD", "UserE"],
              UPDATE: ["UserF"],
            },
            children: [
              {
                name: "Role2",
                type: "role",
                privileges: {
                  SELECT: ["UserG", "UserH", "UserI"],
                  UPDATE: ["UserJ", "UserK"],
                },
                children: [],
              },
              {
                name: "Role3",
                type: "role",
                privileges: {
                  SELECT: ["UserL", "UserM"],
                  UPDATE: ["UserN"],
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
          SELECT: ["UserO", "UserP"],
          INSERT: ["UserQ", "UserR", "UserS"],
        },
        children: [],
      },
    ],
  },
};

export default function RBACGraphTab() {
  const [selectedUser, setSelectedUser] = useState<string>("User_1");

  const renderPrivileges = (privileges: Record<string, string[]>) => {
    if (!privileges) return null;
    return (
      <div className="flex flex-col items-start mt-1 space-y-1">
        {Object.entries(privileges).map(([priv, users]) => (
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
        ))}
      </div>
    );
  };

  const renderNode = (node: any) => {
    return (
      <div className="flex flex-col items-center">
        <Card
          className={`px-4 py-2 rounded-lg shadow-md border border-gray-200 ${
            node.type === "user"
              ? "bg-gradient-to-r from-purple-50 to-purple-100"
              : node.type === "category"
              ? "bg-gradient-to-r from-indigo-50 to-indigo-100"
              : "bg-gradient-to-r from-blue-50 to-blue-100"
          }`}
        >
          <div className="font-semibold text-gray-800">{node.name}</div>
          {renderPrivileges(node.privileges)}
        </Card>

        {node.children && node.children.length > 0 && (
          <div className="flex flex-col items-center mt-4">
            <div className="h-6 w-px bg-gray-400"></div>
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
      <div className="flex justify-center">{renderNode(userGraph)}</div>
    </div>
  );
}
