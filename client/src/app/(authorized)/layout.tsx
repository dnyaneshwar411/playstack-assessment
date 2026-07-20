"use client";
import { ErrorState } from "@/components/ui/error";
import { ComponentLoader } from "@/components/ui/loader";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import useFetch from "@/hooks/useFetch";
import { cn } from "@/lib/utils";
import AppNavbar from "@/modules/navbar/components";
import AppSidebar from "@/modules/sidebar/components";
import { GlobalStoreProvider } from "@/providers/store-provider";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isLoading, data, error, mutate } = useFetch("/api/v1/user/me")

  if (isLoading) return <div className="flex items-center justify-center h-screen">
    <ComponentLoader />
  </div>

  if (error || data?.code !== 200) {
    return (
      <div className="flex items-center justify-center h-screen">
        <ErrorState
          title={data?.message || "Dashboard Sync Error"}
          description="The database cluster returned an invalid schema or network failure."
          reset={() => mutate()}
        />
      </div>
    )
  }

  return <GlobalStoreProvider payload={data.data}>
    <SidebarProvider className="gap-0 max-w-screen">
      <AppSidebar />
      <AppContents>
        {children}
      </AppContents>
    </SidebarProvider>
  </GlobalStoreProvider>
}

function AppContents({ children }: { children: React.ReactNode }) {
  const { open, isMobile } = useSidebar()
  const sidebarWidth = isMobile ? "w-[calc(100vw-32px)]" : (open ? "w-[calc(100vw-290px)]" : "w-[calc(100vw-80px)]")
  return (
    <div className="grow">
      <AppNavbar />
      <div className={cn(`min-h-[calc(100vh-var(--header-height)-32px)] m-4 bg-sidebar/30 border`, sidebarWidth)}>
        {children}
      </div>
    </div>
  )
}