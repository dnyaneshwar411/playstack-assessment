"use client"
import * as React from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { NavMain } from "@/modules/sidebar/components/nav-main"
import { NavUser } from "@/modules/sidebar/components/nav-users"
import { appSidebarData } from "@/modules/sidebar/config/data"
import Image from "next/image"
import { buildSidebarItems } from "../utils"
import { useGlobalStore } from "@/providers/store-provider"

export default function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const scopeMap = useGlobalStore(state => state.scopeMap)
  const sidebarItems = buildSidebarItems(scopeMap);
  return (
    <Sidebar collapsible="icon" {...props}>
      <Header />
      <SidebarContent>
        <NavMain items={sidebarItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={appSidebarData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

function Header() {
  const { state } = useSidebar();
  return <SidebarHeader className="h-[var(--header-height)] flex items-center justify-center flex items-center justify-center flex-row gap-4 border-b-1">
    {/* <Image
      src={"file.svg"}
      alt=""
      height={400}
      width={400}
      className="w-auto h-6 object-contain"
    /> */}
    {state === "collapsed" && <div className="flex items-center gap-2">
      <span className="text-lg font-bold text-white uppercase">PS</span>
    </div>}
    {state === "expanded" && <div className="flex items-center gap-2">
      <span className="text-lg font-bold text-white uppercase">Play Stack</span>
    </div>}
  </SidebarHeader>
}