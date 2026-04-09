"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// Simple dropdown implementation without Radix — uses React state for open/close.

interface DropdownMenuContextValue {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const DropdownMenuContext = React.createContext<DropdownMenuContextValue>({
  open: false,
  setOpen: () => {},
})

interface DropdownMenuProps {
  children: React.ReactNode
  className?: string
}

function DropdownMenu({ children, className }: DropdownMenuProps) {
  const [open, setOpen] = React.useState(false)

  // Close when clicking outside
  const containerRef = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open])

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      <div ref={containerRef} className={cn("relative inline-block", className)}>
        {children}
      </div>
    </DropdownMenuContext.Provider>
  )
}

interface DropdownMenuTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

function DropdownMenuTrigger({
  className,
  children,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  asChild: _asChild,
  ...props
}: DropdownMenuTriggerProps) {
  const { setOpen } = React.useContext(DropdownMenuContext)
  return (
    <button
      type="button"
      className={cn("", className)}
      onClick={() => setOpen((prev) => !prev)}
      {...props}
    >
      {children}
    </button>
  )
}

interface DropdownMenuContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  align?: "start" | "end" | "center"
  sideOffset?: number
}

function DropdownMenuContent({
  className,
  children,
  align = "end",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  sideOffset: _sideOffset,
  ...props
}: DropdownMenuContentProps) {
  const { open } = React.useContext(DropdownMenuContext)

  if (!open) return null

  const alignClass =
    align === "start"
      ? "left-0"
      : align === "center"
        ? "left-1/2 -translate-x-1/2"
        : "right-0"

  return (
    <div
      className={cn(
        "absolute z-50 mt-1 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
        alignClass,
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

interface DropdownMenuItemProps
  extends React.HTMLAttributes<HTMLElement> {
  inset?: boolean
  asChild?: boolean
}

function DropdownMenuItem({
  className,
  inset,
  children,
  onClick,
  asChild,
  ...props
}: DropdownMenuItemProps) {
  const { setOpen } = React.useContext(DropdownMenuContext)

  const Comp = asChild ? "div" : "button"

  return (
    <Comp
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {...(asChild ? {} : { type: "button" } as any)}
      className={cn(
        "relative flex w-full cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50",
        inset && "pl-8",
        className
      )}
      onClick={(e) => {
        onClick?.(e)
        setOpen(false)
      }}
      {...props}
    >
      {children}
    </Comp>
  )
}

function DropdownMenuSeparator({ className }: { className?: string }) {
  return <div className={cn("-mx-1 my-1 h-px bg-muted", className)} />
}

function DropdownMenuLabel({
  className,
  inset,
  children,
}: {
  className?: string
  inset?: boolean
  children?: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "px-2 py-1.5 text-sm font-semibold",
        inset && "pl-8",
        className
      )}
    >
      {children}
    </div>
  )
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
}
