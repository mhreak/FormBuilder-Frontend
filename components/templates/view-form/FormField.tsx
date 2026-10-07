"use client";

import type { FormItem } from "@/types/form";

interface FormFieldProps {
  item: FormItem;
  value: unknown;
  error?: string;
  onChange: (value: unknown) => void;
}

export default function FormField({
  item,
  value,
  error,
  onChange,
}: FormFieldProps) {
  const inputClass = `w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition-colors ${
    error
      ? "border-red-500 focus:border-red-500"
      : "border-border focus:border-primary"
  }`;

  const renderInput = () => {
    switch (item.type) {
      case "text":
        return (
          <input
            type="text"
            value={typeof value === "string" ? value : ""}
            placeholder={item.placeholder}
            onChange={(event) => onChange(event.target.value)}
            className={inputClass}
          />
        );

      case "textarea":
        return (
          <textarea
            value={typeof value === "string" ? value : ""}
            placeholder={item.placeholder}
            onChange={(event) => onChange(event.target.value)}
            rows={5}
            className={`${inputClass} resize-none`}
          />
        );

      case "email":
        return (
          <input
            type="email"
            value={typeof value === "string" ? value : ""}
            placeholder={item.placeholder}
            onChange={(event) => onChange(event.target.value)}
            className={inputClass}
          />
        );

      case "number":
        return (
          <input
            type="number"
            value={value === undefined || value === null ? "" : String(value)}
            placeholder={item.placeholder}
            min={item.min}
            max={item.max}
            onChange={(event) => {
              const rawValue = event.target.value;

              if (rawValue === "") {
                onChange("");
                return;
              }

              onChange(Number(rawValue));
            }}
            className={inputClass}
          />
        );

      case "phone":
        return (
          <input
            type="tel"
            value={typeof value === "string" ? value : ""}
            placeholder={item.placeholder}
            onChange={(event) => onChange(event.target.value)}
            className={inputClass}
          />
        );

      case "select":
        return (
          <select
            value={typeof value === "string" ? value : ""}
            onChange={(event) => onChange(event.target.value)}
            className={inputClass}
          >
            <option value="">انتخاب کنید</option>

            {item.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case "multiselect": {
        const selectedValues = Array.isArray(value)
          ? value.filter((item): item is string => typeof item === "string")
          : [];

        function toggleOption(optionValue: string) {
          if (selectedValues.includes(optionValue)) {
            onChange(selectedValues.filter((value) => value !== optionValue));
          } else {
            onChange([...selectedValues, optionValue]);
          }
        }

        return (
          <div className="grid gap-2 sm:grid-cols-2">
            {item.options?.map((option) => {
              const selected = selectedValues.includes(option.value);

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => toggleOption(option.value)}
                  className={`rounded-xl border px-4 py-3 text-right text-sm transition ${
                    selected
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background text-foreground hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex size-5 shrink-0 items-center justify-center rounded border transition ${
                        selected ? "border-primary bg-primary" : "border-border"
                      }`}
                    >
                      {selected && (
                        <span className="text-xs text-white">✓</span>
                      )}
                    </div>

                    <span>{option.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        );
      }

      case "date":
        return (
          <input
            type="date"
            value={typeof value === "string" ? value : ""}
            onChange={(event) => onChange(event.target.value)}
            className={inputClass}
          />
        );

      case "file": {
        const file = value instanceof File ? value : null;

        return (
          <div className="space-y-2">
            <label
              className={`flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed px-4 py-6 text-center transition ${
                error ? "border-red-500" : "border-border hover:border-primary"
              }`}
            >
              <input
                type="file"
                accept={item.accept}
                onChange={(event) => {
                  const selectedFile = event.target.files?.[0];

                  if (selectedFile) {
                    onChange(selectedFile);
                  }
                }}
                className="hidden"
              />

              {file ? (
                <>
                  <span className="text-sm font-medium">{file.name}</span>

                  <span className="mt-1 text-xs text-muted">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </>
              ) : (
                <>
                  <span className="text-sm font-medium">انتخاب فایل</span>

                  <span className="mt-1 text-xs text-muted">
                    برای انتخاب فایل کلیک کنید
                  </span>
                </>
              )}
            </label>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      <div>
        <label className="text-sm font-medium">
          {item.title}

          {item.required && <span className="mr-1 text-red-500">*</span>}
        </label>

        {item.description && (
          <p className="mt-1 text-xs leading-6 text-muted">
            {item.description}
          </p>
        )}
      </div>

      {renderInput()}

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
