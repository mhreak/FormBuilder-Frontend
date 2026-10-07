"use client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import {
  Calendar,
  CloseCircle,
  Edit2,
  Hashtag,
  Sms,
  Text,
} from "iconsax-reactjs";

import type { FormItem as FormItemType } from "@/types/form";

interface FormItemProps {
  item: FormItemType;
  onEdit: (item: FormItemType) => void;
  onDelete: (itemId: string) => void;
}

export default function FormItem({ item, onEdit, onDelete }: FormItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
    data: {
      type: "item",
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
      className={`group flex items-center gap-3 bg-background px-4 py-4 transition-colors ${
        isDragging ? "relative z-10 opacity-50" : "hover:bg-surface-hover"
      }`}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none text-muted/40 text-lg pt-2 transition-colors hover:text-muted active:cursor-grabbing"
      >
        ⠿
      </button>

      <button
        type="button"
        onClick={() => onEdit(item)}
        className="flex min-w-0 flex-1 items-center gap-3 text-right"
      >
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-surface text-primary">
          <ItemIcon type={item.type} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-medium">{item.title}</p>

            {item.required && <span className="text-xs text-primary">*</span>}
          </div>

          {item.description && (
            <p className="mt-1 truncate text-xs text-muted">
              {item.description}
            </p>
          )}
        </div>

        <span className="hidden shrink-0 text-[10px] text-muted sm:block">
          {getTypeLabel(item.type)}
        </span>
      </button>

      <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          type="button"
          onClick={() => onEdit(item)}
          className="flex size-8 cursor-pointer items-center justify-center rounded-lg text-blue-500 transition-colors bg-blue-500/10 hover:bg-blue-500/80 hover:text-white duration-200"
        >
          <Edit2 size={16} />
        </button>

        <button
          type="button"
          onClick={() => onDelete(item.id)}
          className="flex size-8 cursor-pointer items-center justify-center rounded-lg bg-red-500/10 text-red-500 transition-colors hover:bg-red-500/80 hover:text-white duration-200"
        >
          <CloseCircle size={16} />
        </button>
      </div>
    </div>
  );
}

function ItemIcon({ type }: { type: FormItemType["type"] }) {
  switch (type) {
    case "email":
      return <Sms size={18} />;

    case "number":
    case "phone":
      return <Hashtag size={18} />;

    case "date":
      return <Calendar size={18} />;

    default:
      return <Text size={18} />;
  }
}

function getTypeLabel(type: FormItemType["type"]) {
  const labels: Record<FormItemType["type"], string> = {
    text: "متن کوتاه",
    textarea: "متن بلند",
    email: "ایمیل",
    number: "عدد",
    phone: "شماره تلفن",
    select: "انتخابی",
    multiselect: "چند انتخابی",
    date: "تاریخ",
    file: "فایل",
  };

  return labels[type];
}
