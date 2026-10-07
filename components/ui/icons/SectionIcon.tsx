"use client";
import * as Iconsax from "iconsax-reactjs";
import type { IconVariant } from "@/types/form";

interface SectionIconProps {
  name?: string;
  variant?: IconVariant;
  size?: number;
}

export default function SectionIcon({
  name = "ElementPlus",
  variant = "Linear",
  size = 20,
}: SectionIconProps) {
  const Icon = Iconsax[name as keyof typeof Iconsax] as
    | React.ComponentType<{
        size?: number | string;
        variant?: IconVariant;
      }>
    | undefined;

  if (!Icon) {
    return null;
  }

  return <Icon size={size} variant={variant} />;
}
