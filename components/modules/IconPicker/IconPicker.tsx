"use client";

import { useMemo, useState } from "react";
import * as Iconsax from "iconsax-reactjs";
import type { IconVariant } from "@/types/form";

interface IconPickerProps {
  value: {
    name: string;
    variant: IconVariant;
  };
  onChange: (value: { name: string; variant: IconVariant }) => void;
}

const variants: IconVariant[] = [
  "Linear",
  "Outline",
  "TwoTone",
  "Bulk",
  "Broken",
  "Bold",
];

type IconComponent = React.ComponentType<{
  size?: number | string;
  color?: string;
  variant?: IconVariant;
}>;

const iconRegistry = Object.entries(Iconsax).reduce<
  Record<string, IconComponent>
>((acc, [name, icon]) => {
  if (
    typeof icon === "function" ||
    (typeof icon === "object" && icon !== null)
  ) {
    acc[name] = icon as IconComponent;
  }

  return acc;
}, {});

export default function IconPicker({ value, onChange }: IconPickerProps) {
  const [search, setSearch] = useState("");

  const icons = useMemo(() => {
    const query = search.trim().toLowerCase();

    return Object.keys(iconRegistry).filter((name) =>
      name.toLowerCase().includes(query),
    );
  }, [search]);

  return (
    <div className="space-y-4">
      <div className="flex gap-1 overflow-x-auto rounded-xl border border-border bg-background p-1">
        {variants.map((variant) => {
          const active = value.variant === variant;

          return (
            <button
              key={variant}
              type="button"
              onClick={() =>
                onChange({
                  ...value,
                  variant,
                })
              }
              className={`shrink-0 rounded-lg px-4 py-2 text-sm transition cursor-pointer ${
                active
                  ? "bg-primary text-background"
                  : "text-muted hover:bg-surface-hover hover:text-foreground"
              }`}
            >
              {variant}
            </button>
          );
        })}
      </div>

      <input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="جستجوی آیکون..."
        className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition focus:border-primary"
      />

      <div className="max-h-64 overflow-y-auto scrollbar-none">
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-8 md:grid-cols-10 bg-background border border-border rounded-xl p-2">
          {icons.map((name) => {
            const Icon = iconRegistry[name];

            const selected = value.name === name;

            return (
              <button
                key={name}
                type="button"
                title={name}
                onClick={() =>
                  onChange({
                    name,
                    variant: value.variant,
                  })
                }
                className={`flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border p-2 pt-3 transition text-primary cursor-pointer ${
                  selected
                    ? "border-primary bg-primary/10"
                    : "border-border bg-surface hover:border-border hover:bg-surface-hover"
                }`}
              >
                <Icon size={25} variant={value.variant} />

                <span className="w-full truncate text-center text-[10px] text-muted">
                  {name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {icons.length === 0 && (
        <p className="py-8 text-center text-sm text-muted-foreground">
          آیکونی پیدا نشد
        </p>
      )}
    </div>
  );
}
