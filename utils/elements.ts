import type { FormData, FormItem } from "@/types/form";
import { arrayMove } from "@dnd-kit/sortable";

export function findItemLocation(
  form: FormData,
  itemId: string,
): {
  stageId: string;
  sectionId: string;
  index: number;
  item: FormItem;
} | null {
  for (const stage of form.stages) {
    for (const section of stage.sections) {
      const index = section.items.findIndex((item) => item.id === itemId);

      if (index !== -1) {
        return {
          stageId: stage.id,
          sectionId: section.id,
          index,
          item: section.items[index],
        };
      }
    }
  }

  return null;
}

export function addItem(
  form: FormData,
  sectionId: string,
  item: FormItem,
  index?: number,
): FormData {
  return {
    ...form,

    stages: form.stages.map((stage) => ({
      ...stage,

      sections: stage.sections.map((section) => {
        if (section.id !== sectionId) {
          return section;
        }

        const items = [...section.items];

        if (index === undefined || index < 0 || index > items.length) {
          items.push(item);
        } else {
          items.splice(index, 0, item);
        }

        return {
          ...section,
          items,
        };
      }),
    })),
  };
}

export function deleteItem(form: FormData, itemId: string): FormData {
  return {
    ...form,

    stages: form.stages.map((stage) => ({
      ...stage,

      sections: stage.sections.map((section) => ({
        ...section,

        items: section.items.filter((item) => item.id !== itemId),
      })),
    })),
  };
}

export function updateItem(
  form: FormData,
  itemId: string,
  changes: Partial<FormItem>,
): FormData {
  return {
    ...form,

    stages: form.stages.map((stage) => ({
      ...stage,

      sections: stage.sections.map((section) => ({
        ...section,

        items: section.items.map((item) =>
          item.id === itemId
            ? {
                ...item,
                ...changes,
              }
            : item,
        ),
      })),
    })),
  };
}

export function moveItem(
  form: FormData,
  sectionId: string,
  activeId: string,
  overId: string,
): FormData {
  return {
    ...form,

    stages: form.stages.map((stage) => ({
      ...stage,

      sections: stage.sections.map((section) => {
        if (section.id !== sectionId) {
          return section;
        }

        const oldIndex = section.items.findIndex(
          (item) => item.id === activeId,
        );

        const newIndex = section.items.findIndex((item) => item.id === overId);

        if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
          return section;
        }

        return {
          ...section,
          items: arrayMove(section.items, oldIndex, newIndex),
        };
      }),
    })),
  };
}
