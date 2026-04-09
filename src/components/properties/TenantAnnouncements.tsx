"use client"

import { useEffect, useState } from "react"
import { Bell, Megaphone } from "lucide-react"

interface Announcement {
  id: string
  title: string
  body: string
  createdAt: string
  author: { name: string }
}

export function TenantAnnouncements({ propertyId }: { propertyId: string }) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [isLoading, setIsLoading] = useState(true)

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

  if (isLoading || announcements.length === 0) return null

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 mb-8 shadow-sm">
      <div className="flex items-center gap-2 mb-4 text-primary">
        <Megaphone className="h-5 w-5" />
        <h2 className="font-bold tracking-tight">Important Property Notices</h2>
      </div>
      <div className="space-y-4">
        {announcements.map(ann => (
          <div key={ann.id} className="bg-background rounded-lg p-4 border shadow-sm">
            <h3 className="font-semibold text-lg">{ann.title}</h3>
            <p className="text-muted-foreground mt-1 whitespace-pre-wrap">{ann.body}</p>
            <div className="text-xs text-muted-foreground mt-3 flex items-center justify-between">
              <span>Posted by {ann.author.name}</span>
              <span>{new Date(ann.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
