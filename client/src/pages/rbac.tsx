import React, { useMemo, useRef, useState } from "react";
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

/* ---------- existing data ---------- */
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

const highRiskRoleNames = ["Select Role", "ACCOUNTADMIN", "ORGADMIN", "SECURITYADMIN", "SYSADMIN", "USERADMIN"];

const highRiskData: Record<string, any[]> = {
  ORGADMIN: [
    {
      privilege: "MANAGE BILLING",
      grantedOn: "ACCOUNT",
      objectName: "ZM08212",
      grantOption: "TRUE",
      createdOn: "Jul 28, 2025, 12:32 PM",
    },
    // ... (kept as before)
  ],
};

/* ---------- new: sample graph/user data ---------- */
/* You should replace SAMPLE_USER_GRAPH with real API-powered data in future. */
type GraphNode = {
  id: string;
  title: string;
  meta?: string; // e.g., "SELECT (5), UPDATE (1)"
  children?: GraphNode[];
  // map privilege->list of users for tooltips
  privilegeOwners?: Record<string, string[]>;
};

const SAMPLE_USER_GRAPH: Record<string, GraphNode> = {
  User_1: {
    id: "User_1",
    title: "User_1",
    children: [
      {
        id: "Role1",
        title: "Role1",
        meta: "SELECT (5), UPDATE (1)",
        privilegeOwners: {
          "SELECT (5)": ["alice", "bob", "charlie", "dan", "emma"],
          "UPDATE (1)": ["alice"],
        },
        children: [
          {
            id: "Role2",
            title: "Role2",
            meta: "SELECT (3), UPDATE (2)",
            privilegeOwners: {
              "SELECT (3)": ["charlie", "dan", "emma"],
              "UPDATE (2)": ["bob", "charlie"],
            },
            children: [
              {
                id: "Role3",
                title: "Role3",
                meta: "SELECT (2), UPDATE (1)",
                privilegeOwners: {
                  "SELECT (2)": ["dan", "emma"],
                  "UPDATE (1)": ["dan"],
                },
              },
            ],
          },
        ],
      },
      {
        id: "DirectGrants",
        title: "Direct Grants",
        children: [
          {
            id: "SELECT_DG",
            title: "SELECT (2)",
            privilegeOwners: {
              "SELECT (2)": ["frank", "gina"],
            },
          },
          {
            id: "INSERT_DG",
            title: "INSERT (3)",
            privilegeOwners: {
              "INSERT (3)": ["harry", "irene", "jack"],
            },
          },
        ],
      },
    ],
  },

  User_2: {
    id: "User_2",
    title: "User_2",
    children: [
      {
        id: "RoleA",
        title: "RoleA",
        meta: "SELECT (2)",
        privilegeOwners: {
          "SELECT (2)": ["luke", "maya"],
        },
      },
    ],
  },
};

/* ---------- helper layout & rendering logic ---------- */
/**
 * Simple tree layout:
 * - depth determines y (vertical spacing)
 * - x positions assigned by an in-order traversal counter,
 *   so siblings spread horizontally.
 *
 * Each node receives {x, y} coords in an object map.
 */
type Pos = { x: number; y: number };

function computePositions(root: GraphNode, nodeGapX = 160, levelGapY = 120) {
  let counter = 0;
  const posMap = new Map<string, Pos>();

  function dfs(node: GraphNode, depth: number) {
    // if leaf, assign next x
    if (!node.children || node.children.length === 0) {
      const x = counter * nodeGapX;
      posMap.set(node.id, { x, y: depth * levelGapY });
      counter++;
      return { minX: x, maxX: x };
    }

    // compute for children
    let min = Infinity;
    let max = -Infinity;
    node.children.forEach((c) => {
      const range = dfs(c, depth + 1);
      min = Math.min(min, range.minX);
      max = Math.max(max, range.maxX);
    });

    // place parent centered above children
    const x = (min + max) / 2;
    posMap.set(node.id, { x, y: depth * levelGapY });
    return { minX: min, maxX: max };
  }

  dfs(root, 0);

  // normalize to positive coords so first column isn't at 0 exactly (margin)
  return posMap;
}

/* ---------- small UI helpers ---------- */
function ManIcon() {
  return (
    <div className="inline-flex items-center gap-2 ml-2">
      {/* simple man icon; replace with a proper SVG icon if desired */}
      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-100 text-sm">
        👤
      </div>
    </div>
  );
}

/* ---------- Tooltip state hook (mouse-following) ---------- */
function useHoverTooltip() {
  const [visible, setVisible] = React.useState(false);
  const [pos, setPos] = React.useState({ x: 0, y: 0 });
  const [content, setContent] = React.useState<string[]>([]);

  function show(e: React.MouseEvent, items: string[]) {
    setContent(items);
    setPos({ x: e.clientX + 12, y: e.clientY + 12 });
    setVisible(true);
  }

  function move(e: React.MouseEvent) {
    setPos({ x: e.clientX + 12, y: e.clientY + 12 });
  }

  function hide() {
    setVisible(false);
    setContent([]);
  }

  return { visible, pos, content, show, move, hide };
}

/* ---------- main component ---------- */
export default function RBAC() {
  const [selectedRole, setSelectedRole] = useState("ORGADMIN");

  /* new: user graph state */
  const users = useMemo(() => Object.keys(SAMPLE_USER_GRAPH), []);
  const [selectedUser, setSelectedUser] = useState<string | null>(users[0] ?? null);

  const tooltip = useHoverTooltip();
  const svgRef = useRef<SVGSVGElement | null>(null);

  // compute nodes & positions for selected user
  const selectedGraphNode = selectedUser ? SAMPLE_USER_GRAPH[selectedUser] : null;
  const posMap = useMemo(() => {
    if (!selectedGraphNode) return new Map<string, Pos>();
    return computePositions(selectedGraphNode, 180, 100);
  }, [selectedGraphNode]);

  // compute svg size bounds (simple)
  const svgBounds = useMemo(() => {
    if (!selectedGraphNode || posMap.size === 0) return { width: 800, height: 300 };
    let maxX = 0;
    let maxY = 0;
    posMap.forEach((p) => {
      maxX = Math.max(maxX, p.x);
      maxY = Math.max(maxY, p.y);
    });
    return { width: Math.max(900, maxX + 300), height: Math.max(300, maxY + 250) };
  }, [posMap, selectedGraphNode]);

  /* recursive renderer: renders nodes and edges */
  function renderEdgesAndNodes(node: GraphNode, parentId?: string) {
    const nodes: React.ReactNode[] = [];
    const edges: React.ReactNode[] = [];

    function walk(n: GraphNode) {
      const pos = posMap.get(n.id);
      if (!pos) return;

      // edge from parent to this node
      if (n !== selectedGraphNode) {
        // find parent by searching tree - cheaper: pass parent id when recursing
      }
    }

    // We'll recurse and build arrays with parent coords
    function recur(current: GraphNode, parent?: GraphNode | null) {
      const curPos = posMap.get(current.id);
      if (!curPos) return;

      if (parent) {
        const parentPos = posMap.get(parent.id);
        if (parentPos) {
          // create a nice curved path (bezier) from parent to child
          const startX = parentPos.x + 100; // node box width / 2
          const startY = parentPos.y + 40;
          const endX = curPos.x + 100;
          const endY = curPos.y;
          const midY = (startY + endY) / 2;
          const path = `M ${startX} ${startY} C ${startX} ${midY} ${endX} ${midY} ${endX} ${endY}`;
          edges.push(
            <path
              key={`edge-${parent.id}-${current.id}`}
              d={path}
              stroke="rgba(148,163,184,0.35)"
              strokeWidth={1.8}
              fill="none"
              strokeLinecap="round"
            />
          );
        }
      }

      // Node rectangle
      const nodeX = curPos.x;
      const nodeY = curPos.y;
      const width = 200;
      const height = 56;

      // Node group
      nodes.push(
        <g key={`node-${current.id}`}>
          <rect
            x={nodeX}
            y={nodeY}
            rx={10}
            ry={10}
            width={width}
            height={height}
            className="fill-slate-900/80 stroke-slate-700"
            strokeWidth={1}
            style={{ filter: "drop-shadow(0 6px 12px rgba(2,6,23,0.6))" }}
          />
          <text
            x={nodeX + 12}
            y={nodeY + 20}
            fontSize={14}
            fill="#E6EEF3"
            fontWeight={700}
          >
            {current.title}
          </text>

          {current.meta ? (
            <text
              x={nodeX + 12}
              y={nodeY + 40}
              fontSize={12}
              fill="#94A3B8"
            >
              {/* We will render each part (comma separated) so each number chunk can be hovered */}
              {String(current.meta)
                .split(",")
                .map((chunk, i) => {
                  const trimmed = chunk.trim();
                  // chunk e.g., "SELECT (5)" or "UPDATE (1)" — we render as tspan with pointer events
                  return (
                    <tspan
                      key={i}
                      x={nodeX + 12 + i * 0}
                      dy={0}
                      // convert tspan hover to mouse events by placing transparent rect on top via foreignObject,
                    >
                      {trimmed}
                      {i < (String(current.meta).split(",").length - 1) ? ", " : ""}
                    </tspan>
                  );
                })}
            </text>
          ) : null}

          {/* Create invisible enable area for hoverable numbers by adding HTML elements above SVG using foreignObject */}
          {current.meta && current.privilegeOwners ? (
            // compute positions for each chunk to overlay a small transparent button using foreignObject
            (() => {
              const fragments = String(current.meta).split(",").map((s) => s.trim());
              // approximate placement left-to-right
              let offsetX = nodeX + 12;
              return fragments.map((frag, idx) => {
                // width estimate: 8px per char
                const estW = Math.max(40, frag.length * 7);
                const fragKey = `${current.id}-frag-${idx}`;
                return (
                  <foreignObject
                    key={fragKey}
                    x={offsetX}
                    y={nodeY + 26}
                    width={estW}
                    height={24}
                    style={{ overflow: "visible", pointerEvents: "auto" }}
                  >
                    <div
                      xmlns="http://www.w3.org/1999/xhtml"
                      className="text-[11px] text-slate-300 select-none"
                      onMouseMove={(e) => tooltip.move(e as any)}
                      onMouseEnter={(e: any) => {
                        const owners =
                          current.privilegeOwners?.[frag] ?? ["(no owners)"];
                        tooltip.show(e as any, owners);
                      }}
                      onMouseLeave={() => tooltip.hide()}
                    >
                      {/* show the small text in the same style (but inside HTML so we can capture hover) */}
                      <span className="px-0.5 py-0.5 rounded text-slate-300">
                        {frag}
                      </span>
                    </div>
                  </foreignObject>
                );
              });
            })()
          ) : null}
        </g>
      );

      // Recurse children
      (current.children ?? []).forEach((c) => recur(c, current));
    }

    recur(node, parentId ? { id: parentId } as GraphNode : null);
    return { nodes, edges };
  }

  /* convenience: if there's a user, generate the recursively rendered nodes/edges */
  const rendered = useMemo(() => {
    if (!selectedGraphNode) return { nodes: [] as React.ReactNode[], edges: [] as React.ReactNode[] };
    const { nodes, edges } = renderEdgesAndNodes(selectedGraphNode, undefined);
    return { nodes, edges };
  }, [selectedGraphNode, posMap]); // eslint-disable-line

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

            {/* NEW tab: User Graph */}
            <TabsTrigger
              value="user-graph"
              className="text-white text-sm px-4 py-2 rounded-md transition-all data-[state=active]:bg-slate-700 font-medium"
            >
              📈 User Graph
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
                    <tr
                      key={role.roleName}
                      className={clsx(
                        idx % 2 === 0 ? "bg-slate-900/60" : "bg-slate-800/60"
                      )}
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
                      className={clsx(
                        idx % 2 === 0 ? "bg-slate-900/60" : "bg-slate-800/60"
                      )}
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
          </TabsContent>

          {/* NEW: User Graph */}
          <TabsContent value="user-graph" className="space-y-6">
            <div className="flex items-center gap-4 mb-3">
              <Select
                value={selectedUser ?? undefined}
                onValueChange={(v) => setSelectedUser(v ?? null)}
              >
                <SelectTrigger className="bg-black text-white border border-slate-700 rounded-md w-56 focus:ring-2 focus:ring-slate-600">
                  <SelectValue placeholder="Select User" />
                </SelectTrigger>
                <SelectContent className="bg-black text-white border border-slate-700 rounded-md">
                  {users.map((u) => (
                    <SelectItem key={u} value={u}>
                      {u}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* show man icon + name */}
              {selectedUser ? (
                <div className="ml-2 flex items-center gap-3">
                  <ManIcon />
                  <div className="text-sm text-slate-100 font-semibold">{selectedUser}</div>
                </div>
              ) : null}
            </div>

            <div className="rounded-lg border border-slate-700 p-4 bg-black/60 overflow-auto">
              {/* svg canvas */}
              <div className="relative">
                <svg
                  ref={svgRef}
                  width={svgBounds.width}
                  height={svgBounds.height}
                  className="block"
                >
                  <defs>
                    <filter id="nodeShadow" x="-50%" y="-50%" width="200%" height="200%">
                      <feDropShadow dx="0" dy="6" stdDeviation="12" floodColor="#000000" floodOpacity="0.6" />
                    </filter>
                  </defs>

                  {/* edges */}
                  <g>{rendered.edges}</g>

                  {/* nodes */}
                  <g>{rendered.nodes}</g>
                </svg>

                {/* tooltip (HTML overlay) */}
                {tooltip.visible ? (
                  <div
                    className="absolute z-50 pointer-events-none"
                    style={{
                      left: tooltip.pos.x,
                      top: tooltip.pos.y,
                    }}
                  >
                    <div className="max-w-xs rounded-md bg-slate-900/95 border border-slate-700 p-3 text-xs text-slate-200 shadow-lg">
                      <div className="font-semibold text-sm mb-1">Owners</div>
                      <ul className="list-none space-y-1">
                        {tooltip.content.map((c, i) => (
                          <li key={i} className="text-slate-300">
                            • {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="text-xs text-slate-400 mt-2">
              Tip: hover over the privilege counts (e.g., <span className="text-slate-300">SELECT (5)</span>) to see which users hold those privileges.
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
