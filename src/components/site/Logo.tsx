import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg
        width="26"
        height="26"
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
        className="text-foreground"
      >
        <path d="M16 3 29 27H3L16 3Z" stroke="currentColor" strokeWidth="1.6" opacity="0.35" />
        <path d="M16 10.5 23.5 24h-15L16 10.5Z" fill="currentColor" />
      </svg>
      <span className="text-[15px] font-semibold tracking-tight text-foreground">Pal Inc</span>
    </span>
  );
}