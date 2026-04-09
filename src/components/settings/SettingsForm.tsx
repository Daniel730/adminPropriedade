"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GlassCard } from "@/components/ui/GlassCard"
import { User, Lock, Mail, Save, AlertCircle, CheckCircle2 } from "lucide-react"

interface SettingsFormProps {
  user: {
    id: string
    name: string
    email: string
    role: string
  }
}

export function SettingsForm({ user }: SettingsFormProps) {
  const [name, setName] = useState(user.name)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    if (newPassword && newPassword !== confirmPassword) {
      setError("New passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          currentPassword: currentPassword || undefined,
          newPassword: newPassword || undefined
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to update settings")
      }

      setSuccess("Settings updated successfully")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your profile and security preferences.</p>
      </div>

      <GlassCard className="p-8 border-none shadow-xl shadow-primary/5">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {error && (
            <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive flex items-center gap-3">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-4 rounded-xl bg-success/10 border border-success/20 text-success flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 shrink-0" />
              <p className="text-sm font-medium">{success}</p>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold flex items-center gap-2 border-b pb-2 mb-4">
                <User className="h-5 w-5 text-primary" />
                Profile Information
              </h2>
              
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="John Doe"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Input 
                      id="email" 
                      type="email" 
                      value={user.email} 
                      disabled 
                      className="bg-muted pl-10"
                    />
                    <Mail className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                  </div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Cannot be changed</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <h2 className="text-lg font-semibold flex items-center gap-2 border-b pb-2 mb-4">
                <Lock className="h-5 w-5 text-primary" />
                Change Password
              </h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input 
                    id="currentPassword" 
                    type="password" 
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input 
                      id="newPassword" 
                      type="password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input 
                      id="confirmPassword" 
                      type="password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" disabled={isLoading} className="gap-2">
              <Save className="h-4 w-4" />
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </GlassCard>
    </div>
  )
}
