import Link from "next/link";
import { cookies } from "next/headers";
import ThemeToggle from "@/components/ui/buttons/ThemeToggle";
import LogoutButton from "@/components/ui/buttons/LogoutButton";

export default async function Header() {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.get("auth")?.value === "true";

  return (
    <header className="relative z-10 flex items-center justify-between px-6 py-6 sm:px-10 sm:py-8 lg:px-14 lg:py-10">
      <Link href="/" className="flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-sm font-bold text-white">
          ف
        </div>

        <span className="text-lg font-bold tracking-tight">فرم‌ساز</span>
      </Link>

      <div className="flex items-center gap-2">
        <ThemeToggle />

        {isLoggedIn && <LogoutButton />}
      </div>
    </header>
  );
}
