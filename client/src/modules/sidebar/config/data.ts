import {
  Bot,
  LayoutDashboard,
  Users,
  ShieldCheck,
  Activity,
  Settings2,
  Cpu,
  KeyRound,
  ChartColumn,
  ScrollText,
  GalleryVerticalEnd,
  Sparkle,
} from "lucide-react";
import { WorkspaceSidebarData } from "./types.js";

export const appSidebarData: WorkspaceSidebarData = {
  user: {
    name: "John Doe",
    email: "john@acme.com",
    avatar: "/avatars/john.jpg",
  },

  workspaces: [
    {
      name: "Acme Inc.",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
  ],

  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      type: "link",
    },

    {
      title: "Providers",
      url: "/providers",
      icon: Sparkle,
      type: "link",
    },

    {
      title: "Applications",
      url: "/applications",
      icon: Bot,
      isActive: true,
      items: [
        {
          title: "All Applications",
          url: "/applications",
        },
        {
          title: "Create Application",
          url: "/applications/new",
        },
      ],
    },

    {
      title: "Executions",
      url: "/executions",
      icon: Activity,
      items: [
        {
          title: "Execution History",
          url: "/executions",
        },
        {
          title: "Running Jobs",
          url: "/executions/running",
        },
      ],
    },

    {
      title: "Workspace",
      url: "/workspace",
      icon: Users,
      items: [
        {
          title: "Members",
          url: "/workspace/members",
        },
        {
          title: "Permissions",
          url: "/workspace/permissions",
        },
      ],
    },

    {
      title: "Monitoring",
      url: "/monitoring",
      icon: ChartColumn,
      items: [
        {
          title: "Usage",
          url: "/monitoring/usage",
        },
        {
          title: "Analytics",
          url: "/monitoring/analytics",
        },
        {
          title: "Audit Logs",
          url: "/monitoring/audit",
        },
      ],
    },

    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "/settings/general",
        },
        {
          title: "AI Providers",
          url: "/settings/providers",
        },
        {
          title: "API Keys",
          url: "/settings/api-keys",
        },
        {
          title: "Workspace",
          url: "/settings/workspace",
        },
      ],
    },
  ],

  quickAccess: [
    {
      name: "AI Providers",
      url: "/settings/providers",
      icon: Cpu,
    },
    {
      name: "API Keys",
      url: "/settings/api-keys",
      icon: KeyRound,
    },
    {
      name: "Audit Logs",
      url: "/monitoring/audit",
      icon: ScrollText,
    },
    {
      name: "Permissions",
      url: "/workspace/permissions",
      icon: ShieldCheck,
    },
  ],
};