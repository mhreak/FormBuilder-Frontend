import ThemeToggle from "@/components/ui/buttons/ThemeToggle";
import { ArrowRight2, Share } from "iconsax-reactjs";
import Link from "next/link";

type BuilderHeaderProps = {
  onSave: () => void;
  showSave?: boolean;
};

export default function BuilderHeader({
  onSave,
  showSave = false,
}: BuilderHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface/90 backdrop-blur-xl">
      <div className="flex h-18 items-center justify-between px-5 sm:px-8">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="flex size-9 items-center justify-center rounded-xl border border-border bg-background text-sm transition-colors hover:bg-surface-hover"
          >
            <ArrowRight2 size={18} />
          </Link>

          <div className="hidden h-7 w-px bg-border sm:block" />

          {showSave && (
            <button
              type="button"
              onClick={onSave}
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary p-3 px-8 text-sm font-semibold text-white transition-all hover:bg-primary-hover active:scale-[0.98]"
            >
              <Share />
              انتشار فرم
            </button>
          )}
        </div>

        <ThemeToggle />
      </div>
    </header>
  );
}
