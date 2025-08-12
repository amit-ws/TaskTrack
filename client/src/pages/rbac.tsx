import React, { useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";

const users = [
  { id: "API_USER", name: "API_USER" },
  { id: "AMITP", name: "AMITP" },
  { id: "DEV_USER", name: "DEV_USER" },
  { id: "VMAMIDI", name: "VMAMIDI" },
];

// Graph Data for API_USER
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
                  INSERT: ["TESTDB.PUBLIC.CUSTOMERS"]
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

const nodeStyle = {
  borderRadius: "12px",
  padding: "10px",
  color: "#fff",
  border: "1px solid #ddd",
  textAlign: "center",
  boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
};

const gradients: Record<string, string> = {
  user: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
  category: "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)",
  role: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
};

function PrivilegesList({ privileges }: { privileges?: Record<string, string[]> }) {
  if (!privileges) return null;
  return (
    <div style={{ fontSize: "0.8em", marginTop: "6px" }}>
      {Object.entries(privileges).map(([priv, tables]) => (
        <div key={priv} style={{ marginBottom: "4px" }}>
          <strong>{priv}:</strong> {tables.join(", ")}
        </div>
      ))}
    </div>
  );
}

const CustomNode = ({ data }: { data: any }) => {
  return (
    <div style={{ ...nodeStyle, background: gradients[data.type] || "#ccc" }}>
      <Handle type="target" position={Position.Top} />
      <div style={{ fontWeight: "bold" }}>{data.label}</div>
      <PrivilegesList privileges={data.privileges} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

const nodeTypes = { custom: CustomNode };

export default function UserGraphTab() {
  const [selectedUser, setSelectedUser] = useState(users[0].id);

  const buildGraph = (root: any, x = 0, y = 0, level = 0) => {
    const id = root.name;
    const node = {
      id,
      type: "custom",
      position: { x, y: y + level * 150 },
      data: { label: root.name, type: root.type, privileges: root.privileges },
    };

    let nodes = [node];
    let edges: any[] = [];

    root.children?.forEach((child: any, index: number) => {
      const childX = x + (index - (root.children.length - 1) / 2) * 250;
      const childY = y + 150;
      const childGraph = buildGraph(child, childX, childY, level + 1);
      nodes = [...nodes, ...childGraph.nodes];
      edges = [
        ...edges,
        ...childGraph.edges,
        { id: `${id}-${child.name}`, source: id, target: child.name },
      ];
    });

    return { nodes, edges };
  };

  const { nodes, edges } = buildGraph(graphData[selectedUser]);

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Dropdown */}
      <div style={{ padding: "10px", background: "#f5f5f5" }}>
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          style={{ padding: "5px 10px", fontSize: "14px" }}
        >
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
      </div>

      {/* Graph */}
      <div style={{ flex: 1 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.3 }}
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </div>
  );
}
