"use client"
import { AlertTriangle, RefreshCw, ArrowLeft, Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface ErrorStateProps {
  error?: Error & { digest?: string }
  reset?: () => void
  title?: string
  description?: string
  variant?: "default" | "card" | "full-page"
}

export function ErrorState({
  error,
  reset,
  title = "System Execution Error",
  description = "An unhandled exception occurred while processing core pipeline operations.",
  variant = "default",
}: ErrorStateProps) {
  
  const handleGoBack = () => {
    if (typeof window !== "undefined") {
      window.history.back()
    }
  }

  const content = (
    <div className="flex flex-col items-center justify-center text-center p-6 space-y-6 max-w-md mx-auto dark">
      <div className="relative flex items-center justify-center w-12 h-12 rounded border border-destructive/30 bg-destructive/10 text-destructive animate-pulse">
        <AlertTriangle className="h-5 w-5" />
        <div className="absolute inset-0 border border-destructive/20 rounded scale-110 pointer-events-none" />
      </div>

      <div className="space-y-1.5">
        <h2 className="text-md font-bold tracking-tight font-mono uppercase text-foreground">
          {title}
        </h2>
        <p className="text-xs text-muted-foreground font-mono max-w-xs mx-auto leading-relaxed">
          {error?.message || description}
        </p>
      </div>

      {(error?.digest || error?.stack) && (
        <div className="w-full text-left bg-muted/40 border border-border p-3 rounded font-mono text-[10px] text-muted-foreground/80 overflow-x-auto max-h-[120px] shadow-inner">
          <div className="flex items-center gap-1.5 border-b border-border/50 pb-1.5 mb-1.5 text-foreground/60 font-semibold uppercase tracking-wider">
            <Terminal className="h-3 w-3 text-destructive" /> core_exception_log
          </div>
          {error?.digest && <div className="text-destructive font-medium">Digest: {error.digest}</div>}
          {error?.stack && <span className="whitespace-pre-wrap">{error.stack.split("\n")[0]}</span>}
        </div>
      )}

      <div className="flex items-center justify-center gap-3 w-full">
        <Button
          variant="outline"
          size="sm"
          onClick={handleGoBack}
          className="h-8 font-mono text-xs tracking-wider uppercase border-border rounded"
        >
          <ArrowLeft className="mr-2 h-3.5 w-3.5" /> Back
        </Button>

        {reset && (
          <Button
            variant="default"
            size="sm"
            onClick={() => reset()}
            className="h-8 font-mono text-xs tracking-wider uppercase bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded shadow-sm"
          >
            <RefreshCw className="mr-2 h-3.5 w-3.5" /> Retry Sync
          </Button>
        )}
      </div>
    </div>
  )

  if (variant === "card") {
    return (
      <Card className="border-destructive/20 bg-card/40 backdrop-blur-sm rounded overflow-hidden">
        <CardContent className="pt-6">{content}</CardContent>
      </Card>
    )
  }

  if (variant === "full-page") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background p-4">
        {content}
      </div>
    )
  }

  return <div className="w-full py-12">{content}</div>
}