"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import type { Lang } from "@/lib/types";
import { IconClose, IconMail, IconMenu, IconTelegram, LogoMark, Wordmark } from "./Icons";

const LANGS: { code: Lang; short: string; full: string }[] = [
  { code: "ru", short: "RU", full: "Русский" },
  { code: "kk", short: "KZ", full: "Қазақша" },
  { code: "en", short: "EN", full: "English" },
];

export function LangSwitch({ compact = false }: { compact?: boolean }) {
  const { lang, setLang } = useI18n();
  return (
    <div className={`inline-flex items-center rounded-full border border-line bg-mist p-0.5 ${compact ? "" : "gap-0.5"}`}>
      {LANGS.map((l) => (
        <button
          key={l.code}
          onClick={() => setLang(l.code)}
          aria-label={l.full}
          aria-pressed={lang === l.code}
          className={`press rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide transition-colors ${
            lang === l.code ? "bg-brand text-paper" : "text-mute hover:text-ink"
          }`}
        >
          {l.short}
        </button>
      ))}
    </div>
  );
}

export function Header() {
  const { d } = useI18n();
  const { user, role, switchRole } = useStore();
  const path = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [path]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Navigation follows the role: a parent has no reason to see the league,
  // and a teacher has no student dashboard.
  const links =
    role === "teacher"
      ? [{ href: "/teacher", label: d.teacher.title }]
      : role === "parent"
        ? [{ href: "/parent", label: d.parent.title }]
        : role === "student"
          ? [
              { href: "/dashboard", label: d.nav.dashboard },
              { href: "/plan", label: d.nav.plan },
              // The exam trainer only appears for the goal it belongs to — a UNT
              // student has no use for a SAT tab, and the bar is already full.
              ...(user?.goal === "sat" ? [{ href: "/sat", label: d.exam.satTitle }] : []),
              ...(user?.goal === "ielts" ? [{ href: "/ielts", label: d.exam.ieltsTitle }] : []),
              { href: "/assistant", label: d.assistant.title },
              { href: "/inbox", label: d.inbox.title },
              { href: "/league", label: d.nav.leaderboard },
            ]
          : [];

  const isActive = (href: string) => path === href || path.startsWith(href + "/");

  const onSwitchRole = () => {
    switchRole();
    router.push("/start");
  };

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          solid ? "bg-bone/80 backdrop-blur-xl border-b border-line" : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 press shrink-0" aria-label="brain">
            <LogoMark size={30} />
            <Wordmark size={21} />
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`px-3 py-2 rounded-xl text-[13.5px] font-medium whitespace-nowrap transition-colors ${
                  isActive(l.href) ? "text-ink bg-ink/7" : "text-mute hover:text-ink hover:bg-ink/5"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <div className="hidden sm:block">
              <LangSwitch />
            </div>
            {role === "student" && user ? (
              <Link
                href="/profile"
                className="hidden sm:flex items-center gap-2 rounded-full border border-line bg-mist pl-1 pr-3 py-1 press hover:border-line2"
              >
                <span className="grid h-7 w-7 place-items-center rounded-full bg-brand text-paper text-xs font-extrabold">
                  {user.name.slice(0, 1).toUpperCase()}
                </span>
                <span className="text-xs font-semibold tabular-nums">{user.elo}</span>
              </Link>
            ) : role ? (
              <button
                onClick={onSwitchRole}
                className="hidden sm:inline-flex press items-center h-9 px-3.5 rounded-xl border border-line2 text-[12.5px] font-semibold text-mute hover:border-brand hover:text-brand"
              >
                {d.roles.switch}
              </button>
            ) : (
              <Link
                href="/start"
                className="hidden sm:inline-flex press shine items-center h-9 px-4 rounded-xl bg-ink text-paper text-[13px] font-bold hover:bg-[#2b2619]"
              >
                {d.nav.start}
              </Link>
            )}
            <button
              className="md:hidden text-ink press p-1.5 -mr-1.5"
              onClick={() => setOpen((v) => !v)}
              aria-label="menu"
              aria-expanded={open}
            >
              {open ? <IconClose size={24} /> : <IconMenu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-40 md:hidden bg-bone pt-16">
          <div className="px-4 py-6 flex flex-col gap-1">
            {[{ href: "/", label: d.nav.home }, ...links].map((l, i) => (
              <Link
                key={l.href}
                href={l.href}
                className="slide-up flex items-center justify-between px-4 py-4 rounded-2xl text-lg font-display font-bold border border-line bg-card"
                style={{ animationDelay: `${i * 45}ms` }}
              >
                {l.label}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M4.5 12h14M13 6.5l5.5 5.5L13 17.5" stroke="#ff6b1f" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            ))}
            <div className="mt-4 flex items-center justify-between px-1">
              <LangSwitch />
              {role ? (
                <button onClick={onSwitchRole} className="press inline-flex h-11 items-center rounded-2xl border border-line2 px-4 font-bold text-mute">
                  {d.roles.switch}
                </button>
              ) : (
                <Link href="/start" className="press inline-flex items-center h-11 px-5 rounded-2xl bg-brand text-ink font-bold">
                  {d.nav.start}
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function Footer() {
  const { d } = useI18n();
  return (
    <footer className="border-t border-line mt-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <div className="flex flex-col sm:flex-row gap-8 sm:items-start justify-between">
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5 mb-3">
              <LogoMark size={28} />
              <Wordmark size={20} />
            </div>
            <p className="text-sm text-dim leading-relaxed">
              {d.landing.footer.made} · {d.landing.footer.forWho}
            </p>

            {/* quiet contact marks that come forward on hover */}
            <div className="mt-5 flex items-center gap-3">
              <a
                href="https://t.me/brainstudyAI"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-mark inline-flex items-center gap-2 text-mute"
                aria-label="Telegram @brainstudyAI"
              >
                <IconTelegram size={20} />
                <span className="text-[13px] font-semibold">@brainstudyAI</span>
              </a>
              <a
                href="mailto:brainstudywithus@gmail.com"
                className="contact-mark inline-flex items-center gap-2 text-mute"
                aria-label="brainstudywithus@gmail.com"
              >
                <IconMail size={20} />
                <span className="text-[13px] font-semibold">@brainstudywithus</span>
              </a>
            </div>
          </div>
          <div className="flex gap-12">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-dim mb-3">
                {d.landing.footer.product}
              </div>
              <div className="flex flex-col gap-2 text-sm">
                <Link href="/dashboard" className="text-mute hover:text-brand transition-colors">{d.nav.dashboard}</Link>
                <Link href="/league" className="text-mute hover:text-brand transition-colors">{d.nav.leaderboard}</Link>
                <Link href="/teacher" className="text-mute hover:text-brand transition-colors">{d.nav.teacher}</Link>
                <Link href="/parent" className="text-mute hover:text-brand transition-colors">{d.nav.parent}</Link>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-line flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
          <span className="text-xs text-dim">© {d.landing.footer.rights}</span>
          <LangSwitch />
        </div>
      </div>
    </footer>
  );
}
