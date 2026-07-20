"use client"
import { Loader2, Terminal } from "lucide-react"

interface TableSkeletonProps {
  rows?: number
  columns?: number
}

interface FullLoaderProps {
  message?: string
  variant?: "default" | "full-page"
}

export function ComponentLoader({ message = "Fetching your data and preparing your workspace...", variant = "default" }: FullLoaderProps) {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 space-y-4 font-mono text-xs text-muted-foreground select-none">
      <div className="relative flex items-center justify-center w-9 h-9 border border-border bg-card/40 rounded">
        <Loader2 className="h-4 w-4 animate-spin text-foreground" />
      </div>
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-muted-foreground/80">
        <Terminal className="h-3 w-3 animate-pulse text-primary" /> {message}
      </div>
    </div>
  )

  if (variant === "full-page") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background dark">
        {content}
      </div>
    )
  }

  return <div className="w-full py-16 dark">{content}</div>
}