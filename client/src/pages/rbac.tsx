import React, { useCallback, useMemo, useRef, useState } from "react";
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
import clsx from "clsx";
import { Button } from "@/components/ui/button"; // Assumes shadcn button available
import { User as UserIcon } from "lucide-react";

// React Flow (network graph)
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  MarkerType,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  NodeProps,
} from "reactflow";
import "reactflow/dist/style.css";

/* -------------------------------------------------------------------------- */
/* --------------------------- existing sample data ------------------------- */
/* -------------------------------------------------------------------------- */
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

const highRiskRoleNames = [
  "Select Role",
  "ACCOUNTADMIN",
  "ORGADMIN",
  "SECURITYADMIN",
  "SYSADMIN",
  "USERADMIN",
];

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

/* -------------------------------------------------------------------------- */
/* ------------------------------- graph data ------------------------------- */
/* -------------------------------------------------------------------------- */
// EXACTLY matching the diagram you provided for User_1.
// Each privilege contains a list of users (shown in tooltip on number hover).
const roleGraphData: Record<string, { nodes: Node[]; edges: Edge[]; displayName?: string }> = {
  User_1: {
    displayName: "User_1",
    nodes: [
      {
        id: "user",
        type: "userNode",
        data: { label: "User_1" },
        position: { x: 320, y: 8 },
        draggable: false,
      },
      {
        id: "roles-label",
        type: "labelNode",
        data: { label: "Roles" },
        position: { x: 120, y: 72 },
        draggable: false,
      },
      {
        id: "role1",
        type: "roleNode",
        data: {
          label: "Role1",
          privileges: [
            { name: "SELECT", count: 5, users: ["alice", "bob", "carol", "dave", "eve"] },
            { name: "UPDATE", count: 1, users: ["mallory"] },
          ],
        },
        position: { x: 110, y: 132 },
        draggable: false,
      },
      {
        id: "role2",
        type: "roleNode",
        data: {
          label: "Role2",
          privileges: [
            { name: "SELECT", count: 3, users: ["alice", "bob", "carol"] },
            { name: "UPDATE", count: 2, users: ["dave", "eve"] },
          ],
        },
        position: { x: 140, y: 252 },
        draggable: false,
      },
      {
        id: "role3",
        type: "roleNode",
        data: {
          label: "Role3",
          privileges: [
            { name: "SELECT", count: 2, users: ["alice", "bob"] },
            { name: "UPDATE", count: 1, users: ["carol"] },
          ],
        },
        position: { x: 170, y: 372 },
        draggable: false,
      },
      {
        id: "direct-label",
        type: "labelNode",
        data: { label: "Direct Grants" },
        position: { x: 480, y: 72 },
        draggable: false,
      },
      {
        id: "direct-select",
        type: "grantNode",
        data: { label: "SELECT", privileges: [{ name: "SELECT", count: 2, users: ["trent", "victor"] }] },
        position: { x: 460, y: 132 },
        draggable: false,
      },
      {
        id: "direct-insert",
        type: "grantNode",
        data: { label: "INSERT", privileges: [{ name: "INSERT", count: 3, users: ["ursula", "wendy", "xavier"] }] },
        position: { x: 500, y: 212 },
        draggable: false,
      },
    ],
    edges: [
      { id: "e-user-role1", source: "user", target: "role1", markerEnd: { type: MarkerType.Arrow } },
      { id: "e-role1-role2", source: "role1", target: "role2", markerEnd: { type: MarkerType.Arrow } },
      { id: "e-role2-role3", source: "role2", target: "role3", markerEnd: { type: MarkerType.Arrow } },
      { id: "e-user-direct-select", source: "user", target: "direct-select", markerEnd: { type: MarkerType.Arrow } },
      { id: "e-user-direct-insert", source: "user", target: "direct-insert", markerEnd: { type: MarkerType.Arrow } },
    ],
  },
  User_2: {
    displayName: "John Doe",
    nodes: [
      { id: "u2-user", type: "userNode", data: { label: "User_2" }, position: { x: 320, y: 8 }, draggable: false },
      {
        id: "u2-roleA",
        type: "roleNode",
        data: { label: "RoleA", privileges: [{ name: "SELECT", count: 2, users: ["alice", "bob"] }] },
        position: { x: 220, y: 132 },
        draggable: false,
      },
      {
        id: "u2-direct-insert",
        type: "grantNode",
        data: { label: "INSERT", privileges: [{ name: "INSERT", count: 1, users: ["eve"] }] },
        position: { x: 420, y: 132 },
        draggable: false,
      },
    ],
    edges: [
      { id: "u2-e1", source: "u2-user", target: "u2-roleA", markerEnd: { type: MarkerType.Arrow } },
      { id: "u2-e2", source: "u2-user", target: "u2-direct-insert", markerEnd: { type: MarkerType.Arrow } },
    ],
  },
};

/* -------------------------------------------------------------------------- */
/* ------------------------- custom node components ------------------------- */
/* -------------------------------------------------------------------------- */
function Tooltip({ x, y, visible, title, items }: { x: number; y: number; visible: boolean; title?: string; items?: string[] }) {
  if (!visible) return null;
  return (
    <div
      className="absolute z-50 max-w-xs text-sm rounded-md border border-slate-500 bg-slate-800/95 text-white p-4 shadow-lg"
      style={{ left: x + 8, top: y + 8, transform: "translate(-50%, -100%)", pointerEvents: "none" }}
    >
      <div className="font-semibold text-lg mb-2">{title}</div>
      <div className="space-y-1 max-h-48 overflow-auto text-base">
        {(items || []).map((u, i) => (
          <div key={u + i}>• {u}</div>
        ))}
      </div>
    </div>
  );
}

function RoleNode({ data }: NodeProps<any>) {
  const { label, privileges } = data ?? {};
  return (
    <div className="min-w-[160px] p-3 rounded-lg border border-slate-700 bg-black/60 text-xs text-slate-200">
      <div className="font-medium text-sm mb-2">{label}</div>
      <div className="space-y-1">
        {Array.isArray(privileges) &&
          privileges.map((p: any) => (
            <div key={p.name} className="flex items-center justify-between">
              <div className="truncate">{p.name}</div>
              <div className="ml-2">
                <span
                  className="px-2 py-0.5 rounded-md text-[11px] border border-slate-700 cursor-pointer select-none"
                  data-priv-name={p.name}
                >
                  ({p.count})
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

function LabelNode({ data }: NodeProps<any>) {
  return (
    <div className="px-3 py-2 rounded-md border border-dashed border-slate-700 bg-black/40 text-xs text-slate-300 font-semibold">
      {data.label}
    </div>
  );
}

function UserNode({ data }: NodeProps<any>) {
  return (
    <div className="p-3 rounded-lg border border-slate-700 bg-black/70 text-sm text-slate-100 font-semibold">
      {data.label}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* ------------------------------- MAIN COMPONENT --------------------------- */
/* -------------------------------------------------------------------------- */
export default function RBAC() {
  const [selectedRole, setSelectedRole] = useState("ORGADMIN");
  const [selectedUser, setSelectedUser] = useState("User_1");
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, title: "", items: [] as string[] });
  const containerRef = useRef<HTMLDivElement | null>(null);

  const initial = roleGraphData[selectedUser] || roleGraphData[Object.keys(roleGraphData)[0]];
  const [nodes, setNodes, onNodesChange] = useNodesState(initial.nodes as Node[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initial.edges as Edge[]);

  const nodeTypes = useMemo(
    () => ({ roleNode: RoleNode, grantNode: RoleNode, labelNode: LabelNode, userNode: UserNode }),
    []
  );

  const handleUserChange = useCallback(
    (val: string) => {
      setSelectedUser(val);
      const d = roleGraphData[val] || { nodes: [], edges: [] };
      setNodes(d.nodes as Node[]);
      setEdges(d.edges as Edge[]);
      setTooltip({ visible: false, x: 0, y: 0, title: "", items: [] });
    },
    [setNodes, setEdges]
  );

  const onMouseOver = useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const text = target.innerText?.trim();
      if (!text || !/^\(\d+\)$/.test(text)) return;

      const card = target.closest(".react-flow__node") as HTMLElement | null;
      if (!card) return;
      const nodeId = card.getAttribute("data-id");
      if (!nodeId) return;
      const nodeInfo = nodes.find((n) => n.id === nodeId);
      if (!nodeInfo) return;

      const rows = Array.from(card.querySelectorAll("div > div:nth-child(2) > div"));
      const mouseX = (e as any).clientX;
      const mouseY = (e as any).clientY;

      for (const row of rows) {
        const bb = (row as HTMLElement).getBoundingClientRect();
        if (mouseX >= bb.left && mouseX <= bb.right && mouseY >= bb.top && mouseY <= bb.bottom) {
          const name = row.querySelector(":first-child")?.textContent?.trim() || "";
          const matched = nodeInfo.data.privileges?.find((p: any) => p.name === name);
          if (matched) {
            setTooltip({ visible: true, x: mouseX, y: mouseY, title: `${matched.name} — ${matched.count}`, items: matched.users });
          }
          return;
        }
      }
    },
    [nodes]
  );

  const onMouseOut = useCallback(() => {
    setTooltip((t) => ({ ...t, visible: false }));
  }, []);

  // Manual layout tweak for hierarchy
  const layeredNodes = nodes.map((n) => {
    if (n.id.startsWith("role")) {
      return { ...n, position: { x: n.position.x, y: n.position.y + 50 } };
    }
    if (n.id.startsWith("direct")) {
      return { ...n, position: { x: n.position.x, y: n.position.y + 80 } };
    }
    return n;
  });

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
            <TabsTrigger
              value="orphaned-roles"
              className="text-white text-sm px-4 py-2 rounded-md transition-all data-[state=active]:bg-slate-700 font-medium"
            >
              🧩 Orphaned Roles
            </TabsTrigger>
            <TabsTrigger
              value="high-risk-roles"
              className="text-white text-sm px-4 py-2 rounded-md transition-all data-[state=active]:bg-slate-700 font-medium"
            >
              🔥 High-Risk Roles
            </TabsTrigger>
            <TabsTrigger
              value="role-graph"
              className="text-white text-sm px-4 py-2 rounded-md transition-all data-[state=active]:bg-slate-700 font-medium"
            >
              🕸️ Role Graph
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orphaned-roles" className="space-y-4">
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
                    <tr key={role.roleName} className={clsx(idx % 2 === 0 ? "bg-slate-900/60" : "bg-slate-800/60")}>
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

          <TabsContent value="high-risk-roles" className="space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="bg-black text-white border border-slate-700 rounded-md w-52 focus:ring-2 focus:ring-slate-600">
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
                Viewing privileges for: <span className="font-bold text-slate-100">{selectedRole}</span>
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
                    <tr iconotoqu />
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="role-graph" className="space-y-4">
            <div className="flex items-center justify-between gap-4 mb-3">
              <div className="flex items-center gap-3">
                <Select value={selectedUser} onValueChange={handleUserChange}>
                  <SelectTrigger className="bg-black text-white border border-slate-700 rounded-md w-44 focus:ring-2 focus:ring-slate-600">
                    <SelectValue placeholder="Select User" />
                  </SelectTrigger>
                  <SelectContent className="bg-black text-white border border-slate-700 rounded-md">
                    {Object.keys(roleGraphData).map((u) => (
                      <SelectItem key={u} value={u}>
                        {roleGraphData[u].displayName || u}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-2 text-sm text-slate-200">
                  <div className="p-1 rounded-full bg-slate-800/60 border border-slate-700">
                    <UserIcon size={18} />
                  </div>
                  <div className="font-medium">
                    {roleGraphData[selectedUser]?.displayName || selectedUser}
                  </div>
                </div>
              </div>
              <div className="text-xs text-slate-400">
                Hover over counts (<span className="font-semibold">(N)</span>) to see which users have that privilege.
              </div>
            </div>

            <div
              ref={containerRef}
              onMouseOver={onMouseOver}
              onMouseOut={onMouseOut}
              className="overflow-hidden rounded-lg border border-slate-700 bg-black/60 p-4"
            >
              <div className="w-full h-[520px] bg-transparent">
                <ReactFlow
                  nodes={layeredNodes}
                  edges={edges}
                  nodeTypes={nodeTypes}
                  fitView
                  attributionPosition="bottom-left"
                  nodesDraggable={false}
                >
                  <Background gap={16} size={1} />
                  <Controls />
                  <MiniMap />
                </ReactFlow>
              </div>
              <Tooltip x={tooltip.x} y={tooltip.y} visible={tooltip.visible} title={tooltip.title} items={tooltip.items} />
              <div className="mt-3 text-xs text-slate-400">
                Tip: Click & drag nodes for exploration (disabled by default). This view is interactive — swap users from the dropdown to inspect different graphs.
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
