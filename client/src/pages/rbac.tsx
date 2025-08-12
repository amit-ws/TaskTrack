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
import { Button } from "@/components/ui/button"; // Assumes shadcn button is available
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
import dagre from "dagre";
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
// EXACTLY matching the diagram that you provided for User_1.
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

      // Roles group label (visual only)
      {
        id: "roles-label",
        type: "labelNode",
        data: { label: "Roles" },
        position: { x: 120, y: 72 },
        draggable: false,
      },

      // Role1
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

      // Role2
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

      // Role3
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

      // Direct Grants group label
      {
        id: "direct-label",
        type: "labelNode",
        data: { label: "Direct Grants" },
        position: { x: 480, y: 72 },
        draggable: false,
      },

      // Direct SELECT
      {
        id: "direct-select",
        type: "grantNode",
        data: {
          label: "SELECT",
          privileges: [{ name: "SELECT", count: 2, users: ["trent", "victor"] }],
        },
        position: { x: 460, y: 132 },
        draggable: false,
      },

      // Direct INSERT
      {
        id: "direct-insert",
        type: "grantNode",
        data: {
          label: "INSERT",
          privileges: [{ name: "INSERT", count: 3, users: ["ursula", "wendy", "xavier"] }],
        },
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

  // A second sample user (smaller graph) to demo dropdown switching
  User_2: {
    displayName: "John Doe",
    nodes: [
      { id: "u2-user", type: "userNode", data: { label: "User_2" }, position: { x: 320, y: 8 }, draggable: false },
      { id: "u2-roleA", type: "roleNode", data: { label: "RoleA", privileges: [{ name: "SELECT", count: 2, users: ["alice", "bob"] }] }, position: { x: 220, y: 132 }, draggable: false },
      { id: "u2-direct-insert", type: "grantNode", data: { label: "INSERT", privileges: [{ name: "INSERT", count: 1, users: ["eve"] }] }, position: { x: 420, y: 132 }, draggable: false },
    ],

    edges: [
      { id: "u2-e1", source: "u2-user", target: "u2-roleA", markerEnd: { type: MarkerType.Arrow } },
      { id: "u2-e2", source: "u2-user", target: "u2-direct-insert", markerEnd: { type: MarkerType.Arrow } },
    ],
  },
};

/* -------------------------------------------------------------------------- */
/* ------------------------- dagre layout + helpers ------------------------- */
/* -------------------------------------------------------------------------- */
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));
const NODE_WIDTH = 200;
const NODE_HEIGHT = 80;

function getLayoutedElements(nodes: Node[], edges: Edge[], direction = "TB") {
  // clone to avoid mutating original arrays passed in
  const clonedNodes = nodes.map((n) => ({ ...n }));
  const clonedEdges = edges.map((e) => ({ ...e }));

  dagreGraph.setGraph({ rankdir: direction, nodesep: 60, ranksep: 80 });

  clonedNodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });

  clonedEdges.forEach((edge) => {
    dagreGraph.setEdge(edge.source as string, edge.target as string);
  });

  dagre.layout(dagreGraph);

  clonedNodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    if (nodeWithPosition) {
      // set top/bottom anchors for hierarchical flow
      (node as any).targetPosition = "top";
      (node as any).sourcePosition = "bottom";
      node.position = { x: nodeWithPosition.x - NODE_WIDTH / 2, y: nodeWithPosition.y - NODE_HEIGHT / 2 };
    }
  });

  // update edges to smoothstep + arrow end
  clonedEdges.forEach((edge) => {
    (edge as any).type = "smoothstep";
    (edge as any).markerEnd = { type: MarkerType.Arrow };
  });

  return { nodes: clonedNodes, edges: clonedEdges };
}

/* -------------------------------------------------------------------------- */
/* ------------------------- custom node components ------------------------- */
/* -------------------------------------------------------------------------- */

// A larger tooltip component that renders in the RBAC card and follows mouse
function Tooltip({ x, y, visible, title, items }: { x: number; y: number; visible: boolean; title?: string; items?: string[] }) {
  if (!visible) return null;
  // keep it inside the page using small offset; you can enhance with viewport checks if needed
  const left = x + 12;
  const top = y + 12;

  return (
    <div
      className="absolute z-50 w-72 text-sm rounded-lg border border-slate-700 bg-slate-900/95 text-slate-100 p-4 shadow-2xl"
      style={{ left, top, pointerEvents: "none" }}
    >
      <div className="font-semibold mb-2">{title}</div>
      <div className="space-y-1 max-h-48 overflow-auto">
        {(items || []).map((u, i) => (
          <div key={u + i} className="text-slate-300">• {u}</div>
        ))}
      </div>
    </div>
  );
}

// Role node (used for both roles and direct grants)
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
                {/* data-priv-name used to find the privilege easily on hover */}
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

// Simple label (for "Roles" / "Direct Grants")
function LabelNode({ data }: NodeProps<any>) {
  return (
    <div className="px-3 py-2 rounded-md border border-dashed border-slate-700 bg-black/40 text-xs text-slate-300 font-semibold">
      {data.label}
    </div>
  );
}

// User node
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

  // Tooltip state
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, title: "", items: [] as string[] });

  const containerRef = useRef<HTMLDivElement | null>(null);

  // Layout initial nodes/edges for default selectedUser
  const initialGraph = roleGraphData[selectedUser] || roleGraphData[Object.keys(roleGraphData)[0]];
  const { nodes: layoutedInitialNodes, edges: layoutedInitialEdges } = useMemo(
    () =>
      getLayoutedElements(
        (initialGraph.nodes || []).map((n) => ({ ...n })),
        (initialGraph.edges || []).map((e) => ({ ...e }))
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedInitialNodes as Node[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedInitialEdges as Edge[]);

  // Register custom node types for React Flow
  const nodeTypes = useMemo(
    () => ({ roleNode: RoleNode, grantNode: RoleNode, labelNode: LabelNode, userNode: UserNode }),
    []
  );

  // When selectedUser changes, swap nodes/edges and run dagre layout
  const handleUserChange = useCallback(
    (val: string) => {
      setSelectedUser(val);
      const d = roleGraphData[val] || { nodes: [], edges: [] };

      // deep clone nodes & edges (so dagre/layout doesn't mutate original dataset)
      const nodesClone = (d.nodes || []).map((n) => ({ ...n }));
      const edgesClone = (d.edges || []).map((e) => ({ ...e }));

      const layouted = getLayoutedElements(nodesClone, edgesClone);
      setNodes(layouted.nodes as Node[]);
      setEdges(layouted.edges as Edge[]);

      // hide any tooltip
      setTooltip({ visible: false, x: 0, y: 0, title: "", items: [] });
    },
    [setNodes, setEdges]
  );

  // Delegated mouseover handler for privilege counts: shows tooltip at cursor with bigger size
  const onMouseOver = useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Check if the hovered element is the "(N)" span (or contains such text)
      const text = target.innerText?.trim();
      if (!text) return;

      const match = text.match(/^\((\d+)\)$/);
      if (!match) return;

      // Try to get privilege name from data attribute
      let privName = target.getAttribute("data-priv-name") || undefined;

      // If data attr missing, attempt to find the name by looking at the sibling within the same row
      if (!privName) {
        const row = target.closest("div") as HTMLElement | null;
        privName = row?.querySelector(":first-child")?.textContent?.trim() || undefined;
      }

      // Locate the React Flow node wrapper and node id
      const card = target.closest(".react-flow__node") as HTMLElement | null;
      const nodeId = card?.getAttribute("data-id");
      if (!nodeId || !privName) return;

      // find node data from state
      const nodeInfo = (nodes || []).find((n) => n.id === nodeId);
      if (!nodeInfo || !nodeInfo.data) return;

      const matchedPrivilege = nodeInfo.data.privileges?.find((p: any) => p.name === privName);
      if (matchedPrivilege) {
        setTooltip({
          visible: true,
          x: (e as any).clientX,
          y: (e as any).clientY,
          title: `${matchedPrivilege.name} — ${matchedPrivilege.count}`,
          items: matchedPrivilege.users,
        });
      }
    },
    [nodes]
  );

  const onMouseOut = useCallback((e: React.MouseEvent) => {
    // always hide tooltip when moving out
    setTooltip((t) => ({ ...t, visible: false }));
  }, []);

  // Render
  return (
    <Card className="backdrop-blur-md bg-black/80 border border-slate-800 rounded-xl shadow-2xl p-6 relative">
      <CardHeader className="border-b border-slate-700 mb-4">
        <CardTitle className="text-2xl font-bold text-white tracking-wide">🛡️ Role-Based Access Control</CardTitle>
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

            {/* NEW: Role Graph Tab (placed next to High-Risk Roles) */}
            <TabsTrigger
              value="role-graph"
              className="text-white text-sm px-4 py-2 rounded-md transition-all data-[state=active]:bg-slate-700 font-medium"
            >
              🕸️ Role Graph
            </TabsTrigger>
          </TabsList>

          {/* Orphaned Roles */}
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

          {/* High-Risk Roles */}
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
                    <tr key={idx} className={clsx(idx % 2 === 0 ? "bg-slate-900/60" : "bg-slate-800/60")}>
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

          {/* ------------------------------- Role Graph Tab ------------------------------ */}
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

                {/* Show man icon + name for UX when selected */}
                <div className="flex items-center gap-2 text-sm text-slate-200">
                  <div className="p-1 rounded-full bg-slate-800/60 border border-slate-700">
                    <UserIcon size={18} />
                  </div>
                  <div className="font-medium">{roleGraphData[selectedUser]?.displayName || selectedUser}</div>
                </div>
              </div>

              <div className="text-xs text-slate-400">Hover over counts (<span className="font-semibold">(N)</span>) to see which users have that privilege.</div>
            </div>

            <div
              ref={containerRef}
              onMouseOver={onMouseOver}
              onMouseOut={onMouseOut}
              className="overflow-hidden rounded-lg border border-slate-700 bg-black/60 p-4 relative"
            >
              <div className="w-full h-[520px] bg-transparent">
                <ReactFlow
                  nodes={nodes}
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

              {/* Tooltip overlay */}
              <Tooltip x={tooltip.x} y={tooltip.y} visible={tooltip.visible} title={tooltip.title} items={tooltip.items} />

              <div className="mt-3 text-xs text-slate-400">Tip: Click & drag nodes for exploration (disabled by default). This view is interactive — you can swap users from the dropdown to inspect different graphs.</div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
