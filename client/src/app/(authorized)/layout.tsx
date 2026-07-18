import { SidebarProvider } from "@/components/ui/sidebar";
import AppNavbar from "@/modules/navbar/components";
import AppSidebar from "@/modules/sidebar/components";
import { GlobalStoreProvider } from "@/providers/store-provider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <GlobalStoreProvider payload={{}}>
    <SidebarProvider className="gap-0 max-w-screen">
      <AppSidebar />
      <div className="grow">
        <AppNavbar />
        <div className="min-h-[calc(100vh-var(--header-height)-32px)] m-4 p-4 bg-sidebar/30 border">
          {children}
        </div>
      </div>
    </SidebarProvider>
  </GlobalStoreProvider>
}