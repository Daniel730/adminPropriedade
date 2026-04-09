"use client"

import { useEffect, useState, useRef } from "react"
import { Send, User as UserIcon, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { GlassCard } from "@/components/ui/GlassCard"
import { cn } from "@/lib/utils"

interface Comment {
  id: string
  body: string
  createdAt: string
  author: {
    id: string
    name: string
    role: string
  }
}

interface RequestCommentsProps {
  requestId: string
  currentUserId: string
}

export function RequestComments({ requestId, currentUserId }: RequestCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  
  const endOfMessagesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function fetchComments() {
      try {
        const res = await fetch(`/api/requests/${requestId}/comments`)
        if (res.ok) {
          const data = await res.json()
          setComments(data)
        }
      } catch (error) {
        console.error("Failed to fetch comments", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchComments()
    
    // Simple polling for now
    const interval = setInterval(fetchComments, 10000)
    return () => clearInterval(interval)
  }, [requestId])

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [comments])

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!newMessage.trim() || isSending) return

    setIsSending(true)
    try {
      const res = await fetch(`/api/requests/${requestId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: newMessage.trim() })
      })

      if (res.ok) {
        const newComment = await res.json()
        setComments(prev => [...prev, newComment])
        setNewMessage("")
      }
    } catch (error) {
      console.error("Failed to send comment", error)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <GlassCard className="flex flex-col h-[500px] border-none shadow-xl shadow-primary/5" hoverable={false}>
      <div className="p-4 border-b border-muted/50 flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-lg">Activity & Discussion</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/10">
        {isLoading ? (
          <div className="flex justify-center p-4">
            <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center text-muted-foreground p-8 flex flex-col items-center">
            <MessageSquare className="h-8 w-8 mb-2 opacity-20" />
            <p className="text-sm">No discussion yet</p>
            <p className="text-xs mt-1">Start the conversation with the assigned personnel.</p>
          </div>
        ) : (
          comments.map((comment) => {
            const isMe = comment.author.id === currentUserId
            
            return (
              <div 
                key={comment.id} 
                className={cn(
                  "flex flex-col max-w-[85%]",
                  isMe ? "ml-auto items-end" : "mr-auto items-start"
                )}
              >
                <div className="flex items-center gap-2 mb-1 px-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">{comment.author.name}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-muted/60 text-muted-foreground font-black tracking-widest uppercase">
                    {comment.author.role}
                  </span>
                </div>
                <div 
                  className={cn(
                    "px-4 py-2.5 rounded-2xl text-sm leading-relaxed",
                    isMe 
                      ? "bg-primary text-primary-foreground rounded-tr-sm" 
                      : "bg-card border border-border shadow-sm rounded-tl-sm"
                  )}
                >
                  {comment.body}
                </div>
                <span className="text-[9px] text-muted-foreground mt-1 px-1 font-medium">
                  {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            )
          })
        )}
        <div ref={endOfMessagesRef} />
      </div>

      <div className="p-4 border-t border-muted/50 bg-background/50 backdrop-blur-md">
        <form onSubmit={handleSend} className="flex gap-2">
          <Input 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="rounded-full bg-card"
            disabled={isSending}
          />
          <Button 
            type="submit" 
            size="icon" 
            className="rounded-full shrink-0"
            disabled={!newMessage.trim() || isSending}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </GlassCard>
  )
}
