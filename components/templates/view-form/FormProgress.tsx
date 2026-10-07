"use client";

import { TickCircle } from "iconsax-reactjs";

interface Stage {
  id: string;
  name?: string;
  title?: string;
}

interface FormProgressProps {
  stages: Stage[];
  currentStageIndex: number;
  onStageClick: (index: number) => void;
}

export default function FormProgress({
  stages,
  currentStageIndex,
  onStageClick,
}: FormProgressProps) {
  return (
    <div className="mb-10 w-full overflow-x-auto scrollbar-none">
      <div className="mx-auto flex min-w-max items-center justify-center px-4">
        {stages.map((stage, index) => {
          const completed = index < currentStageIndex;
          const current = index === currentStageIndex;
          const upcoming = index > currentStageIndex;

          return (
            <div key={stage.id} className="flex items-center">
              <button
                type="button"
                disabled={upcoming}
                onClick={() => {
                  if (!upcoming) {
                    onStageClick(index);
                  }
                }}
                className={`flex flex-col items-center gap-2 ${
                  upcoming ? "cursor-default" : "cursor-pointer"
                }`}
              >
                <div
                  className={`flex size-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                    completed
                      ? "border-primary bg-primary text-white"
                      : current
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-surface text-muted"
                  }`}
                >
                  {completed ? (
                    <TickCircle size={21} variant="Bold" />
                  ) : (
                    <span className="text-sm font-semibold">{index + 1}</span>
                  )}
                </div>

                <span
                  className={`max-w-32 truncate text-xs font-medium ${
                    current || completed ? "text-foreground" : "text-muted"
                  }`}
                >
                  {stage.name ?? stage.title ?? `مرحله ${index + 1}`}
                </span>
              </button>

              {index < stages.length - 1 && (
                <div
                  className={`mx-3 mb-6 h-0.5 w-16 transition-colors duration-300 sm:w-24 ${
                    index < currentStageIndex ? "bg-primary" : "bg-border"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
