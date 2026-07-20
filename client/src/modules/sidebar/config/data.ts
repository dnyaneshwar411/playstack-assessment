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
  UserCircle,
  UserPlus,
  GitBranch,
  Shield,
} from "lucide-react";
import { WorkspaceSidebarData } from "./types.js";

export const appSidebarData: WorkspaceSidebarData = {
  user: {
    name: "Admin User",
    email: "admin@company.com",
    avatar: "/avatars/admin.jpg",
  },

  workspaces: [
    {
      name: "HR Management",
      logo: Users,
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
      title: "Organization",
      url: "/organization/chart",
      icon: GitBranch,
      type: "link"
    },

    {
      title: "My Profile",
      url: "/profile",
      icon: UserCircle,
      type: "link",
    },

    {
      title: "Employees",
      url: "/employees",
      icon: Users,
      isActive: true,
      items: [
        {
          title: "All Employees",
          url: "/employees",
        },
        {
          title: "Add Employee",
          url: "/employees/new",
        },
        {
          title: "Direct Reports",
          url: "/employees/direct-reports",
        },
      ],
    },
  ],

  quickAccess: [
    {
      name: "My Profile",
      url: "/profile",
      icon: UserCircle,
    },
    {
      name: "Add Employee",
      url: "/employees/new",
      icon: UserPlus,
    },
    {
      name: "Org Chart",
      url: "/organization/chart",
      icon: GitBranch,
    },
    {
      name: "Manage Roles",
      url: "/permissions/roles",
      icon: Shield,
    },
  ],
};