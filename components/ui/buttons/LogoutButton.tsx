"use client";
import { useRouter } from "next/navigation";
import { Logout } from "iconsax-reactjs";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/logout", {
      method: "POST",
    });

    router.push("/");
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="flex size-10 cursor-pointer items-center justify-center rounded-full border border-border bg-surface transition-colors hover:bg-foreground/10"
    >
      <Logout className="-scale-x-100" size={20} />
    </button>
  );
}
