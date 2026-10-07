import Header from "@/components/modules/Header/Header";
import FormCard from "@/components/ui/cards/FormCard";
import { AddSquare, Document } from "iconsax-reactjs";
import Link from "next/link";

const forms = [
  {
    id: 1,
    title: "فرم ثبت‌نام دوره آموزشی",
    description: "فرم ثبت‌نام متقاضیان دوره مقدماتی",
    responses: 128,
    updatedAt: "امروز، ۱۴:۳۲",
    status: "فعال",
  },
  {
    id: 2,
    title: "نظرسنجی رضایت مشتریان",
    description: "دریافت بازخورد و میزان رضایت کاربران",
    responses: 84,
    updatedAt: "دیروز، ۱۸:۱۰",
    status: "فعال",
  },
  {
    id: 3,
    title: "فرم درخواست همکاری",
    description: "جمع‌آوری اطلاعات متقاضیان همکاری",
    responses: 36,
    updatedAt: "۲ روز پیش",
    status: "فعال",
  },
  {
    id: 4,
    title: "ثبت درخواست پشتیبانی",
    description: "فرم ارسال درخواست و مشکلات کاربران",
    responses: 214,
    updatedAt: "۵ روز پیش",
    status: "غیرفعال",
  },
];

export default function DashboardPage() {
  return (
    <main className="min-h-dvh bg-background text-foreground">
      <Header />

      <section className="mx-auto w-full max-w-7xl px-6 py-10 sm:px-8 lg:px-10 lg:py-14">
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="relative">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted">
                <span className="size-1.5 rounded-full bg-primary" />
                فضای نظارت بر فرم‌ها
              </span>

              <span className="h-px w-10 bg-border" />
            </div>

            <div className="relative">
              <h1 className="text-4xl font-bold tracking-[-0.03em] sm:text-5xl">
                فرم‌های <span className="text-primary">طراحی‌شده</span>
              </h1>

              <span className="absolute -bottom-2 right-0 h-1 w-12 rounded-full bg-primary/30" />
            </div>

            <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center">
              <p className="max-w-md text-sm leading-6 text-muted">
                همه فرم‌های ساخته‌شده در یک نگاه!
                <br />
                مدیریت، ویرایش و مشاهده پاسخ‌ها.
              </p>

              <div className="hidden h-8 w-px bg-border sm:block" />

              <div className="flex items-center gap-1.5 text-xs text-muted">
                <span className="text-lg font-bold text-foreground">
                  {forms.length.toLocaleString("fa")}
                </span>
                فرم ساخته‌شده
              </div>
            </div>
          </div>

          <Link
            href="/create"
            type="button"
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary p-3 px-8 text-sm font-semibold text-white transition-all hover:bg-primary-hover active:scale-[0.98]"
          >
            <AddSquare />
            ایجاد فرم جدید
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {forms.map((form) => (
            <FormCard key={form.id} form={form} />
          ))}
        </div>

        {forms.length === 0 && (
          <div className="flex min-h-100 flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-surface px-6 text-center">
            <div className="mb-5 flex size-14 items-center justify-center rounded-2xl border border-border bg-background text-muted">
              <Document />
            </div>

            <h2 className="text-base font-semibold">هنوز فرمی نساخته‌اید</h2>

            <p className="mt-1.5 mb-6 max-w-sm text-sm leading-6 text-muted">
              اولین فرم خود را بسازید و شروع به جمع‌آوری پاسخ‌ها کنید.
            </p>

            <Link
              href="/create"
              type="button"
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary p-3 px-8 text-sm font-semibold text-white transition-all hover:bg-primary-hover active:scale-[0.98]"
            >
              <AddSquare />
              ایجاد اولین فرم
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
