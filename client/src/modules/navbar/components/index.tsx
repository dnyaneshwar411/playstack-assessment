"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User } from "lucide-react";
import { useGlobalStore } from "@/providers/store-provider";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { buildToastMessage } from "@/lib/catchAsync";

export default function AppNavbar() {
  const user = useGlobalStore(state => state)
  const router = useRouter()

  const handleLogout = async function () {
    try {
      const response = await fetch("/api/logout", { method: "DELETE" })
      const data = await response.json()
      if (data.code !== 200) throw new Error(data.message);
      if (typeof history) history.replaceState({}, "", "/login")
      window.location.href = "/login"
    } catch (error) {
      toast.error(buildToastMessage(error))
    }
  }

  const getInitials = (name: string) => {
    return name
      ?.split(" ")
      ?.map((word) => word[0])
      ?.join("")
      ?.toUpperCase()
      ?.slice(0, 2);
  };

  return (
    <nav className="h-[var(--header-height)] bg-sidebar border-b border-white/10 flex items-center justify-between px-6 sticky top-0 z-50 backdrop-blur-sm">
      <div className="ml-auto flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <button className="flex items-center gap-3 hover:bg-white/5 rounded-lg px-3 py-2 transition-colors">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-blue-500 text-white text-sm font-medium">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-medium text-white">{user.name}</p>
                <p className="text-xs text-gray-400">{user.email}</p>
              </div>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/profile")}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-red-500 focus:text-red-500"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}