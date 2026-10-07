import type { FormData } from "@/types/form";
import { findSectionLocation } from "./sections";
import { findItemLocation } from "./elements";

export function getSectionIdFromTarget(
  form: FormData,
  targetId: string,
  targetType?: string,
): string | null {
  if (targetType === "section") {
    return targetId;
  }

  if (targetType === "item") {
    return findItemLocation(form, targetId)?.sectionId ?? null;
  }

  const sectionLocation = findSectionLocation(form, targetId);

  return sectionLocation?.section.id ?? null;
}

export function getStageIdFromTarget(
  form: FormData,
  targetId: string,
  targetType?: string,
): string | null {
  if (targetType === "stage") {
    return targetId;
  }

  if (targetType === "section") {
    return findSectionLocation(form, targetId)?.stageId ?? null;
  }

  if (targetType === "item") {
    return findItemLocation(form, targetId)?.stageId ?? null;
  }

  return null;
}

export function getItemInsertIndex(
  form: FormData,
  sectionId: string,
  targetId: string,
  targetType?: string,
): number {
  const section = form.stages
    .flatMap((stage) => stage.sections)
    .find((section) => section.id === sectionId);

  if (!section) {
    return 0;
  }

  if (targetType === "item") {
    const index = section.items.findIndex((item) => item.id === targetId);

    if (index !== -1) {
      return index;
    }
  }

  return section.items.length;
}
