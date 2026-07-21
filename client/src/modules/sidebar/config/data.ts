import {
  LayoutDashboard,
  Users,
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
      type: "link",
    },
    {
      title: "My Profile",
      url: "/profile",
      icon: UserCircle,
      type: "link",
      scope: "user:read:own",
    },
    {
      title: "Employees",
      url: "/employees",
      icon: Users,
      type: "collapsible",
      isActive: true,
      scope: ["user:read:all", "user:create:all"],
      items: [
        {
          title: "All Employees",
          url: "/employees",
          scope: "user:read:all",
        },
        {
          title: "Add Employee",
          url: "/employees/new",
          scope: "user:create:all",
        },
        {
          title: "Direct Reports",
          url: "/employees/direct-reports",
          scope: "user:read:all",
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