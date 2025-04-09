import { SDKProvider } from "@deco/sdk";
import { SidebarInset, SidebarProvider } from "@deco/ui/components/sidebar.tsx";
import { Outlet, useParams } from "react-router";
import { useUser } from "../hooks/data/useUser.ts";
import { AppSidebar } from "./sidebar/index.tsx";
import { Topbar } from "./topbar/index.tsx";

export function Layout() {
  const { teamSlug } = useParams();
  const user = useUser();

  const rootContext = teamSlug ? `shared/${teamSlug}` : `users/${user?.id}`;

  return (
    <SidebarProvider
      className="h-full"
      style={{
        "--sidebar-width": "14rem",
        "--sidebar-width-mobile": "14rem",
      } as Record<string, string>}
    >
      <SDKProvider context={rootContext}>
        <AppSidebar />
        <SidebarInset className="px-4 py-2 h-full grid grid-rows-[auto_1fr] gap-4">
          <Topbar />
          <Outlet />
        </SidebarInset>
      </SDKProvider>
    </SidebarProvider>
  );
}
