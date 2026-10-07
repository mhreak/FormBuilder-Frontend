"use client";
import { Moon, Sun1 } from "iconsax-reactjs";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="flex size-10 cursor-pointer items-center justify-center rounded-full border border-border bg-surface transition-colors hover:bg-foreground/10"
    >
      {mounted &&
        (resolvedTheme === "dark" ? <Sun1 size={20} /> : <Moon size={20} />)}
    </button>
  );
}
