"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);

    const formData = new FormData(event.currentTarget);

    const username = formData.get("username");
    const password = formData.get("password");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!response.ok) {
        toast.error("نام کاربری یا رمز عبور اشتباه است.");
        return;
      }

      toast.success("با موفقیت وارد شدید.");

      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error("خطایی رخ داد. دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-border bg-surface/90 p-6 backdrop-blur-xl sm:p-8"
    >
      <h2 className="mb-8 text-xl font-semibold">ورود به حساب</h2>
      <div className="space-y-5">
        <div>
          <label htmlFor="username" className="mb-2 block text-sm font-medium">
            نام کاربری
          </label>

          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            placeholder="نام کاربری خود را وارد کنید"
            className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition-all placeholder:text-muted/60 focus:border-primary"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-medium">
            رمز عبور
          </label>

          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="رمز عبور خود را وارد کنید"
            className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition-all placeholder:text-muted/60 focus:border-primary"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="h-12 w-full cursor-pointer rounded-xl bg-primary px-5 text-sm font-semibold text-white transition-all hover:bg-primary-hover active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "در حال ورود..." : "ورود به پنل"}
        </button>
      </div>
    </form>
  );
}
