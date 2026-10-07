"use client";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import FormStage from "./FormStage";
import type { FormData, FormItem, FormSection } from "@/types/form";
import { Add, MessageEdit, MessageText } from "iconsax-reactjs";

interface FormCanvasProps {
  form: FormData;
  onUpdateForm: (changes: Partial<FormData>) => void;
  onAddStage: () => void;
  onAddSection: (stageId: string) => void;
  onDeleteStage: (stageId: string) => void;
  onDeleteSection: (stageId: string, sectionId: string) => void;
  onDeleteItem: (itemId: string) => void;
  onEditItem: (item: FormItem) => void;
  onEditSection: (section: FormSection) => void;
}

export default function FormCanvas({
  form,
  onUpdateForm,
  onAddStage,
  onAddSection,
  onDeleteStage,
  onDeleteSection,
  onDeleteItem,
  onEditItem,
  onEditSection,
}: FormCanvasProps) {
  return (
    <section className="min-w-0 flex-1">
      <div className="mx-auto w-full max-w-4xl px-5 py-8 sm:px-8 lg:py-12">
        <div className="w-full flex flex-col justify-center items-start gap-2 mb-10">
          <h2 className="text-xl mb-1">اطلاعات فرم</h2>
          <div className="w-full relative">
            <input
              className="w-full p-3 pr-12 outline-none bg-surface focus:bg-surface-hover transition-colors duration-200 rounded-lg"
              value={form.title}
              placeholder="نام فرم"
              onChange={(event) =>
                onUpdateForm({
                  title: event.target.value,
                })
              }
            />
            <MessageEdit className="text-foreground/50 absolute right-3 top-1/2 -translate-y-1/2" />
          </div>

          <div className="w-full relative">
            <textarea
              className="w-full min-h-20 p-3 pr-12 outline-none bg-surface focus:bg-surface-hover transition-colors duration-200 rounded-lg"
              value={form.description}
              placeholder="توضیحات فرم"
              onChange={(event) =>
                onUpdateForm({
                  description: event.target.value,
                })
              }
            />
            <MessageText className="text-foreground/50 absolute right-3 top-3" />
          </div>
        </div>

        <SortableContext
          items={form.stages.map((stage) => stage.id)}
          strategy={verticalListSortingStrategy}
        >
          <h2 className="text-xl mb-3">موارد فرم</h2>
          <div className="space-y-6">
            {form.stages.map((stage) => (
              <FormStage
                key={stage.id}
                stage={stage}
                onAddSection={onAddSection}
                onDeleteStage={onDeleteStage}
                onDeleteSection={onDeleteSection}
                onDeleteItem={onDeleteItem}
                onEditItem={onEditItem}
                onEditSection={onEditSection}
              />
            ))}
          </div>
        </SortableContext>

        <button
          type="button"
          onClick={onAddStage}
          className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-border-strong py-4 text-sm font-medium text-muted transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
        >
          <Add size={18} />
          افزودن مرحله
        </button>
      </div>
    </section>
  );
}
