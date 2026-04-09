"use client"

import Link from "next/link"
import { LogOut, Settings, CreditCard, User as UserIcon } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { logoutAction } from "@/lib/actions"
import { useEffect, useState } from "react"

interface UserMenuProps {
  user?: {
    id?: string
    name?: string | null
    email?: string | null
    role?: string | null
  }
}

export function UserMenu({ user: initialUser }: UserMenuProps) {
  const [user, setUser] = useState(initialUser)

  useEffect(() => {
    if (!initialUser) {
      fetch("/api/user").then(res => {
        if (res.ok) res.json().then(setUser)
      })
    }
  }, [initialUser])

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : "U"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 hover:bg-primary/20 transition-all outline-none">
        <span className="text-xs font-medium text-primary">
          {initial}
        </span>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56 mt-2">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.name || "Loading..."}</p>
            <p className="text-xs leading-none text-muted-foreground truncate">
              {user?.email}
            </p>
            {user?.role && (
              <div className="mt-2 inline-flex">
                <span className="text-[10px] font-bold uppercase tracking-widest bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  {user.role}
                </span>
              </div>
            )}
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/settings" className="cursor-pointer flex items-center gap-2">
            <UserIcon className="h-4 w-4 text-muted-foreground" />
            <span>My Profile</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link href="/settings" className="cursor-pointer flex items-center gap-2">
            <Settings className="h-4 w-4 text-muted-foreground" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        
        {user?.role === "MANAGER" && (
          <DropdownMenuItem asChild>
            <Link href="/billing" className="cursor-pointer flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <span>Billing</span>
            </Link>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild>
          <form action={logoutAction} className="w-full">
            <button type="submit" className="w-full cursor-pointer flex items-center gap-2 text-destructive hover:text-destructive">
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
