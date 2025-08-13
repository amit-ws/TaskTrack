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

type Role = {
  name: string;
  privileges: Record<string, string[]>;
  users: string[];
  inherits: Role[];
};

// Sample data matching your structure
const rolesData: Record<string, Role> = {
  ROLE_1: {
    name: "ROLE_1",
    privileges: {
      SELECT: ["obj1", "obj2"],
      INSERT: ["objA"],
    },
    users: ["user1", "user2", "user3", "user4", "user5"],
    inherits: [
      {
        name: "ROLE_2",
        privileges: {
          SELECT: ["obj1", "obj2", "obj3"],
          INSERT: ["objA", "objB"],
        },
        users: ["user6", "user7", "user8"],
        inherits: [
          {
            name: "ROLE_3",
            privileges: {
              SELECT: ["obj1", "obj2"],
              INSERT: ["objA"],
            },
            users: ["user9"],
            inherits: [],
          },
        ],
      },
    ],
  },
  ROLE_4: {
    name: "ROLE_4",
    privileges: {
      DELETE: ["objX", "objY"],
    },
    users: ["user10", "user11"],
    inherits: [],
  },
};

const typeColors = {
  category: { card: "border-green-500 bg-[#0d2a1d]", text: "text-green-400" },
  role: { card: "border-purple-500 bg-[#1a1425]", text: "text-purple-400" },
};

function PrivilegesBox({
  privileges,
  users,
}: {
  privileges: Record<string, string[]>;
  users: string[];
}) {
  return (
    <Card
      className={`px-4 py-3 rounded-xl shadow-lg border-2 ${typeColors.role.card} ${typeColors.role.text} min-w-[200px] flex flex-col items-center`}
    >
      <div className="flex flex-wrap justify-center gap-3">
        {Object.entries(privileges).map(([priv, objs]) => (
          <TooltipProvider key={priv}>
            <Tooltip>
              <TooltipTrigger className="cursor-pointer font-semibold uppercase text-sm hover:underline">
                {priv} <span className="ml-1 text-white">({objs.length})</span>
              </TooltipTrigger>
              <TooltipContent className="bg-gray-800 text-white rounded-md p-2 max-w-xs">
                <div className="text-xs">
                  {objs.map((obj, i) => (
                    <div key={i}>{obj}</div>
                  ))}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="cursor-pointer font-semibold uppercase text-sm hover:underline">
              Users <span className="ml-1 text-white">({users.length})</span>
            </TooltipTrigger>
            <TooltipContent className="bg-gray-800 text-white rounded-md p-2 max-w-xs">
              <div className="text-xs">
                {users.map((user, i) => (
                  <div key={i}>{user}</div>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </Card>
  );
}

/** Render nested roles ONLY for levels > 1, no self/inherits split */
function NestedRoleNode({ node }: { node: Role }) {
  return (
    <div className="flex flex-col items-center space-y-6">
      <PrivilegesBox privileges={node.privileges} users={node.users} />

      {node.inherits.length > 0 && (
        <>
          {/* Vertical connector */}
          <div className="h-8 w-px bg-gray-500"></div>

          {/* Children rendered horizontally */}
          <div className="flex space-x-8">
            {node.inherits.map((child) => (
              <div key={child.name} className="flex flex-col items-center">
                <NestedRoleNode node={child} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function TopLevelRole({ node }: { node: Role }) {
  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Role Name */}
      <div className="font-bold text-xl uppercase mb-2">{node.name}</div>

      {/* Categories container */}
      <div className="flex space-x-12">
        {/* Self category */}
        <div
          className={`flex flex-col items-center border-2 rounded-xl p-4 ${typeColors.category.card} min-w-[220px]`}
        >
          <div className={`mb-4 font-semibold uppercase ${typeColors.category.text}`}>
            Self
          </div>
          <PrivilegesBox privileges={node.privileges} users={node.users} />
        </div>

        {/* Inherits category */}
        <div
          className={`flex flex-col items-center border-2 rounded-xl p-4 ${typeColors.category.card} min-w-[220px]`}
        >
          <div className={`mb-4 font-semibold uppercase ${typeColors.category.text}`}>
            Inherits
          </div>
          {node.inherits.length === 0 ? (
            <div className="text-gray-400 italic text-sm">No inherited roles</div>
          ) : (
            <div className="flex flex-col space-y-6">
              {node.inherits.map((child) => (
                <NestedRoleNode key={child.name} node={child} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function RBACGraphTab() {
  const [selectedRole, setSelectedRole] = useState<string>("ROLE_1");

  return (
    <div className="p-6 bg-black min-h-screen text-white overflow-x-auto">
      {/* Role Selector */}
      <div className="flex items-center mb-8 space-x-4">
        <Select value={selectedRole} onValueChange={setSelectedRole}>
          <SelectTrigger className="w-48 bg-gray-900 text-white border-gray-700">
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 text-white max-h-60 overflow-auto">
            {Object.values(rolesData).map((role) => (
              <SelectItem key={role.name} value={role.name}>
                {role.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Render Role Hierarchy */}
      {rolesData[selectedRole] ? (
        <div className="flex justify-center">
          <TopLevelRole node={rolesData[selectedRole]} />
        </div>
      ) : (
        <div className="text-gray-400">No role selected</div>
      )}
    </div>
  );
}
