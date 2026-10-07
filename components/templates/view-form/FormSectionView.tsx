"use client";

import type { FormSection } from "@/types/form";
import FormField from "./FormField";
import SectionIcon from "@/components/ui/icons/SectionIcon";

interface FormSectionViewProps {
  section: FormSection;
  answers: Record<string, unknown>;
  errors: Record<string, string>;
  onChange: (itemId: string, value: unknown) => void;
}

export default function FormSectionView({
  section,
  answers,
  errors,
  onChange,
}: FormSectionViewProps) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
      <div className="mb-6 flex items-start gap-3">
        {section.icon && (
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <SectionIcon
              name={section.icon.name}
              variant={section.icon.variant}
              size={21}
            />
          </div>
        )}

        <div>
          <h2 className="text-base font-semibold">{section.title}</h2>

          {section.description && (
            <p className="mt-1 text-xs leading-6 text-muted">
              {section.description}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {section.items.map((item) => (
          <FormField
            key={item.id}
            item={item}
            value={answers[item.id]}
            error={errors[item.id]}
            onChange={(value) => onChange(item.id, value)}
          />
        ))}
      </div>
    </section>
  );
}
