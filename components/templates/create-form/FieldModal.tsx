"use client";

import { useState } from "react";

import type { FormItem, FormItemOption, FormItemType } from "@/types/form";

import {
  formItemSchema,
  type FormItemFormData,
} from "@/utils/validation/form-item";
import { createFormData } from "@/utils/defaults";
import FileFormatSelect from "@/components/modules/FileFormatSelect/FileFormatSelect";
import { fileFormats } from "@/constants/fileFormats";

interface FieldModalProps {
  open: boolean;
  mode: "create" | "edit";
  item: FormItem | null;
  onClose: () => void;
  onSave: (item: FormItem) => void;
}

export default function FieldModal({
  open,
  mode,
  item,
  onClose,
  onSave,
}: FieldModalProps) {
  const [form, setForm] = useState<FormItemFormData>(() =>
    createFormData(item),
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!open || !item) {
    return null;
  }

  function updateField<K extends keyof FormItemFormData>(
    key: K,
    value: FormItemFormData[K],
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
    if (!item) {
      return;
    }

    const result = formItemSchema.safeParse(form);

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

    const savedItem: FormItem = {
      id: item.id,
      type: result.data.type,
      title: result.data.title,
      description: result.data.description,
      required: result.data.required,

      placeholder: result.data.placeholder || undefined,

      options: result.data.options,

      min: result.data.min,
      max: result.data.max,

      accept: result.data.accept || undefined,

      maxFileSize: result.data.maxFileSize,
    };

    onSave(savedItem);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[90dvh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-border bg-surface">
        <div className="shrink-0 border-b border-border px-5 py-4">
          <h2 className="text-base font-semibold">
            {mode === "create" ? "افزودن فیلد" : "ویرایش فیلد"}
          </h2>

          <p className="mt-1 text-xs text-muted">مشخصات فیلد را وارد کنید.</p>
        </div>

        <div className="overflow-y-auto p-5">
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium">
                عنوان فیلد
              </label>

              <input
                value={form.title}
                onChange={(event) => updateField("title", event.target.value)}
                placeholder="مثلاً نام و نام خانوادگی"
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
                placeholder="توضیح کوتاهی درباره این فیلد"
                className="w-full resize-none rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary"
              />

              {errors.description && (
                <p className="mt-1.5 text-xs text-red-500">
                  {errors.description}
                </p>
              )}
            </div>

            {hasPlaceholder(form.type) && (
              <div>
                <label className="mb-2 block text-sm font-medium">
                  متن راهنما
                </label>

                <input
                  value={form.placeholder ?? ""}
                  onChange={(event) =>
                    updateField("placeholder", event.target.value)
                  }
                  placeholder="مثلاً نام خود را وارد کنید"
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                />

                {errors.placeholder && (
                  <p className="mt-1.5 text-xs text-red-500">
                    {errors.placeholder}
                  </p>
                )}
              </div>
            )}

            {form.type === "number" && (
              <div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      حداقل مقدار
                    </label>

                    <input
                      type="number"
                      value={form.min ?? ""}
                      onChange={(event) =>
                        updateField(
                          "min",
                          event.target.value === ""
                            ? undefined
                            : Number(event.target.value),
                        )
                      }
                      className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      حداکثر مقدار
                    </label>

                    <input
                      type="number"
                      value={form.max ?? ""}
                      onChange={(event) =>
                        updateField(
                          "max",
                          event.target.value === ""
                            ? undefined
                            : Number(event.target.value),
                        )
                      }
                      className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                    />
                  </div>
                </div>

                {errors.min && (
                  <p className="mt-1.5 text-xs text-red-500">{errors.min}</p>
                )}
              </div>
            )}

            {(form.type === "select" || form.type === "multiselect") && (
              <OptionsEditor
                options={form.options ?? []}
                error={errors.options}
                onChange={(options) => updateField("options", options)}
              />
            )}

            {form.type === "file" && (
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    فرمت‌های مجاز
                  </label>

                  <FileFormatSelect
                    fileFormats={fileFormats}
                    value={form.accept ?? ""}
                    onChange={(value) => updateField("accept", value)}
                  />

                  {errors.accept && (
                    <p className="mt-1.5 text-xs text-red-500">
                      {errors.accept}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    حداکثر حجم فایل
                  </label>

                  <div className="relative">
                    <input
                      type="number"
                      min={1}
                      value={
                        form.maxFileSize ? form.maxFileSize / 1024 / 1024 : ""
                      }
                      onChange={(event) => {
                        const value = Number(event.target.value);

                        updateField(
                          "maxFileSize",
                          value > 0 ? value * 1024 * 1024 : undefined,
                        );
                      }}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2.5 pl-12 text-sm outline-none focus:border-primary"
                    />

                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted">
                      MB
                    </span>
                  </div>

                  {errors.maxFileSize && (
                    <p className="mt-1.5 text-xs text-red-500">
                      {errors.maxFileSize}
                    </p>
                  )}
                </div>
              </div>
            )}

            <label className="flex cursor-pointer items-center justify-between rounded-xl border border-border bg-background px-4 py-3">
              <div>
                <p className="text-sm font-medium">فیلد الزامی</p>

                <p className="mt-1 text-xs text-muted">
                  کاربر برای ارسال فرم باید این فیلد را تکمیل کند.
                </p>
              </div>

              <button
                type="button"
                onClick={() => updateField("required", !form.required)}
                className={`relative h-6 w-11 shrink-0 rounded-full transition-all duration-200 cursor-pointer ${
                  form.required ? "bg-primary" : "bg-border"
                }`}
              >
                <span
                  className={`absolute top-1 size-4 rounded-full bg-white transition-all duration-300 ${
                    form.required ? "right-1" : "right-6"
                  }`}
                />
              </button>
            </label>
          </div>
        </div>

        <div className="flex shrink-0 justify-end gap-2 border-t border-border px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-border px-4 py-2.5 text-sm transition-colors hover:bg-background"
          >
            انصراف
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
          >
            {mode === "create" ? "افزودن فیلد" : "ذخیره تغییرات"}
          </button>
        </div>
      </div>
    </div>
  );
}

function hasPlaceholder(type: FormItemType) {
  return ["text", "textarea", "email", "number", "phone"].includes(type);
}

interface OptionsEditorProps {
  options: FormItemOption[];
  error?: string;
  onChange: (options: FormItemOption[]) => void;
}

function OptionsEditor({ options, error, onChange }: OptionsEditorProps) {
  function addOption() {
    onChange([
      ...options,
      {
        id: crypto.randomUUID(),
        label: "",
        value: "",
      },
    ]);
  }

  function updateOption(id: string, key: "label" | "value", value: string) {
    onChange(
      options.map((option) =>
        option.id === id
          ? {
              ...option,
              [key]: value,
            }
          : option,
      ),
    );
  }

  function removeOption(id: string) {
    onChange(options.filter((option) => option.id !== id));
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="text-sm font-medium">گزینه‌ها</label>

        <button
          type="button"
          onClick={addOption}
          className="text-xs font-medium text-primary"
        >
          + افزودن گزینه
        </button>
      </div>

      <div className="space-y-2">
        {options.map((option, index) => (
          <div key={option.id} className="flex items-center gap-2">
            <span className="w-5 shrink-0 text-xs text-muted">{index + 1}</span>

            <input
              value={option.label}
              onChange={(event) =>
                updateOption(option.id, "label", event.target.value)
              }
              placeholder="عنوان گزینه"
              className="min-w-0 flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />

            <input
              value={option.value}
              onChange={(event) =>
                updateOption(option.id, "value", event.target.value)
              }
              placeholder="مقدار"
              className="min-w-0 flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />

            <button
              type="button"
              onClick={() => removeOption(option.id)}
              className="shrink-0 px-2 text-lg text-muted transition-colors hover:text-red-500"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}
