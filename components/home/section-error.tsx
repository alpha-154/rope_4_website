import { AlertTriangle, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";

/** Inline error block for a homepage section whose API request failed. */
export function SectionError({
  title = "This section couldn't be loaded",
  onRetry,
  retrying,
  tone = "light",
  className,
}: {
  title?: string;
  onRetry?: () => void;
  retrying?: boolean;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col sm:flex-row items-center justify-center gap-3 rounded-2xl border px-6 py-8 text-center sm:text-left",
        tone === "dark"
          ? "border-white/15 bg-white/5 text-emerald-50"
          : "border-destructive/20 bg-destructive/5 text-foreground",
        className
      )}
    >
      <AlertTriangle className={cn("h-5 w-5 shrink-0", tone === "dark" ? "text-amber-300" : "text-destructive")} />
      <div className="text-sm">
        <p className="font-semibold">{title}</p>
        <p className={cn("text-xs", tone === "dark" ? "text-emerald-100/70" : "text-muted-foreground")}>
          Please check your connection and try again.
        </p>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          disabled={retrying}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-60",
            tone === "dark"
              ? "bg-white/10 hover:bg-white/20 text-white"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          )}
        >
          <RotateCw className={cn("h-3.5 w-3.5", retrying && "animate-spin")} />
          Retry
        </button>
      )}
    </div>
  );
}
