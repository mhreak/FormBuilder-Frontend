import { Edit, Eye, Trash } from "iconsax-reactjs";

export default function FormCard({
  form,
}: {
  form: {
    id: number;
    title: string;
    description: string;
    responses: number;
    updatedAt: string;
    status: string;
  };
}) {
  return (
    <article className="group relative overflow-hidden rounded-3xl border border-border bg-surface transition-all duration-300 hover:-translate-y-0.5 hover:border-b-primary">
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="truncate text-base font-semibold tracking-tight">
              {form.title}
            </h2>

            <p className="mt-2 min-h-12 text-sm leading-6 text-muted">
              {form.description}
            </p>
          </div>

          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${
              form.status === "فعال"
                ? "border-emerald-500/20 bg-emerald-500/8 text-emerald-600"
                : "border-border bg-background text-muted"
            }`}
          >
            <span
              className={`size-1.5 rounded-full ${
                form.status === "فعال" ? "bg-emerald-500" : "bg-muted"
              }`}
            />

            {form.status}
          </span>
        </div>

        <div className="w-full flex justify-around items-center gap-5 border-t border-border pt-5">
          <div className="flex justify-center items-end gap-4">
            <p className="text-[11px] text-muted">تعداد پاسخ‌ها:</p>
            <p className="mt-1 text-sm font-semibold">
              {form.responses.toLocaleString("fa-IR")}
            </p>
          </div>

          <div className="h-7 w-px bg-border" />

          <div className="flex justify-center items-end gap-4">
            <p className="text-[11px] text-muted">آخرین تغییر:</p>
            <p className="mt-1 text-sm font-medium">{form.updatedAt}</p>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-2">
          <button
            type="button"
            className="flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-border bg-background text-xs font-medium transition-colors hover:border-border-strong hover:bg-surface-hover"
          >
            <Eye size={16} />
            مشاهده
          </button>

          <button
            type="button"
            title="ویرایش"
            className="flex size-10 cursor-pointer items-center justify-center rounded-xl border border-border bg-background text-muted transition-colors hover:border-border-strong hover:bg-surface-hover hover:text-foreground"
          >
            <Edit size={16} />
          </button>

          <button
            type="button"
            title="حذف"
            className="flex size-10 cursor-pointer items-center justify-center rounded-xl border border-border bg-background text-muted transition-colors hover:border-red-500/20 hover:bg-red-500/8 hover:text-red-500"
          >
            <Trash size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}
