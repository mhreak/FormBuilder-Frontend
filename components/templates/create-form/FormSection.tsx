"use client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Edit2, Trash } from "iconsax-reactjs";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import FormItem from "./FormItem";
import type { FormItem as FormItemType, FormSection } from "@/types/form";
import SectionIcon from "@/components/ui/icons/SectionIcon";

interface FormSectionProps {
  section: FormSection;
  onDelete: () => void;
  onDeleteItem: (itemId: string) => void;
  onEditItem: (item: FormItemType) => void;
  onEditSection: (section: FormSection) => void;
}

export default function FormSection({
  section,
  onDelete,
  onDeleteItem,
  onEditItem,
  onEditSection,
}: FormSectionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: section.id,
    data: {
      type: "section",
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-xl border bg-background transition-colors ${
        isDragging ? "relative z-10 opacity-50" : "border-border"
      }`}
    >
      <div className="flex items-start justify-between gap-4 border-b border-border p-4">
        <div className="flex min-w-0 items-start gap-3">
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="cursor-grab touch-none text-muted/40 text-xl pt-2.5 transition-colors hover:text-muted active:cursor-grabbing"
          >
            ⠿
          </button>

          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-surface text-primary">
            <SectionIcon
              name={section.icon?.name}
              variant={section.icon?.variant}
              size={20}
            />
          </div>

          <div className="min-w-0">
            <h3 className="text-sm font-semibold">{section.title}</h3>

            {section.description && (
              <p className="mt-1 text-xs leading-5 text-muted">
                {section.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => onEditSection(section)}
            className="flex size-8 cursor-pointer items-center justify-center rounded-lg bg-blue-500/10 text-blue-500 transition-colors duration-200 hover:bg-blue-500/80 hover:text-white"
            title="ویرایش سکشن"
          >
            <Edit2 size={16} variant="Linear" />
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="flex size-8 cursor-pointer items-center justify-center rounded-lg bg-red-500/10 text-red-500 transition-colors duration-200 hover:bg-red-500/80 hover:text-white"
            title="حذف سکشن"
          >
            <Trash size={16} variant="Linear" />
          </button>
        </div>
      </div>

      <div className="min-h-24 space-y-2 p-4">
        <SortableContext
          items={section.items.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          {section.items.map((item) => (
            <FormItem
              key={item.id}
              item={item}
              onDelete={onDeleteItem}
              onEdit={onEditItem}
            />
          ))}
        </SortableContext>

        {section.items.length === 0 && (
          <div className="flex min-h-16 items-center justify-center rounded-lg border border-dashed border-border text-xs text-muted">
            المان را اینجا رها کنید
          </div>
        )}
      </div>
    </div>
  );
}
