import { appSidebarData } from "../config/data";
import { LinkNavItem, WorkspaceSidebarData } from "../config/types";

export const buildSidebarItems = function (scopeMap: Record<string, boolean>): WorkspaceSidebarData["navMain"] {
  return appSidebarData.navMain
    .filter(item => {
      if (!item.scope) return true;
      const scopes = Array.isArray(item.scope) ? item.scope : [item.scope];
      return scopes.some(scope => scopeMap[scope] === true);
    })
    .map(item => {
      if (item.type === "collapsible" && item.items) {
        const filteredItems = item.items.filter(subItem => {
          if (!subItem.scope) return true;
          const scopes = Array.isArray(subItem.scope) ? subItem.scope : [subItem.scope];
          return scopes.some(scope => scopeMap[scope] === true);
        });

        if (filteredItems.length === 0) return null;

        return {
          ...item,
          items: filteredItems,
        };
      }

      return item;
    })
    .filter((item): item is LinkNavItem => item !== null);
};
