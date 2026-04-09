"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GlassCard } from "@/components/ui/GlassCard"
import { ArrowLeft, Mail, CheckCircle2, Loader2 } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    console.log("Simulated reset link sent to:", email)
    setIsSent(true)
    setIsLoading(false)
  }

  return (
    <div className="space-y-6 animate-page-in">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Reset password</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      {!isSent ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-3 w-3 text-muted-foreground" /> Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              required
              disabled={isLoading}
              className="h-11 rounded-xl bg-background/50 border-muted/20"
            />
          </div>
          <Button type="submit" size="lg" className="w-full shadow-primary/20" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing
              </>
            ) : (
              "Send Reset Link"
            )}
          </Button>
        </form>
      ) : (
        <GlassCard className="border-emerald-500/20 bg-emerald-500/5 p-6 text-center" hoverable={false}>
          <div className="flex flex-col items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <p className="font-bold text-emerald-900 dark:text-emerald-100">Email Sent</p>
              <p className="text-sm text-emerald-700/80 dark:text-emerald-400/80">
                Check your inbox at <span className="font-medium text-emerald-900 dark:text-emerald-100">{email}</span> for instructions.
              </p>
            </div>
          </div>
        </GlassCard>
      )}

      <div className="pt-2 text-center">
        <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground">
          <Link href="/login" className="inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Link>
        </Button>
      </div>
    </div>
  )
}
