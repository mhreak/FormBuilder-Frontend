import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ThemeProvider from "@/components/providers/ThemeProvider";
import { Toaster } from "react-hot-toast";

const yekanBakh = localFont({
  src: [
    {
      path: "../assets/fonts/yekan-bakh/YekanBakh-Thin.ttf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../assets/fonts/yekan-bakh/YekanBakh-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../assets/fonts/yekan-bakh/YekanBakh-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/yekan-bakh/YekanBakh-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../assets/fonts/yekan-bakh/YekanBakh-Bold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../assets/fonts/yekan-bakh/YekanBakh-Heavy.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../assets/fonts/yekan-bakh/YekanBakh-Fat.ttf",
      weight: "800",
      style: "normal",
    },
  ],
});

export const metadata: Metadata = {
  title: "فرم‌ساز | Form Saz",
  description: "فرم‌ساز، برای تولید فرم‌های پویا و زیبا!",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${yekanBakh.className} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh flex flex-col font-medium">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster position="top-center" reverseOrder={false} />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
