"use client";
import { useState } from "react";
import { ArrowLeft2, ArrowRight2, Send2 } from "iconsax-reactjs";

import type { FormData, FormItem } from "@/types/form";

import FormProgress from "./FormProgress";
import FormStageView from "./FormStageView";

interface FormViewProps {
  form: FormData;
}

export default function FormView({ form }: FormViewProps) {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  const [answers, setAnswers] = useState<Record<string, unknown>>({});

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [submitError, setSubmitError] = useState("");

  const [submitted, setSubmitted] = useState(false);

  const currentStage = form.stages[currentStageIndex];

  function handleAnswerChange(itemId: string, value: unknown) {
    setAnswers((current) => ({
      ...current,
      [itemId]: value,
    }));

    setErrors((current) => {
      if (!current[itemId]) {
        return current;
      }

      const next = { ...current };
      delete next[itemId];

      return next;
    });
  }

  function isEmptyValue(value: unknown) {
    if (value === undefined || value === null) {
      return true;
    }

    if (typeof value === "string") {
      return value.trim() === "";
    }

    if (Array.isArray(value)) {
      return value.length === 0;
    }

    return false;
  }

  function validateItem(item: FormItem, value: unknown): string | null {
    if (item.required && isEmptyValue(value)) {
      return "تکمیل این فیلد الزامی است";
    }

    if (isEmptyValue(value)) {
      return null;
    }

    switch (item.type) {
      case "email": {
        if (typeof value !== "string") {
          return "ایمیل نامعتبر است";
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(value)) {
          return "ایمیل واردشده معتبر نیست";
        }

        break;
      }

      case "number": {
        if (typeof value !== "number" || Number.isNaN(value)) {
          return "مقدار باید عدد باشد";
        }

        if (item.min !== undefined && value < item.min) {
          return `مقدار نباید کمتر از ${item.min} باشد`;
        }

        if (item.max !== undefined && value > item.max) {
          return `مقدار نباید بیشتر از ${item.max} باشد`;
        }

        break;
      }

      case "select": {
        if (typeof value !== "string") {
          return "گزینه انتخاب‌شده معتبر نیست";
        }

        const validOption = item.options?.some(
          (option) => option.value === value,
        );

        if (!validOption) {
          return "گزینه انتخاب‌شده معتبر نیست";
        }

        break;
      }

      case "multiselect": {
        if (!Array.isArray(value)) {
          return "گزینه‌های انتخاب‌شده معتبر نیستند";
        }

        const validValues = new Set(
          item.options?.map((option) => option.value) ?? [],
        );

        const allValid = value.every(
          (selectedValue) =>
            typeof selectedValue === "string" && validValues.has(selectedValue),
        );

        if (!allValid) {
          return "یکی از گزینه‌های انتخاب‌شده معتبر نیست";
        }

        break;
      }

      case "file": {
        if (!(value instanceof File)) {
          return "لطفاً یک فایل انتخاب کنید";
        }

        if (
          item.maxFileSize !== undefined &&
          value.size > item.maxFileSize * 1024 * 1024
        ) {
          return `حجم فایل نباید بیشتر از ${item.maxFileSize} MB باشد`;
        }

        if (item.accept) {
          const acceptedFormats = item.accept
            .split(",")
            .map((format) => format.trim().toLowerCase())
            .filter(Boolean);

          const fileName = value.name.toLowerCase();

          const isAccepted = acceptedFormats.some(
            (format) => format.startsWith(".") && fileName.endsWith(format),
          );

          if (!isAccepted) {
            return "فرمت فایل انتخاب‌شده مجاز نیست";
          }
        }

        break;
      }

      case "phone": {
        if (typeof value !== "string") {
          return "شماره تلفن معتبر نیست";
        }

        const phoneRegex = /^[0-9+\-() ]{7,20}$/;

        if (!phoneRegex.test(value)) {
          return "شماره تلفن معتبر نیست";
        }

        break;
      }

      default:
        break;
    }

    return null;
  }

  function validateCurrentStage() {
    const nextErrors: Record<string, string> = {};

    for (const section of currentStage.sections) {
      for (const item of section.items) {
        const error = validateItem(item, answers[item.id]);

        if (error) {
          nextErrors[item.id] = error;
        }
      }
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  function handleNext() {
    const valid = validateCurrentStage();

    if (!valid) {
      return;
    }

    if (currentStageIndex < form.stages.length - 1) {
      setCurrentStageIndex((current) => current + 1);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }

  function handlePrevious() {
    if (currentStageIndex === 0) {
      return;
    }

    setErrors({});

    setCurrentStageIndex((current) => current - 1);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleSubmit() {
    const valid = validateCurrentStage();

    if (!valid) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const formData = new FormData();

      formData.append("formId", form.id);

      const serializedAnswers: Record<string, unknown> = {};

      for (const [itemId, value] of Object.entries(answers)) {
        if (value instanceof File) {
          formData.append(`file_${itemId}`, value);
        } else {
          serializedAnswers[itemId] = value;
        }
      }

      formData.append("answers", JSON.stringify(serializedAnswers));

      const response = await fetch(`/api/forms/${form.id}/responses`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "ارسال فرم با خطا مواجه شد");
      }

      setSubmitted(true);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "ارسال فرم با خطا مواجه شد",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleStageClick(index: number) {
    if (index > currentStageIndex) {
      return;
    }

    setErrors({});
    setCurrentStageIndex(index);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  if (submitted) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Send2 size={26} variant="Bold" />
          </div>

          <h1 className="mt-5 text-xl font-bold">فرم با موفقیت ارسال شد</h1>

          <p className="mt-2 text-sm leading-7 text-muted">
            پاسخ‌های شما با موفقیت ثبت شدند.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        <header className="mb-10 text-center">
          <h1 className="text-2xl font-bold sm:text-3xl">{form.title}</h1>

          {form.description && (
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-muted">
              {form.description}
            </p>
          )}
        </header>

        <FormProgress
          stages={form.stages}
          currentStageIndex={currentStageIndex}
          onStageClick={handleStageClick}
        />

        <FormStageView
          stage={currentStage}
          answers={answers}
          errors={errors}
          onChange={handleAnswerChange}
        />

        {submitError && (
          <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-500">
            {submitError}
          </div>
        )}

        <div className="mt-8 flex items-center justify-between gap-3 border-t border-border pt-6">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentStageIndex === 0}
            className="flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm transition hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowRight2 size={18} />
            قبلی
          </button>

          {currentStageIndex < form.stages.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white transition hover:bg-primary-hover"
            >
              مرحله بعد
              <ArrowLeft2 size={18} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Send2 size={18} />

              {isSubmitting ? "در حال ارسال..." : "ارسال فرم"}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
