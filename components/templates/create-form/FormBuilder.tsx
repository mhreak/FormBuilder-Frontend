"use client";

import {
  closestCenter,
  CollisionDetection,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import { useEffect, useState, useSyncExternalStore } from "react";

import BuilderHeader from "./BuilderHeader";
import ElementsPanel from "./ElementsPanel";
import FormCanvas from "./FormCanvas";
import FieldModal from "./FieldModal";
import SectionModal from "./SectionModal";

import type {
  FormData,
  FormItem,
  FormItemType,
  FormSection,
} from "@/types/form";

import { createDefaultItem, getDefaultItemTitle } from "@/utils/defaults";

import {
  addStage as addStageToForm,
  deleteStage as deleteStageFromForm,
  moveStage as moveStageInForm,
} from "@/utils/stages";

import {
  findSectionLocation,
  deleteSection as deleteSectionFromForm,
  moveSection as moveSectionInForm,
} from "@/utils/sections";

import {
  findItemLocation,
  addItem as addItemToForm,
  deleteItem as deleteItemFromForm,
  moveItem as moveItemInForm,
  updateItem as updateItemInForm,
} from "@/utils/elements";

import {
  getItemInsertIndex,
  getSectionIdFromTarget,
  getStageIdFromTarget,
} from "@/utils/dnd";

import type { FormSectionFormData } from "@/utils/validation/form-section";
import { createId } from "@/utils/createId";

const emptySubscribe = () => () => {};

const initialForm: FormData = {
  id: "form-1",
  title: "فرم ثبت‌نام دوره آموزشی",

  description: "اطلاعات خود را برای ثبت‌نام در دوره وارد کنید.",

  stages: [
    {
      id: "stage-1",
      title: "اطلاعات شخصی",
      description: "اطلاعات اولیه شرکت‌کننده را وارد کنید.",

      sections: [
        {
          id: "section-1",
          title: "اطلاعات تماس",
          description: "راه‌های ارتباطی شما",

          items: [
            {
              id: "item-1",
              type: "text",
              title: "نام و نام خانوادگی",
              description: "نام کامل خود را وارد کنید",
              required: true,
            },
            {
              id: "item-2",
              type: "email",
              title: "ایمیل",
              description: "example@email.com",
              required: true,
            },
            {
              id: "item-3",
              type: "phone",
              title: "شماره تلفن",
              description: "شماره تماس خود را وارد کنید",
              required: false,
            },
          ],
        },
      ],
    },
  ],
};

const collisionDetectionStrategy: CollisionDetection = (args) => {
  const activeType = args.active.data.current?.type;

  if (activeType === "section") {
    const sectionCollisions = args.droppableContainers.filter((container) => {
      const type = container.data.current?.type;

      return type === "section" || type === "stage";
    });

    return closestCenter({
      ...args,
      droppableContainers: sectionCollisions,
    });
  }

  return closestCenter(args);
};

interface FormBuilderProps {
  mode: "create" | "edit";
  formId?: string;
}

export default function FormBuilder({ mode, formId }: FormBuilderProps) {
  const [form, setForm] = useState<FormData | null>(
    mode === "create" ? structuredClone(initialForm) : null,
  );

  const [originalForm, setOriginalForm] = useState<FormData | null>(
    mode === "create" ? structuredClone(initialForm) : null,
  );

  const [fieldModal, setFieldModal] = useState<{
    open: boolean;
    mode: "create" | "edit";
    item: FormItem | null;
    target?: {
      sectionId: string;
      index: number;
    };
  }>({
    open: false,
    mode: "edit",
    item: null,
  });

  const [sectionModal, setSectionModal] = useState<{
    open: boolean;
    mode: "create" | "edit";
    stageId: string | null;
    section: FormSection | null;
  }>({
    open: false,
    mode: "create",
    stageId: null,
    section: null,
  });

  const [loading, setLoading] = useState(mode === "edit");

  const [activePaletteType, setActivePaletteType] =
    useState<FormItemType | null>(null);

  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
  );

  useEffect(() => {
    if (mode !== "edit" || !formId) {
      return;
    }

    const controller = new AbortController();

    async function fetchForm() {
      try {
        setLoading(true);

        const response = await fetch(`/api/forms/${formId}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("خطا در دریافت فرم");
        }

        const data: FormData = await response.json();

        setForm(data);
        setOriginalForm(structuredClone(data));
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        console.error(error);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchForm();

    return () => {
      controller.abort();
    };
  }, [mode, formId]);

  const isDirty =
    form !== null &&
    originalForm !== null &&
    JSON.stringify(form) !== JSON.stringify(originalForm);

  function updateForm(changes: Partial<FormData>) {
    setForm((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        ...changes,
      };
    });
  }

  function addStage() {
    setForm((current) => {
      if (!current) {
        return current;
      }

      return addStageToForm(current);
    });
  }

  function deleteStage(stageId: string) {
    setForm((current) => {
      if (!current) {
        return current;
      }

      return deleteStageFromForm(current, stageId);
    });
  }

  function addSection(stageId: string) {
    setSectionModal({
      open: true,
      mode: "create",
      stageId,
      section: {
        id: createId("section"),
        title: "",
        description: "",
        icon: {
          name: "ElementPlus",
          variant: "Linear",
        },
        items: [],
      },
    });
  }

  function openSectionEdit(section: FormSection) {
    setSectionModal({
      open: true,
      mode: "edit",
      stageId: null,
      section: structuredClone(section),
    });
  }

  function closeSectionModal() {
    setSectionModal({
      open: false,
      mode: "create",
      stageId: null,
      section: null,
    });
  }

  function handleSectionSave(data: FormSectionFormData) {
    setForm((current) => {
      if (!current) {
        return current;
      }

      if (sectionModal.mode === "edit") {
        if (!sectionModal.section) {
          return current;
        }

        return {
          ...current,

          stages: current.stages.map((stage) => ({
            ...stage,

            sections: stage.sections.map((section) =>
              section.id === sectionModal.section?.id
                ? {
                    ...section,
                    title: data.title,
                    description: data.description,
                    icon: data.icon,
                  }
                : section,
            ),
          })),
        };
      }

      if (!sectionModal.stageId) {
        return current;
      }

      const newSection: FormSection = {
        id: sectionModal.section?.id ?? createId("section"),
        title: data.title,
        description: data.description,
        icon: data.icon,
        items: [],
      };

      return {
        ...current,

        stages: current.stages.map((stage) => {
          if (stage.id !== sectionModal.stageId) {
            return stage;
          }

          return {
            ...stage,
            sections: [...stage.sections, newSection],
          };
        }),
      };
    });

    closeSectionModal();
  }

  function deleteSection(stageId: string, sectionId: string) {
    setForm((current) => {
      if (!current) {
        return current;
      }

      return deleteSectionFromForm(current, stageId, sectionId);
    });
  }

  function openEditItem(item: FormItem) {
    setFieldModal({
      open: true,
      mode: "edit",
      item: structuredClone(item),
    });
  }

  function closeFieldModal() {
    setFieldModal({
      open: false,
      mode: "edit",
      item: null,
    });
  }

  function saveEditedItem(item: FormItem) {
    setForm((current) => {
      if (!current) {
        return current;
      }

      return updateItemInForm(current, item.id, item);
    });

    closeFieldModal();
  }

  function saveCreatedItem(item: FormItem) {
    const target = fieldModal.target;

    if (!target) {
      return;
    }

    setForm((current) => {
      if (!current) {
        return current;
      }

      return addItemToForm(current, target.sectionId, item, target.index);
    });

    closeFieldModal();
  }

  function handleFieldSave(item: FormItem) {
    if (fieldModal.mode === "create") {
      saveCreatedItem(item);
      return;
    }

    saveEditedItem(item);
  }

  function deleteItem(itemId: string) {
    setForm((current) => {
      if (!current) {
        return current;
      }

      return deleteItemFromForm(current, itemId);
    });
  }

  function handleDragStart(event: DragStartEvent) {
    const activeData = event.active.data.current;

    if (activeData?.source === "palette") {
      setActivePaletteType(activeData.type as FormItemType);
    }
  }

  function handleDragCancel() {
    setActivePaletteType(null);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;

    if (!over || !form) {
      return;
    }

    const activeData = active.data.current;

    if (activeData?.source === "palette") {
      return;
    }

    if (activeData?.type !== "item") {
      return;
    }

    const activeId = String(active.id);
    const overId = String(over.id);

    setForm((current) => {
      if (!current) {
        return current;
      }

      const activeLocation = findItemLocation(current, activeId);

      if (!activeLocation) {
        return current;
      }

      const targetSectionId = getSectionIdFromTarget(
        current,
        overId,
        over.data.current?.type,
      );

      if (!targetSectionId) {
        return current;
      }

      if (activeLocation.sectionId === targetSectionId) {
        return current;
      }

      const targetSectionLocation = findSectionLocation(
        current,
        targetSectionId,
      );

      if (!targetSectionLocation) {
        return current;
      }

      const item = activeLocation.item;

      return {
        ...current,

        stages: current.stages.map((stage) => ({
          ...stage,

          sections: stage.sections.map((section) => {
            if (section.id === activeLocation.sectionId) {
              return {
                ...section,
                items: section.items.filter(
                  (currentItem) => currentItem.id !== activeId,
                ),
              };
            }

            if (section.id === targetSectionId) {
              return {
                ...section,
                items: [...section.items, item],
              };
            }

            return section;
          }),
        })),
      };
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) {
      setActivePaletteType(null);
      return;
    }

    const activeId = String(active.id);
    const overId = String(over.id);

    const activeData = active.data.current;
    const overData = over.data.current;

    const activeType = activeData?.type;

    if (activeData?.source === "palette") {
      if (!form) {
        setActivePaletteType(null);
        return;
      }

      const type = activeData.type as FormItemType;

      const targetSectionId = getSectionIdFromTarget(
        form,
        overId,
        overData?.type,
      );

      if (!targetSectionId) {
        setActivePaletteType(null);
        return;
      }

      const targetIndex = getItemInsertIndex(
        form,
        targetSectionId,
        overId,
        overData?.type,
      );

      setFieldModal({
        open: true,
        mode: "create",
        item: createDefaultItem(type),
        target: {
          sectionId: targetSectionId,
          index: targetIndex,
        },
      });

      setActivePaletteType(null);

      return;
    }

    if (activeType === "stage") {
      setForm((current) => {
        if (!current) {
          return current;
        }

        const targetStageId = getStageIdFromTarget(
          current,
          overId,
          overData?.type,
        );

        if (!targetStageId || activeId === targetStageId) {
          return current;
        }

        return moveStageInForm(current, activeId, targetStageId);
      });

      return;
    }

    if (activeType === "section") {
      if (!form) {
        return;
      }

      const activeLocation = findSectionLocation(form, activeId);

      if (!activeLocation) {
        return;
      }

      if (overData?.type !== "section" && overData?.type !== "stage") {
        return;
      }

      if (overData.type === "stage") {
        if (activeId === overId) {
          return;
        }

        setForm((current) => {
          if (!current) {
            return current;
          }

          return moveSectionInForm(
            current,
            activeId,
            overId,
            current.stages.find((stage) => stage.id === overId)?.sections
              .length ?? 0,
          );
        });

        return;
      }

      const targetLocation = findSectionLocation(form, overId);

      if (!targetLocation || activeId === overId) {
        return;
      }

      const activeRect = active.rect.current.translated;
      const overRect = over.rect;

      let targetIndex = targetLocation.index;

      if (activeRect && overRect) {
        const activeCenter = activeRect.top + activeRect.height / 2;

        const overCenter = overRect.top + overRect.height / 2;

        if (activeCenter > overCenter) {
          targetIndex += 1;
        }
      }

      setForm((current) => {
        if (!current) {
          return current;
        }

        return moveSectionInForm(
          current,
          activeId,
          targetLocation.stageId,
          targetIndex,
        );
      });

      return;
    }

    if (activeType === "item") {
      setForm((current) => {
        if (!current) {
          return current;
        }

        const activeLocation = findItemLocation(current, activeId);

        const overLocation = findItemLocation(current, overId);

        if (!activeLocation) {
          return current;
        }

        if (
          overLocation &&
          activeLocation.sectionId !== overLocation.sectionId
        ) {
          return current;
        }

        if (!overLocation) {
          return current;
        }

        if (activeId === overId) {
          return current;
        }

        return moveItemInForm(
          current,
          activeLocation.sectionId,
          activeId,
          overId,
        );
      });
    }
  }

  async function handleSave() {
    if (!form || !isDirty) {
      return;
    }

    if (mode === "create") {
      console.log("CREATE:", JSON.stringify(form, null, 2));

      setOriginalForm(structuredClone(form));

      return;
    }

    if (!formId) {
      return;
    }

    try {
      const response = await fetch(`/api/forms/${formId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("خطا در ذخیره فرم");
      }

      const savedForm: FormData = await response.json();

      setForm(savedForm);
      setOriginalForm(structuredClone(savedForm));
    } catch (error) {
      console.error(error);
    }
  }

  if (loading || !form) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-background text-foreground">
        <p className="text-sm text-muted">در حال دریافت فرم...</p>
      </main>
    );
  }

  const content = (
    <main className="min-h-dvh bg-background text-foreground">
      <BuilderHeader onSave={handleSave} showSave={isDirty} />

      <div className="mx-auto flex w-full">
        <ElementsPanel />

        <FormCanvas
          form={form}
          onUpdateForm={updateForm}
          onAddStage={addStage}
          onAddSection={addSection}
          onDeleteStage={deleteStage}
          onDeleteSection={deleteSection}
          onDeleteItem={deleteItem}
          onEditItem={openEditItem}
          onEditSection={openSectionEdit}
        />
      </div>
    </main>
  );

  if (!mounted) {
    return content;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetectionStrategy}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      {content}

      <DragOverlay dropAnimation={null}>
        {activePaletteType ? (
          <div className="w-64 rounded-xl border border-primary/30 bg-surface p-3">
            <p className="text-sm font-medium">
              {getDefaultItemTitle(activePaletteType)}
            </p>

            <p className="mt-1 text-xs text-muted">رها کردن داخل سکشن</p>
          </div>
        ) : null}
      </DragOverlay>

      <FieldModal
        key={`${fieldModal.mode}-${fieldModal.item?.id ?? "new"}`}
        open={fieldModal.open}
        mode={fieldModal.mode}
        item={fieldModal.item}
        onClose={closeFieldModal}
        onSave={handleFieldSave}
      />

      <SectionModal
        key={`${sectionModal.mode}-${sectionModal.section?.id ?? "new"}`}
        open={sectionModal.open}
        mode={sectionModal.mode}
        section={sectionModal.section}
        onClose={closeSectionModal}
        onSave={handleSectionSave}
      />
    </DndContext>
  );
}
