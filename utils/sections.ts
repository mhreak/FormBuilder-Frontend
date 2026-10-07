import { FormData, FormSection } from "@/types/form";
import { createId } from "@/utils/createId";

export function findSection(
  form: FormData,
  sectionId: string,
): FormSection | undefined {
  for (const stage of form.stages) {
    const section = stage.sections.find((section) => section.id === sectionId);

    if (section) {
      return section;
    }
  }

  return undefined;
}

export function findSectionLocation(
  form: FormData,
  sectionId: string,
): {
  stageId: string;
  sectionId: string;
  index: number;
  section: FormSection;
} | null {
  for (const stage of form.stages) {
    const index = stage.sections.findIndex(
      (section) => section.id === sectionId,
    );

    if (index !== -1) {
      return {
        stageId: stage.id,
        sectionId,
        index,
        section: stage.sections[index],
      };
    }
  }

  return null;
}

export function addSection(form: FormData, stageId: string): FormData {
  return {
    ...form,
    stages: form.stages.map((stage) =>
      stage.id === stageId
        ? {
            ...stage,
            sections: [
              ...stage.sections,
              {
                id: createId("section"),
                title: `سکشن ${stage.sections.length + 1}`,
                description: "",
                items: [],
              },
            ],
          }
        : stage,
    ),
  };
}

export function deleteSection(
  form: FormData,
  stageId: string,
  sectionId: string,
): FormData {
  return {
    ...form,
    stages: form.stages.map((stage) =>
      stage.id === stageId
        ? {
            ...stage,
            sections: stage.sections.filter(
              (section) => section.id !== sectionId,
            ),
          }
        : stage,
    ),
  };
}

export function moveSection(
  form: FormData,
  activeId: string,
  targetStageId: string,
  targetIndex: number,
): FormData {
  const sourceLocation = findSectionLocation(form, activeId);

  if (!sourceLocation) {
    return form;
  }

  const movingSection = sourceLocation.section;

  return {
    ...form,
    stages: form.stages.map((stage) => {
      if (stage.id === sourceLocation.stageId && stage.id === targetStageId) {
        const sections = stage.sections.filter(
          (section) => section.id !== activeId,
        );

        let index = targetIndex;

        if (sourceLocation.index < targetIndex) {
          index -= 1;
        }

        index = Math.max(0, Math.min(index, sections.length));

        sections.splice(index, 0, movingSection);

        return {
          ...stage,
          sections,
        };
      }

      if (stage.id === sourceLocation.stageId) {
        return {
          ...stage,
          sections: stage.sections.filter((section) => section.id !== activeId),
        };
      }

      if (stage.id === targetStageId) {
        const sections = [...stage.sections];

        const index = Math.max(0, Math.min(targetIndex, sections.length));

        sections.splice(index, 0, movingSection);

        return {
          ...stage,
          sections,
        };
      }

      return stage;
    }),
  };
}

export function getSectionDropIndex(
  stageId: string,
  targetId: string,
  targetType: string | undefined,
  currentForm: FormData,
  pointerY?: number,
  targetTop?: number,
  targetHeight?: number,
) {
  const stage = currentForm.stages.find((stage) => stage.id === stageId);

  if (!stage) {
    return 0;
  }

  // Drop روی خود Stage → انتهای Sectionها
  if (targetType === "stage") {
    return stage.sections.length;
  }

  // Drop روی Section
  if (targetType === "section") {
    const targetIndex = stage.sections.findIndex(
      (section) => section.id === targetId,
    );

    if (targetIndex === -1) {
      return stage.sections.length;
    }

    // اگر مختصات در دسترس نیست، قبل از Section قرار بده
    if (
      pointerY === undefined ||
      targetTop === undefined ||
      targetHeight === undefined
    ) {
      return targetIndex;
    }

    const targetMiddle = targetTop + targetHeight / 2;

    // نیمه بالایی → قبل از Section
    if (pointerY < targetMiddle) {
      return targetIndex;
    }

    // نیمه پایینی → بعد از Section
    return targetIndex + 1;
  }

  return stage.sections.length;
}
