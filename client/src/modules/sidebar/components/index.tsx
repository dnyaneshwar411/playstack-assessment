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

export default function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <Header />
      <SidebarContent>
        <NavMain items={appSidebarData.navMain} />
        {/* <NavProjects projects={appSidebarData.projects} /> */}
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
    <Image
      src={"file.svg"}
      alt=""
      height={400}
      width={400}
      className="w-auto h-6 object-contain"
    />
    {state === "expanded" && <>COMPANY</>}
  </SidebarHeader>
}