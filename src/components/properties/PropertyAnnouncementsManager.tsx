"use client"

import { useEffect, useState } from "react"
import { Megaphone, Plus, Search, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { GlassCard } from "@/components/ui/GlassCard"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface Announcement {
  id: string
  title: string
  body: string
  createdAt: string
  author: { name: string }
}

export function PropertyAnnouncementsManager({ propertyId }: { propertyId: string }) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)

  // Form state
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    async function fetchAnnouncements() {
      try {
        const res = await fetch(`/api/properties/${propertyId}/announcements`)
        if (res.ok) {
          const data = await res.json()
          setAnnouncements(data)
        }
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchAnnouncements()
  }, [propertyId])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/properties/${propertyId}/announcements`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body })
      })
      if (res.ok) {
        const newAnn = await res.json()
        setAnnouncements([newAnn, ...announcements])
        setTitle("")
        setBody("")
        setIsCreating(false)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold tracking-tight flex items-center gap-2">
          <Megaphone className="h-5 w-5 text-primary" /> Announcements
        </h3>
        <Button onClick={() => setIsCreating(!isCreating)} variant={isCreating ? "outline" : "default"}>
          {isCreating ? "Cancel" : <><Plus className="mr-2 h-4 w-4" /> New Announcement</>}
        </Button>
      </div>

      {isCreating && (
        <GlassCard className="p-6 border-none shadow-xl shadow-primary/5 animate-in fade-in slide-in-from-top-4">
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="e.g. Water Shutoff on Friday" 
                required 
              />
            </div>
            <div>
              <Label>Message</Label>
              <Textarea 
                value={body} 
                onChange={(e) => setBody(e.target.value)} 
                placeholder="Enter details..." 
                rows={4} 
                required 
              />
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Posting..." : "Post Announcement"}
            </Button>
          </form>
        </GlassCard>
      )}

      {isLoading ? (
        <div className="p-8 text-center text-muted-foreground">Loading announcements...</div>
      ) : announcements.length === 0 && !isCreating ? (
        <GlassCard className="p-12 text-center border-none shadow-xl flex flex-col items-center">
           <Megaphone className="h-10 w-10 text-muted-foreground mb-4 opacity-30" />
           <p className="font-semibold text-lg">No announcements deployed yet</p>
           <p className="text-muted-foreground text-sm mt-1">Keep your tenants informed by posting an announcement.</p>
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {announcements.map((ann) => (
            <GlassCard key={ann.id} className="p-6 border-none shadow-md">
              <h4 className="font-bold text-lg">{ann.title}</h4>
              <p className="text-muted-foreground mt-2 whitespace-pre-wrap">{ann.body}</p>
              <div className="flex justify-between items-center text-xs text-muted-foreground mt-4 pt-4 border-t">
                <span>Posted by {ann.author.name}</span>
                <span>{new Date(ann.createdAt).toLocaleString()}</span>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  )
}
