"use client";
import type { FormStage } from "@/types/form";
import FormSectionView from "./FormSectionView";

interface FormStageViewProps {
  stage: FormStage;
  answers: Record<string, unknown>;
  errors: Record<string, string>;
  onChange: (itemId: string, value: unknown) => void;
}

export default function FormStageView({
  stage,
  answers,
  errors,
  onChange,
}: FormStageViewProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{stage.title}</h1>

        {stage.description && (
          <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">
            {stage.description}
          </p>
        )}
      </div>

      <div className="space-y-5">
        {stage.sections.map((section) => (
          <FormSectionView
            key={section.id}
            section={section}
            answers={answers}
            errors={errors}
            onChange={onChange}
          />
        ))}
      </div>
    </div>
  );
}
