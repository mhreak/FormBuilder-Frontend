import { FormData } from "@/types/form";
import { findSectionLocation } from "./sections";
import { findItemLocation } from "./elements";
import { arrayMove } from "@dnd-kit/sortable";
import { createId } from "@/utils/createId";

export function findStageById(form: FormData, stageId: string) {
  return form.stages.find((stage) => stage.id === stageId);
}

export function findStageIdFromTarget(
  form: FormData,
  targetId: string,
  targetType?: string,
): string | null {
  if (targetType === "stage") {
    return form.stages.some((stage) => stage.id === targetId) ? targetId : null;
  }

  if (targetType === "section") {
    return findSectionLocation(form, targetId)?.stageId ?? null;
  }

  if (targetType === "item") {
    return findItemLocation(form, targetId)?.stageId ?? null;
  }

  return null;
}

export function addStage(form: FormData): FormData {
  return {
    ...form,
    stages: [
      ...form.stages,
      {
        id: createId("stage"),
        title: `مرحله ${form.stages.length + 1}`,
        description: "",
        sections: [
          {
            id: createId("section"),
            title: "سکشن جدید",
            description: "",
            items: [],
          },
        ],
      },
    ],
  };
}

export function deleteStage(form: FormData, stageId: string): FormData {
  return {
    ...form,
    stages: form.stages.filter((stage) => stage.id !== stageId),
  };
}

export function moveStage(
  form: FormData,
  activeId: string,
  overId: string,
): FormData {
  const oldIndex = form.stages.findIndex((stage) => stage.id === activeId);

  const newIndex = form.stages.findIndex((stage) => stage.id === overId);

  if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
    return form;
  }

  return {
    ...form,
    stages: arrayMove(form.stages, oldIndex, newIndex),
  };
}
