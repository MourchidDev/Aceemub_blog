import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function PageHeader({
  eyebrow,
  title,
  description,
  children,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("mx-auto max-w-3xl px-5 pt-6 pb-8 text-center", className)}>
      {eyebrow && (
        <div className="inline-block rounded-full border border-border bg-card px-3 py-1 text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
          {eyebrow}
        </div>
      )}
      <h1 className="mt-4 font-serif text-4xl leading-[1.05] text-foreground sm:text-5xl md:text-6xl">
        {title}
      </h1>
      {description && (
        <p className="mt-4 text-base text-muted-foreground sm:text-lg">{description}</p>
      )}
      {children && <div className="mt-6 flex justify-center">{children}</div>}
    </header>
  );
}
