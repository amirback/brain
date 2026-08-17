import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/unbounded";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n";
import { StoreProvider } from "@/lib/store";
import { Header, Footer } from "@/components/Header";

export const metadata: Metadata = {
  title: "brain — репетитор, который знает, чего ты не знаешь",
  description:
    "Диагностика пробелов за 15 минут, личный план, прогноз балла ЕНТ и ELO-рейтинг. Бесплатная платформа для школьников Казахстана, 7–12 классы.",
  applicationName: "brain",
  keywords: ["ЕНТ", "подготовка", "математика", "Казахстан", "олимпиада", "ҰБТ", "brain"],
  openGraph: {
    title: "brain — репетитор, который знает, чего ты не знаешь",
    description: "Диагностика пробелов, личный план, прогноз балла ЕНТ и ELO-рейтинг.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
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
