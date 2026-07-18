"use client"

import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import type { NavItem } from "../config/types.js"

interface NavMainProps {
  items: NavItem[]
}

export function NavMain({ items }: NavMainProps) {
  const pathname = usePathname()

  return (
    <SidebarGroup className="py-2">
      <SidebarGroupLabel className="text-[10px] font-semibold tracking-wider text-sidebar-foreground/40 uppercase mb-2 px-2">
        Core System
      </SidebarGroupLabel>
      <SidebarMenu className="gap-0.5">
        {items.map((item) => {
          const isChildActive = item.items?.some(
            (subItem) => pathname === subItem.url || pathname?.startsWith(subItem.url + "/")
          )

          if (item.type === "link" || !item.items || item.items.length === 0) {
            const isActive = pathname === item.url || pathname?.startsWith(item.url + "/")

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  className={cn(
                    "w-full relative h-9 px-3 font-medium transition-colors rounded-md text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50",
                    isActive && "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                  )}
                >
                  <Link href={item.url || "#"} className="flex items-center gap-2">
                    {item.icon && <item.icon className="h-4 w-4 shrink-0" />}
                    <span className="text-sm">{item.title}</span>
                    {isActive && (
                      <span className="absolute left-0 top-1/4 h-1/2 w-[3px] bg-primary rounded-r" />
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          }

          const defaultOpen = item.isActive || isChildActive

          return (
            <Collapsible
              key={item.title}
              defaultOpen={defaultOpen}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger className="w-full">
                  <SidebarMenuButton
                    tooltip={item.title}
                    className={cn(
                      "h-9 px-3 w-full font-medium transition-colors rounded-md text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50",
                      isChildActive && "text-sidebar-foreground font-semibold"
                    )}
                  >
                    {item.icon && <item.icon className="h-4 w-4 shrink-0" />}
                    <span className="text-sm">{item.title}</span>
                    <ChevronRight className="ml-auto h-4 w-4 shrink-0 text-sidebar-foreground/30 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                
                <CollapsibleContent className="data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                  {/* Clean nested items aligned to shadcn defaults without heavy custom track borders */}
                  <SidebarMenuSub className="mx-0 my-0.5 pl-9 pr-0 border-none space-y-0.5">
                    {item.items.map((subItem: { title: string; url: string }) => {
                      const isSubActive = pathname === subItem.url || pathname?.startsWith(subItem.url + "/")

                      return (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            className={cn(
                              "h-8 px-2 transition-colors rounded-md text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/40",
                              isSubActive && "bg-sidebar-accent/70 text-sidebar-accent-foreground font-medium"
                            )}
                          >
                            <Link href={subItem.url || "#"}>
                              <span className="text-sm">{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      )
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}