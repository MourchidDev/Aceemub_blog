import { cn } from "@/lib/utils";

type Tab = { id: string; label: string; count?: number };

type Props = {
  tabs: Tab[];
  value: string;
  onChange: (id: string) => void;
};

export default function CategoryTabs({ tabs, value, onChange }: Props) {
  return (
    <div className="-mx-5 overflow-x-auto no-scrollbar">
      <div className="flex gap-2 px-5 pb-1">
        {tabs.map((t) => {
          const active = t.id === value;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onChange(t.id)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap transition-all",
                active
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              {t.label}
              {typeof t.count === "number" && (
                <span className={cn("ml-1.5 text-[11px]", active ? "text-background/70" : "text-muted-foreground/70")}>
                  {t.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
