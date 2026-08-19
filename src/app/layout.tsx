import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/unbounded";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n";
import { StoreProvider } from "@/lib/store";
import { Header, Footer } from "@/components/Header";

export const metadata: Metadata = {
  // Short enough to survive a browser tab. The long pitch lives in the
  // description and the Open Graph card, where there is room for it.
  title: "Brain — Study Together",
  description:
    "Диагностика пробелов за 15 минут, личный план подготовки по дням, тренажёр SAT и IELTS. Бесплатная платформа для школьников Казахстана, 7–12 классы.",
  applicationName: "Brain",
  keywords: ["ЕНТ", "SAT", "IELTS", "подготовка", "математика", "Казахстан", "олимпиада", "ҰБТ", "brain"],
  openGraph: {
    title: "Brain — Study Together",
    description: "Находит пробелы, строит план по дням и ведёт до мок-теста. ЕНТ, SAT и IELTS.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#14161a",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className="grain antialiased min-h-screen flex flex-col">
        <I18nProvider>
          <StoreProvider>
            <Header />
            <main className="flex-1 pt-16">{children}</main>
            <Footer />
          </StoreProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
