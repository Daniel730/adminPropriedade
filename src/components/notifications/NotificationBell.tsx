"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Bell, Inbox, Sparkles, ChevronRight } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"

interface Notification {
  id: string
  message: string
  read: boolean
  createdAt: string
  requestId?: string
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  async function fetchNotifications() {
    try {
      const res = await fetch("/api/notifications?limit=5")
      if (res.ok) {
        const data = await res.json()
        setNotifications(data.data)
        setUnreadCount(data.unreadCount)
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error)
    }
  }

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 60000)
    return () => clearInterval(interval)
  }, [])

  async function markAsRead(id: string) {
    try {
      const res = await fetch(`/api/notifications/${id}/read`, {
        method: "PATCH",
      })
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        )
        setUnreadCount((prev) => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative p-2.5 rounded-full hover:bg-primary/10 transition-all outline-none group">
        <Bell className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
        {unreadCount > 0 && (
          <Badge className="absolute top-1.5 right-1.5 h-4 w-4 flex items-center justify-center p-0 bg-secondary text-secondary-foreground border-2 border-background animate-pulse shadow-sm">
            <span className="text-[10px] font-black">{unreadCount}</span>
          </Badge>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0 border-none shadow-2xl shadow-primary/10 rounded-2xl overflow-hidden bg-card/95 backdrop-blur-xl mt-2 animate-in fade-in slide-in-from-top-2 duration-300">
        <DropdownMenuLabel className="p-5 border-b bg-primary/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="font-black uppercase tracking-widest text-[10px]">Recent Alerts</span>
          </div>
          {unreadCount > 0 && (
            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              {unreadCount} New
            </span>
          )}
        </DropdownMenuLabel>
        
        <div className="max-h-[380px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-10 text-center flex flex-col items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground/50">
                <Inbox className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold tracking-tight">All caught up!</p>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">No new notifications</p>
              </div>
            </div>
          ) : (
            notifications.map((n) => (
              <DropdownMenuItem
                key={n.id}
                className={cn(
                  "p-4 flex flex-col items-start gap-1 cursor-pointer transition-colors border-b last:border-0 focus:bg-primary/5",
                  !n.read ? "bg-primary/5" : "opacity-80 hover:opacity-100"
                )}
                onClick={() => markAsRead(n.id)}
              >
                <div className="flex items-start justify-between w-full gap-2">
                  <p className={cn(
                    "text-sm leading-tight transition-colors",
                    !n.read ? "font-bold text-foreground" : "font-medium text-muted-foreground"
                  )}>
                    {n.message}
                  </p>
                  {!n.read && <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />}
                </div>
                
                <div className="flex items-center justify-between w-full mt-2">
                  <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-tighter">
                    {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                  </span>
                  {n.requestId && (
                    <Link
                      href={`/requests/${n.requestId}`}
                      className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-0.5 hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Details <ChevronRight className="h-2.5 w-2.5" />
                    </Link>
                  )}
                </div>
              </DropdownMenuItem>
            ))
          )}
        </div>
        
        <div className="p-3 border-t bg-muted/30 text-center">
          <Link
            href="/notifications"
            className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
          >
            Review all history <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
