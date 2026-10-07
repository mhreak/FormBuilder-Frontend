"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Add, Trash, Edit2 } from "iconsax-reactjs";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import FormSection from "./FormSection";
import type {
  FormStage,
  FormItem,
  FormSection as FormSectionType,
} from "@/types/form";

interface FormStageProps {
  stage: FormStage;
  onAddSection: (stageId: string) => void;
  onDeleteStage: (stageId: string) => void;
  onDeleteSection: (stageId: string, sectionId: string) => void;
  onDeleteItem: (itemId: string) => void;
  onEditItem: (item: FormItem) => void;
  onEditSection: (section: FormSectionType) => void;
}

export default function FormStage({
  stage,
  onAddSection,
  onDeleteStage,
  onDeleteSection,
  onDeleteItem,
  onEditItem,
  onEditSection,
}: FormStageProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: stage.id,
    data: {
      type: "stage",
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <section
      ref={setNodeRef}
      style={style}
      className={`rounded-2xl border border-border bg-surface ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div className="border-b border-border p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <button
              type="button"
              {...listeners}
              {...attributes}
              className="mt-0.5 flex size-9 shrink-0 pt-2.5 text-xl cursor-grab items-center justify-center rounded-lg border border-border bg-background text-muted transition-colors hover:bg-surface-hover active:cursor-grabbing"
            >
              ⠿
            </button>

            <div className="min-w-0">
              <h2 className="mt-1 text-base font-semibold">{stage.title}</h2>

              {stage.description && (
                <p className="mt-1 text-sm leading-6 text-muted">
                  {stage.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              className="flex size-9 cursor-pointer items-center justify-center rounded-lg bg-blue-500/10 text-blue-500 transition-colors hover:bg-blue-500/80 hover:text-white duration-200"
              title="ویرایش مرحله"
            >
              <Edit2 size={17} variant="Linear" />
            </button>

            <button
              type="button"
              onClick={() => onDeleteStage(stage.id)}
              className="flex size-9 cursor-pointer items-center justify-center rounded-lg bg-red-500/10 text-red-500 transition-colors hover:bg-red-500/80 hover:text-white duration-200"
              title="حذف مرحله"
            >
              <Trash size={17} variant="Linear" />
            </button>
          </div>
        </div>
      </div>

      <div className="min-h-32 space-y-4 p-5">
        <SortableContext
          items={stage.sections.map((section) => section.id)}
          strategy={verticalListSortingStrategy}
        >
          {stage.sections.map((section) => (
            <FormSection
              key={section.id}
              section={section}
              onDelete={() => onDeleteSection(stage.id, section.id)}
              onDeleteItem={onDeleteItem}
              onEditItem={onEditItem}
              onEditSection={onEditSection}
            />
          ))}
        </SortableContext>

        <button
          type="button"
          onClick={() => onAddSection(stage.id)}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-border-strong py-3 text-sm font-medium text-muted transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
        >
          <Add size={18} />
          افزودن سکشن
        </button>
      </div>
    </section>
  );
}
