import * as React from "react"
import { cn } from "@/lib/utils"

// Native HTML select wrapper — no Radix dependency.

export interface SelectProps {
  value?: string
  onValueChange?: (val: string) => void
  children?: React.ReactNode
  className?: string
  placeholder?: string
  disabled?: boolean
  name?: string
  id?: string
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      value,
      onValueChange,
      children,
      className,
      placeholder,
      disabled,
      name,
      id,
    },
    ref
  ) => {
    return (
      <select
        ref={ref}
        value={value}
        onChange={(e) => onValueChange?.(e.target.value)}
        disabled={disabled}
        name={name}
        id={id}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
      >
        {placeholder && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}
        {children}
      </select>
    )
  }
)
Select.displayName = "Select"

// Compatibility shims — not rendered, kept so import sites compile.

const SelectTrigger = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props}>
    {children}
  </div>
))
SelectTrigger.displayName = "SelectTrigger"

const SelectContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props}>
    {children}
  </div>
))
SelectContent.displayName = "SelectContent"

export interface SelectItemProps
  extends React.OptionHTMLAttributes<HTMLOptionElement> {
  value: string
}

const SelectItem = React.forwardRef<HTMLOptionElement, SelectItemProps>(
  ({ className, children, value, ...props }, ref) => (
    <option ref={ref} value={value} className={cn("", className)} {...props}>
      {children}
    </option>
  )
)
SelectItem.displayName = "SelectItem"

const SelectValue = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span ref={ref} className={cn("", className)} {...props} />
))
SelectValue.displayName = "SelectValue"

export { Select, SelectTrigger, SelectContent, SelectItem, SelectValue }
