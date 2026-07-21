import { Data, Network, Options } from "vis-network/standalone";
import { DataSet } from "vis-data/peer";
import { useEffect, useRef, useState, useCallback } from "react";
import api from "@/network/client";
import { networkOptions, roleColors } from "@/modules/organization-tree/helpers/config";
import { Employee } from "../helpers/types"
import { getRoleColor } from "../helpers/utils";

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const createInitialsSVG = (initials: string, color: string, borderColor: string) => {
  return `
    <svg width="60" height="60" xmlns="http://www.w3.org/2000/svg">
      <circle cx="30" cy="30" r="28" fill="${color}" stroke="${borderColor}" stroke-width="2"/>
      <text 
        x="30" 
        y="32" 
        text-anchor="middle" 
        dominant-baseline="central"
        font-family="Inter, -apple-system, sans-serif" 
        font-size="20" 
        font-weight="600" 
        fill="white"
        style="text-shadow: 0 1px 2px rgba(0,0,0,0.3)"
      >
        ${initials}
      </text>
    </svg>
  `;
};

export default function Visualizer({ rootNode }: { rootNode: any }) {
  const instanceRef = useRef<HTMLDivElement | null>(null);
  const networkRef = useRef<Network | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isStabilizing, setIsStabilizing] = useState(false);

  const nodes = useRef(new DataSet()).current;
  const edges = useRef(new DataSet()).current;
  const allData = useRef([rootNode]).current;

  const getChildren = useCallback(async (parentId: string) => {
    try {
      const response = await api.get(`/api/v1/user/organization/tree?node=${parentId}&depth=1`);
      if (response.code !== 200) return [];
      return response.data?.at(0)?.children || [];
    } catch (error) {
      return [];
    }
  }, []);

  const buildNode = useCallback((employee: Employee, position?: { x: number; y: number }) => {
    const color = getRoleColor(employee.department);
    const initials = getInitials(employee.name);

    const tooltip = [
      employee.name,
      `📧 ${employee.email}`,
      `💼 ${employee.designation}`,
      `🏢 ${employee.department}`,
    ].join('\n');

    const svg = createInitialsSVG(initials, color.bg, color.border);

    const node: any = {
      id: employee._id,
      label: employee.name,
      title: tooltip,
      department: employee.department,
      designation: employee.designation,
      shape: "image",
      image: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`,
      size: 50,
      color: {
        background: 'transparent',
        border: 'transparent',
        highlight: {
          background: 'transparent',
          border: 'transparent',
        },
      },
      font: {
        color: "#ffffff",
        size: 12,
        strokeWidth: 0,
        align: "center",
        face: "Inter, -apple-system, sans-serif",
      },
      shapeProperties: {
        useImageSize: false,
        useBorderWithImage: false,
      },
      data: {
        email: employee.email,
        designation: employee.designation,
        department: employee.department,
        initials: initials,
      }
    };

    if (position) {
      node.x = position.x;
      node.y = position.y;
    }

    return node;
  }, []);

  const expandNode = useCallback(async (nodeId: string) => {
    if (expandedNodes.has(nodeId)) return;

    setIsLoading(true);
    try {
      const children = await getChildren(nodeId);

      if (children?.length > 0) {
        const parentNode = nodes.get(nodeId);
        const parentX = (parentNode as any)?.x || 0;
        const parentY = (parentNode as any)?.y || 0;
        const radius = 250;
        const angleStep = (2 * Math.PI) / children.length;

        children.forEach((child: Employee, index: number) => {
          const angle = angleStep * index;
          const x = parentX + radius * Math.cos(angle);
          const y = parentY + radius * Math.sin(angle);

          const childNode = buildNode(child, { x, y });
          nodes.add(childNode);
          edges.add({
            from: nodeId,
            to: child._id,
            length: 200,
          } as {});
        });

        setExpandedNodes(prev => new Set(prev).add(nodeId));

        if (networkRef.current) {
          setIsStabilizing(true);
          networkRef.current.stabilize(500);

          setTimeout(() => {
            networkRef.current?.fit({
              animation: {
                duration: 1000,
                easingFunction: "easeInOutQuad",
              }
            });
            setIsStabilizing(false);
          }, 800);
        }
      }
    } catch (error) {
      setIsStabilizing(false);
    } finally {
      setIsLoading(false);
    }
  }, [expandedNodes, getChildren, buildNode, nodes, edges]);

  useEffect(() => {
    if (allData.length > 0 && nodes.length === 0) {
      if (rootNode) {
        nodes.add(buildNode(rootNode, { x: 0, y: 0 }));

        setTimeout(() => {
          expandNode(rootNode._id);
        }, 500);
      }
    }
  }, [allData, nodes, buildNode, expandNode]);

  useEffect(() => {
    const container = instanceRef.current;
    if (!container || nodes.length === 0) return;

    const networkInstance = new Network(
      container,
      { nodes, edges } as Data,
      networkOptions as Options
    );

    networkRef.current = networkInstance;

    networkInstance.on("click", function (params) {
      if (params.nodes && params.nodes.length > 0) {
        const nodeId = params.nodes[0];
        setSelectedNodeId(nodeId);
        if (!expandedNodes.has(nodeId)) {
          expandNode(nodeId);
        }
      }
    });

    networkInstance.on("hoverNode", function (params) {
      if (params.node) {
        instanceRef.current?.style.setProperty("cursor", "pointer");
      }
    });

    networkInstance.on("blurNode", function () {
      instanceRef.current?.style.setProperty("cursor", "default");
    });

    networkInstance.once("stabilizationIterationsDone", () => {
      networkInstance.fit({
        animation: {
          duration: 500,
          easingFunction: "easeInOutQuad",
        }
      });
    });

    return () => {
      networkInstance.destroy();
      networkRef.current = null;
    };
  }, [nodes, edges, networkOptions, expandedNodes, expandNode]);

  const fitNetwork = useCallback(() => {
    if (networkRef.current) {
      networkRef.current.fit({
        animation: {
          duration: 500,
          easingFunction: "easeInOutQuad",
        }
      });
    }
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'f' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        fitNetwork();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [fitNetwork]);

  return <div className="relative w-full h-[86vh] bg-[#0a0a0a]">
    <div className="absolute top-4 lg:top-12 left-4 z-10 bg-black/60 backdrop-blur-md rounded-lg px-4 py-2 border border-white/10">
      <div className="flex items-center gap-4 text-sm text-gray-300">
        <span className="font-medium">👥 {nodes.length} Employee(s)</span>
        <span className="w-px h-4 bg-white/20" />
        <span>🔗 {edges.length} Connection(s)</span>
        {selectedNodeId && (
          <>
            <span className="w-px h-4 bg-white/20" />
            <span className="text-blue-400">
              Selected: {(nodes.get(selectedNodeId) as any)?.label || selectedNodeId}
            </span>
          </>
        )}
      </div>
      <button
        onClick={fitNetwork}
        className="ml-4 px-2 py-1 text-xs bg-white/10 hover:bg-white/20 rounded transition-colors"
      >
        🔄 Fit View
      </button>
    </div>

    <div
      ref={instanceRef}
      className="w-full h-full"
      style={{
        background: "radial-gradient(circle at center, #1a1a1a 0%, #0a0a0a 100%)",
      }}
    />

    <div className="absolute top-4 right-4 z-10 bg-black/60 backdrop-blur-md rounded-lg p-3 border border-white/10">
      <div className="text-xs text-gray-400 mb-2 font-medium">ROLES</div>
      <div className="space-y-1.5">
        {Object.entries(roleColors).map(([role, colors]) => (
          role !== "Default" && (
            <div key={role} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full border"
                style={{
                  background: colors.bg,
                  borderColor: colors.border,
                }}
              />
              <span className="text-xs text-gray-300">{role}</span>
            </div>
          )
        ))}
      </div>
    </div>

    <div className="hidden lg:block absolute top-2 left-4 z-10 bg-black/40 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/5">
      <div className="flex items-center gap-3 text-xs text-gray-500">
        <span>💡 Click node to expand</span>
        <span className="w-px h-3 bg-white/10" />
        <span>🖱️ Hover for details</span>
        <span className="w-px h-3 bg-white/10" />
        <span>🔄 Drag to reposition</span>
        <span className="w-px h-3 bg-white/10" />
        <span>⌘ + F to fit</span>
      </div>
    </div>

    {(isLoading || isStabilizing) && (
      <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
          <span className="text-gray-400 text-sm font-medium">
            {isStabilizing ? "Organizing network..." : "Expanding..."}
          </span>
        </div>
      </div>
    )}
  </div>;
}