"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Building2, Wrench, Users, X, Loader2 } from "lucide-react"

interface SearchResult {
  id: string
  type: string
  title: string
  subtitle: string
  href: string
  icon: string
}

const ICON_MAP: Record<string, React.ElementType> = {
  Building2,
  Wrench,
  Users
}

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  useEffect(() => {
    if (!isOpen) {
      setQuery("")
      setResults([])
      setSelectedIndex(0)
    }
  }, [isOpen])

  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      return
    }

    const timer = setTimeout(async () => {
      setIsLoading(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        if (res.ok) {
          const data = await res.json()
          setResults(data)
          setSelectedIndex(0)
        }
      } catch (err) {
        console.error("Search failed", err)
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1))
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex(prev => Math.max(prev - 1, 0))
      } else if (e.key === "Enter" && results.length > 0) {
        e.preventDefault()
        const target = results[selectedIndex]
        if (target) {
          setIsOpen(false)
          router.push(target.href)
        }
      } else if (e.key === "Escape") {
        e.preventDefault()
        setIsOpen(false)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, selectedIndex, results, router])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm flex items-start justify-center pt-[20vh] p-4">
      <div 
        className="fixed inset-0"
        onClick={() => setIsOpen(false)}
      />
      <div className="relative w-full max-w-xl bg-card border border-border shadow-2xl rounded-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center px-4 border-b">
          <Search className="h-5 w-5 text-muted-foreground mr-3" />
          <input
            autoFocus
            className="flex-1 h-14 bg-transparent outline-none placeholder:text-muted-foreground"
            placeholder="Search properties, requests, vendors..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={() => setIsOpen(false)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {isLoading && query.length >= 2 && (
            <div className="p-8 flex justify-center text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          )}

          {!isLoading && query.length >= 2 && results.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              No results found for "{query}"
            </div>
          )}

          {!isLoading && results.length > 0 && (
            <div className="p-2 space-y-1">
              {results.map((item, i) => {
                const Icon = ICON_MAP[item.icon] || Search
                const isSelected = i === selectedIndex

                return (
                  <button
                    key={item.id}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left ${isSelected ? 'bg-primary/10 text-primary' : 'hover:bg-muted'}`}
                    onClick={() => {
                      setIsOpen(false)
                      router.push(item.href)
                    }}
                    onMouseEnter={() => setSelectedIndex(i)}
                  >
                    <div className={`h-10 w-10 shrink-0 rounded-lg flex items-center justify-center ${isSelected ? 'bg-primary/20' : 'bg-muted'}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium line-clamp-1 ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                        {item.title}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {item.subtitle}
                      </p>
                    </div>
                    <div className="text-[10px] font-medium tracking-wider uppercase text-muted-foreground">
                      {item.type}
                    </div>
                  </button>
                )
              })}
            </div>
          )}
          
          {query.length < 2 && (
            <div className="p-8 text-center text-sm text-muted-foreground">
              Type at least 2 characters to search...
            </div>
          )}
        </div>
        
        <div className="bg-muted/50 border-t px-4 py-3 text-xs text-muted-foreground flex items-center gap-4">
          <div className="flex items-center gap-1">
            <kbd className="bg-background border rounded px-1 min-w-[20px] text-center font-mono">↑</kbd>
            <kbd className="bg-background border rounded px-1 min-w-[20px] text-center font-mono">↓</kbd>
            <span>to navigate</span>
          </div>
          <div className="flex items-center gap-1">
            <kbd className="bg-background border rounded px-1 font-mono">↵</kbd>
            <span>to select</span>
          </div>
          <div className="flex items-center gap-1">
            <kbd className="bg-background border rounded px-1 font-mono">esc</kbd>
            <span>to close</span>
          </div>
        </div>
      </div>
    </div>
  )
}
