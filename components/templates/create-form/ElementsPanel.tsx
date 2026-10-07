"use client";
import { useDraggable } from "@dnd-kit/core";
import {
  Calendar,
  DocumentUpload,
  Edit2,
  Hashtag,
  Hierarchy,
  Sms,
  Text,
  TickCircle,
} from "iconsax-reactjs";
import type { FormItemType } from "@/types/form";

const elements: {
  type: FormItemType;
  title: string;
  description: string;
  icon: typeof Text;
}[] = [
  {
    type: "text",
    title: "متن کوتاه",
    description: "نام، عنوان و متن کوتاه",
    icon: Text,
  },
  {
    type: "textarea",
    title: "متن بلند",
    description: "توضیحات و متن چندخطی",
    icon: Edit2,
  },
  {
    type: "email",
    title: "ایمیل",
    description: "دریافت آدرس ایمیل",
    icon: Sms,
  },
  {
    type: "number",
    title: "عدد",
    description: "دریافت عدد",
    icon: Hashtag,
  },
  {
    type: "phone",
    title: "شماره تلفن",
    description: "دریافت شماره تماس",
    icon: Hashtag,
  },
  {
    type: "select",
    title: "انتخابی",
    description: "انتخاب یک گزینه",
    icon: TickCircle,
  },
  {
    type: "multiselect",
    title: "چند انتخابی",
    description: "انتخاب چند گزینه",
    icon: Hierarchy,
  },
  {
    type: "date",
    title: "تاریخ",
    description: "انتخاب تاریخ",
    icon: Calendar,
  },
  {
    type: "file",
    title: "فایل",
    description: "آپلود فایل",
    icon: DocumentUpload,
  },
];

function DraggableElement({
  type,
  title,
  description,
  icon: Icon,
}: (typeof elements)[number]) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${type}`,
    data: {
      source: "palette",
      type,
    },
  });

  return (
    <button
      ref={setNodeRef}
      type="button"
      {...listeners}
      {...attributes}
      className={`group flex w-full cursor-grab items-center gap-3 rounded-xl border border-transparent bg-background p-3 text-right transition-all active:cursor-grabbing ${
        isDragging
          ? "border-primary/30 bg-primary/5 opacity-50"
          : "hover:border-border hover:bg-surface-hover"
      }`}
    >
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-surface text-primary transition-colors group-hover:border-primary/30 group-hover:bg-primary/5">
        <Icon size={18} variant="Linear" />
      </div>

      <div className="min-w-0">
        <p className="text-sm font-medium">{title}</p>

        <p className="mt-0.5 truncate text-[11px] text-muted">{description}</p>
      </div>
    </button>
  );
}

export default function ElementsPanel() {
  return (
    <aside className="sticky top-18 hidden h-[calc(100dvh-72px)] w-72 shrink-0 overflow-y-auto border-l border-border bg-surface lg:block">
      <div className="p-5">
        <div className="mb-5">
          <p className="text-sm font-semibold">المان‌های فرم</p>

          <p className="mt-1 text-xs leading-6 text-muted">
            یک المان را بکشید و داخل سکشن موردنظر قرار دهید.
          </p>
        </div>

        <div className="space-y-2">
          {elements.map((element) => (
            <DraggableElement key={element.type} {...element} />
          ))}
        </div>
      </div>
    </aside>
  );
}
