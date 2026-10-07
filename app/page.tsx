import Header from "@/components/modules/Header/Header";
import LoginForm from "@/components/templates/home/LoginForm";

export default function Home() {
  return (
    <main className="relative flex min-h-dvh flex-col overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-75 h-150 w-150 -translate-x-1/2 rounded-full bg-primary/8 blur-[120px]" />

        <div className="absolute inset-0 opacity-[0.035]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
        </div>
      </div>

      <Header />

      <section className="relative z-10 flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              به فرم‌ساز خوش آمدید
            </h1>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-muted">
              برای مدیریت فرم‌ها و مشاهده پاسخ‌ها وارد حساب کاربری خود شوید.
            </p>
          </div>

          <LoginForm />

          <p className="mt-6 text-center text-xs text-muted">
            فرم‌ساز · مدیریت ساده و حرفه‌ای فرم‌ها
          </p>
        </div>
      </section>
    </main>
  );
}
