import { type LucideIcon } from "lucide-react";

export type WorkspaceUser = {
  name: string;
  email: string;
  avatar: string;
}

export type Workspace = {
  name: string;
  logo: LucideIcon;
  plan: string;
}

export type NavSubItem = {
  title: string;
  url: string;
}

export type BaseNavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
}

export type LinkNavItem = BaseNavItem & {
  type: "link";
  items?: never;
}

export type CollapsibleNavItem = BaseNavItem & {
  type?: "collapsible";
  items: NavSubItem[];
}

export type NavItem = LinkNavItem | CollapsibleNavItem;

export type QuickAccessItem = {
  name: string;
  url: string;
  icon: LucideIcon;
}

export type WorkspaceSidebarData = {
  user: WorkspaceUser;
  workspaces: Workspace[];
  navMain: NavItem[];
  quickAccess: QuickAccessItem[];
}