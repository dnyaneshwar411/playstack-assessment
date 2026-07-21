export const networkOptions = {
  layout: {
    randomSeed: 42,
    improvedLayout: true,
  },
  physics: {
    enabled: true,
    stabilization: {
      enabled: true,
      iterations: 1000,
      updateInterval: 50,
      fit: true,
    },
    solver: "forceAtlas2Based" as const,
    forceAtlas2Based: {
      theta: 0.5,
      gravitationalConstant: -50,
      centralGravity: 0.01,
      springConstant: 0.08,
      springLength: 200,
      damping: 0.4,
      avoidOverlap: 0.8,
    },
    barnesHut: {
      gravitationalConstant: -8000,
      centralGravity: 0.3,
      springLength: 200,
      springConstant: 0.04,
      damping: 0.09,
      avoidOverlap: 0.5,
    },
    maxVelocity: 50,
    minVelocity: 0.1,
    timestep: 0.5,
    adaptiveTimestep: true,
  },
  nodes: {
    shape: "dot",
    size: 40,
    margin: 10,
    font: {
      size: 14,
      color: "#ffffff",
      face: "Inter, -apple-system, sans-serif",
      strokeWidth: 2,
      strokeColor: "#000000",
      align: "center",
      multi: true,
    },
    borderWidth: 2,
    shadow: {
      enabled: true,
      color: "rgba(0,0,0,0.5)",
      size: 10,
      x: 0,
      y: 2,
    },
    scaling: {
      min: 20,
      max: 50,
      label: {
        enabled: true,
        min: 12,
        max: 18,
      },
    },
  },
  edges: {
    width: 3,
    color: {
      color: "#666666",
      highlight: "#00aeff",
      hover: "#888888",
      inherit: false,
    },
    arrows: {
      to: {
        enabled: true,
        scaleFactor: 0.8,
        type: "arrow" as const,
      },
    },
    smooth: {
      enabled: true,
      type: "dynamic" as const,
      roundness: 0.5,
    },
    font: {
      size: 10,
      color: "#999999",
      align: "middle" as const,
    },
    length: 250,
  },
  interaction: {
    hover: true,
    tooltipDelay: 200,
    navigationButtons: true,
    hideEdgesOnDrag: true,
    multiselect: false,
    zoomView: true,
    dragView: true,
    dragNodes: true,
  }
}

export const roleColors: Record<string, { bg: string; border: string; label: string }> = {
  "Human Resources": {
    bg: "#4CAF50",
    border: "#2E7D32",
    label: "HR"
  },
  "Super Admin": {
    bg: "#F44336",
    border: "#B71C1C",
    label: "Admin"
  },
  "Employee": {
    bg: "#2196F3",
    border: "#0D47A1",
    label: "Employee"
  },
  "Default": {
    bg: "#607D8B",
    border: "#37474F",
    label: "Staff"
  }
};