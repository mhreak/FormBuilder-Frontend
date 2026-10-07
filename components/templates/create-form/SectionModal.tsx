"use client";

import { useState } from "react";
import type { FormSection } from "@/types/form";

import {
  formSectionSchema,
  type FormSectionFormData,
} from "@/utils/validation/form-section";
import { createSectionFormData } from "@/utils/defaults";

import IconPicker from "@/components/modules/IconPicker/IconPicker";

interface SectionModalProps {
  open: boolean;
  mode: "create" | "edit";
  section: FormSection | null;
  onClose: () => void;
  onSave: (data: FormSectionFormData) => void;
}

export default function SectionModal({
  open,
  mode,
  section,
  onClose,
  onSave,
}: SectionModalProps) {
  const [form, setForm] = useState<FormSectionFormData>(() =>
    createSectionFormData(section),
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!open || !section) {
    return null;
  }

  function updateField<K extends keyof FormSectionFormData>(
    key: K,
    value: FormSectionFormData[K],
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));

    setErrors((current) => {
      const next = { ...current };
      delete next[String(key)];
      return next;
    });
  }

  function handleSubmit() {
    if (!section) {
      return;
    }

    const result = formSectionSchema.safeParse(form);

    if (!result.success) {
      const nextErrors: Record<string, string> = {};

      for (const issue of result.error.issues) {
        const key = String(issue.path[0]);

        if (!nextErrors[key]) {
          nextErrors[key] = issue.message;
        }
      }

      setErrors(nextErrors);

      return;
    }

    onSave(result.data);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[90dvh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-border bg-surface">
        <div className="shrink-0 border-b border-border px-5 py-4">
          <h2 className="text-base font-semibold">
            {mode === "create" ? "افزودن سکشن" : "ویرایش سکشن"}
          </h2>

          <p className="mt-1 text-xs text-muted">
            مشخصات سکشن و آیکون آن را وارد کنید.
          </p>
        </div>

        <div className="overflow-y-auto p-5">
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium">
                عنوان سکشن
              </label>

              <input
                value={form.title}
                onChange={(event) => updateField("title", event.target.value)}
                placeholder="مثلاً اطلاعات شخصی"
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary"
              />

              {errors.title && (
                <p className="mt-1.5 text-xs text-red-500">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">توضیحات</label>

              <textarea
                value={form.description}
                onChange={(event) =>
                  updateField("description", event.target.value)
                }
                rows={3}
                placeholder="توضیح کوتاهی درباره این سکشن"
                className="w-full resize-none rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary"
              />

              {errors.description && (
                <p className="mt-1.5 text-xs text-red-500">
                  {errors.description}
                </p>
              )}
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between h-full">
                <label className="text-sm font-medium">آیکون</label>

                <div className="flex items-center gap-2 text-xs text-muted">
                  <span>انتخاب‌شده:</span>

                  <span className="font-medium text-foreground">
                    {form.icon.name}
                  </span>
                </div>
              </div>

              <IconPicker
                value={form.icon}
                onChange={(icon) => updateField("icon", icon)}
              />

              {errors.icon && (
                <p className="mt-1.5 text-xs text-red-500">{errors.icon}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 justify-end gap-2 border-t border-border px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-border px-4 py-2.5 text-sm transition-colors hover:bg-background cursor-pointer"
          >
            انصراف
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover cursor-pointer"
          >
            {mode === "create" ? "افزودن سکشن" : "ذخیره تغییرات"}
          </button>
        </div>
      </div>
    </div>
  );
}
