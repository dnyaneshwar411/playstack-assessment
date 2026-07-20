"use client";

import React, { useEffect, useRef, useState } from "react";
import { Edge, Network, Node, Options } from "vis-network/standalone";
import { DataSet } from "vis-data/peer";
import { Briefcase, Building, Mail, User } from "lucide-react";
import api from "@/network/client";

const networkOptions: Options = {
	layout: {
		hierarchical: {
			enabled: true,
			direction: "UD",
			sortMethod: "directed",
			nodeSpacing: 200,
			levelSeparation: 150,
		},
	},
	physics: {
		enabled: false,
	},
	nodes: {
		shape: "circle",
		size: 35,
		// FIX: Removed "bold: true". If your system font supports it, 
		// you can append weight parameters directly to the font family face declaration.
		font: { 
			size: 14, 
			color: "#e0e0e0", 
			face: "Arial" 
		},
		borderWidth: 2,
		color: {
			border: "#00aeff",
			background: "#2d333b",
			highlight: { border: "#ffffff", background: "#444c56" },
			hover: { border: "#ffffff", background: "#373e47" },
		},
	},
	edges: {
		width: 2,
		arrows: { to: { enabled: true, scaleFactor: 0.6 } },
		color: { color: "#444c56", highlight: "#00aeff", hover: "#768390" },
		smooth: { enabled: true, type: "cubicBezier", roundness: 0.5 },
	},
	interaction: {
		hover: true,
		tooltipDelay: 150,
		navigationButtons: true,
	},
};

// ============================================================================
// VIS-NETWORK CONFIGURATION OPTIONS
// ============================================================================

// Simple inline fallback helper for initials to bypass custom file imports
const getInitials = (name: string) => {
  if (!name) return "??";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export default function EmployeeTreeVisualizer({ initialNode }: { initialNode: any }) {
  const visJsRef = useRef<HTMLDivElement>(null);

  // Persistent vis.js data layer frames
  const nodes = useRef<DataSet<Node>>(new DataSet<Node>()).current;
  const edges = useRef<DataSet<Edge>>(new DataSet<Edge>()).current;

  const [networkInstance, setNetworkInstance] = useState<Network | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [hoveredNode, setHoveredNode] = useState<any>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState(false);
  const networkInstanceRef = useRef<Network | null>(null);

  // Transform data shapes cleanly into visual graph points
  const formatNode = (employee: any) => {
    const id = employee._id || employee.id;
    const name = employee.name || "Unknown Employee";
    return {
      id,
      name,
      label: getInitials(name),
      email: employee.email || "N/A",
      designation: employee.designation || "No Designation",
      department: employee.department || "No Department",
    };
  };

  // Core Fetching Logic: Triggered on clicking a node
  const expandNode = async (nodeId: string) => {
    if (!nodeId || expandedNodes.has(nodeId)) return;

    setLoading(true);
    try {
      // Replace with your actual application API endpoint route
      const response = await api.get(`/api/v1/user/organization/tree?node=${nodeId}&depth=2`);
      const result = await response.json();

      if (response.ok && result.data) {
        // Safely extract the employee payload if returned inside an array wrap
        const targetData = Array.isArray(result.data) ? result.data[0] : result.data;
        const directReports = targetData?.children || [];

        if (directReports.length > 0) {
          // 1. Process data entries
          const newNodes = directReports.map(formatNode);

          // 2. Build the relationship lines mapping parent -> child
          const newEdges = directReports.map((child: any) => {
            const childId = child._id || child.id;
            return {
              from: nodeId,
              to: childId,
              id: `${nodeId}-${childId}`,
            };
          });

          // 3. Update the dataset reactively
          nodes.update(newNodes);
          edges.update(newEdges);

          // 4. Smoothly shift viewport cameras to encompass incoming nodes
          // networkInstanceRef.current?.fit({ animation: { duration: 400 } });
        }

        // Mark node as expanded so we don't query the server for it again
        setExpandedNodes((prev) => new Set(prev).add(nodeId));
      }
    } catch (error) {
      console.error("Failed synchronizing downstream tree elements:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initialize Canvas Graph Core Build
  useEffect(() => {
    if (!visJsRef.current) return;

    const data = { nodes, edges };
    const network = new Network(visJsRef.current, data, networkOptions);

    // Click tracking listener rule
    network.on("click", (params) => {
      if (params.nodes.length > 0) {
        const clickedNodeId = params.nodes[0];
        expandNode(clickedNodeId);
      } else {
        setHoveredNode(null);
      }
    });

    // Calculate DOM overlay layout vectors on node hover
    network.on("hoverNode", (params) => {
      const nodeId = params.node;
      const nodeData = nodes.get(nodeId);
      const nodeCoords = network.getPositions([nodeId])[nodeId];

      if (nodeCoords) {
        const domPositions = network.canvasToDOM(nodeCoords);
        setMousePosition({ x: domPositions.x, y: domPositions.y });
        setHoveredNode({ id: nodeId, data: nodeData });
      }
    });

    network.on("blurNode", () => {
      setHoveredNode(null);
    });

    // Hydrate Initial Root Layer Setup Context
    if (initialNode && nodes.length === 0) {
      const root = Array.isArray(initialNode) ? initialNode[0] : initialNode;
      if (root) {
        const rootId = root._id || root.id;
        nodes.add(formatNode(root));
        setExpandedNodes((prev) => new Set(prev).add(rootId));

        // Pre-render immediate children if packed on mount initialization
        if (root.children && root.children.length > 0) {
          nodes.update(root.children.map(formatNode));
          edges.update(root.children.map((child: any) => {
            const childId = child._id || child.id;
            return { from: rootId, to: childId, id: `${rootId}-${childId}` };
          }));
        }
      }
    }

    setNetworkInstance(network);

    return () => {
      network.destroy();
      setNetworkInstance(null);
    };
  }, [initialNode, networkInstance]);

  return (
    <div className="relative w-full">
      {/* Loading Telemetry Header Flag indicator */}
      {loading && (
        <div className="absolute top-3 right-3 z-10 bg-black/70 px-3 py-1 text-xs text-sky-400 rounded-md font-mono animate-pulse">
          Traversing organizational nodes...
        </div>
      )}

      {/* Visual Graph Area Window Canvas wrapper */}
      <div
        ref={visJsRef}
        className="w-full border border-neutral-800 shadow-inner"
        style={{
          height: "70vh",
          background: "#1c2128", // Deep charcoal styling canvas base matching dashboard dark themes
          borderRadius: "8px",
        }}
      />

      {/* Floating Plain HTML/Tailwind Metadata Card Overlay */}
      {hoveredNode && (
        <div
          className="absolute z-50 bg-neutral-900/95 border border-neutral-700 text-neutral-200 rounded-lg shadow-2xl p-4 min-w-[260px] pointer-events-none transform transition-all duration-75 animate-in fade-in zoom-in-95"
          style={{
            left: mousePosition.x + 20,
            top: mousePosition.y - 20,
            transform: "translate(0, -50%)",
          }}
        >
          <div className="flex flex-col gap-2">
            <div className="border-b border-neutral-700 pb-1.5 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white tracking-wide truncate max-w-[180px]">
                  {hoveredNode.data.name}
                </h4>
                <span className="text-[10px] font-mono text-neutral-500 block truncate">
                  ID: {hoveredNode.id}
                </span>
              </div>
              <User className="w-4 h-4 text-sky-400 shrink-0" />
            </div>

            <div className="space-y-1.5 text-xs text-neutral-400">
              <div className="flex items-center gap-2 truncate">
                <Briefcase className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                <span className="text-neutral-300 font-medium truncate">{hoveredNode.data.designation}</span>
              </div>
              <div className="flex items-center gap-2 truncate">
                <Building className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                <span className="truncate">{hoveredNode.data.department}</span>
              </div>
              <div className="flex items-center gap-2 truncate pt-1 border-t border-neutral-800 mt-1">
                <Mail className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                <span className="truncate">{hoveredNode.data.email}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}