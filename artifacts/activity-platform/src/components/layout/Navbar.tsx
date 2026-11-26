import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import logoWhite from "@assets/JUNTARHK_logo-2_white_1774785779222.png";
import logoColor from "@assets/JUNTARHK_logo-2_1774785779223.png";
import { useLanguage } from "@/contexts/LanguageContext";

interface NavbarProps {
  darkHero?: boolean;
}

export function Navbar({ darkHero = true }: NavbarProps) {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuDialogRef = useRef<HTMLDivElement>(null);
  const mobileMenuWasOpenRef = useRef(false);
  const [logoHeroOffset, setLogoHeroOffset] = useState(0);

  const useDark = isScrolled || !darkHero;

  // On the home page, when the split-screen hero is visible (not yet scrolled),
  // shift the logo so its left edge aligns with the left panel's content area
  // (which has px-12 = 48px padding from the viewport left edge). On wide screens
  // the container mx-auto centers the content, pushing the logo away from the 48px mark.
  const isHeroActive = location === "/" && !isScrolled;

  useEffect(() => {
    const measure = () => {
      if (!containerRef.current) return;
      // Only apply on md+ where the split-screen panel is visible
      if (window.innerWidth < 768) {
        setLogoHeroOffset(0);
        return;
      }
      const rect = containerRef.current.getBoundingClientRect();
      const paddingLeft = parseInt(getComputedStyle(containerRef.current).paddingLeft, 10) || 0;
      // Logo's natural left edge = container left edge + container padding-left
      const naturalLogoLeft = rect.left + paddingLeft;
      // Target: 48px from viewport left (same as left panel's px-12 content padding)
      setLogoHeroOffset(48 - naturalLogoLeft);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) {
      if (mobileMenuWasOpenRef.current) {
        mobileMenuButtonRef.current?.focus();
        mobileMenuWasOpenRef.current = false;
      }
      return;
    }

    mobileMenuWasOpenRef.current = true;
    const dialog = mobileMenuDialogRef.current;
    const focusableSelector =
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const focusFrame = requestAnimationFrame(() => {
      dialog?.querySelector<HTMLElement>(focusableSelector)?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setMobileMenuOpen(false);
        return;
      }

      if (event.key !== "Tab" || !dialog) return;

      const focusableElements = Array.from(
        dialog.querySelectorAll<HTMLElement>(focusableSelector),
      ).filter((element) => !element.hasAttribute("disabled"));
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (!firstElement || !lastElement) {
        event.preventDefault();
        dialog.focus();
      } else if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const NAV_LINKS = [
    { href: "/", label: t.nav.home },
    { href: "/photography", label: t.nav.photography },
    { href: "/ai-education", label: t.nav.aiEducation },
    { href: "/activities", label: t.nav.activities },
    { href: "/case-studies", label: t.nav.caseStudies },
    { href: "/corporate-team-building", label: t.nav.corporateTeamBuilding },
    { href: "/about", label: t.nav.about },
    { href: "/contact", label: t.nav.contact },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
          useDark ? "bg-white/95 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-4"
        }`}
      >
        <div ref={containerRef} className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo — in hero mode, shifts left to align with the split panel's content edge */}
            <Link
              href="/"
              data-testid="link-navbar-home"
              className="flex shrink-0 items-center group"
              style={{
                transform: isHeroActive ? `translateX(${logoHeroOffset}px)` : "translateX(0)",
                transition: "transform 0.5s ease-out",
              }}
            >
              <img
                src={useDark ? logoColor : logoWhite}
                alt="JuntarHK"
                className="h-16 w-auto object-contain group-hover:scale-105 transition-transform drop-shadow"
              />
            </Link>

            {/* Desktop Nav */}
            <nav
              data-testid="nav-desktop"
              className={`hidden 2xl:flex min-w-0 items-center gap-0.5 px-2 py-1.5 rounded-full border shadow-sm backdrop-blur-md transition-colors ${useDark ? "bg-white/50 border-border/50" : "bg-black/20 border-white/10"}`}
            >
              {NAV_LINKS.map((link) => {
                const isActive = location === link.href || (link.href !== "/" && location.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    data-testid={`link-desktop-nav-${link.href === "/" ? "home" : link.href.slice(1)}`}
                    className={`relative px-3 py-2 rounded-full text-[13px] font-semibold leading-none transition-colors whitespace-nowrap ${
                      isActive
                        ? "text-primary-foreground"
                        : useDark ? "text-foreground/70 hover:text-foreground" : "text-white/80 hover:text-white"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute inset-0 bg-primary rounded-full -z-10 shadow-sm"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* CTA + Language toggle + Mobile toggle */}
            <div className="flex shrink-0 items-center gap-2">
              {/* Language toggle */}
              <button
                onClick={() => setLang(lang === "zh" ? "en" : "zh")}
                data-testid="button-language-desktop"
                className={`hidden 2xl:flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                  useDark
                    ? "border-border text-foreground/70 hover:text-[#1A3D4A] hover:border-[#1A3D4A]"
                    : "border-white/30 text-white/80 hover:text-white hover:border-white"
                }`}
                title={lang === "zh" ? "Switch to English" : "切換至中文"}
              >
                {lang === "zh" ? "EN" : "中"}
              </button>

              <Button asChild className="hidden 2xl:flex rounded-full px-5 font-bold whitespace-nowrap shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all hover:-translate-y-0.5">
                <Link href="/contact" data-testid="link-navbar-enquire">{t.nav.enquire}</Link>
              </Button>

              <button
                ref={mobileMenuButtonRef}
                onClick={() => setMobileMenuOpen(true)}
                aria-label={lang === "zh" ? "開啟導覽選單" : "Open navigation menu"}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-navigation-menu"
                data-testid="button-open-mobile-menu"
                className={`p-2 -mr-2 2xl:hidden rounded-full transition-colors ${useDark ? "text-foreground hover:bg-muted" : "text-white hover:bg-white/20"}`}
              >
                <Menu aria-hidden="true" className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 2xl:hidden"
            />
            <motion.div
              ref={mobileMenuDialogRef}
              id="mobile-navigation-menu"
              role="dialog"
              aria-modal="true"
              aria-labelledby="mobile-navigation-title"
              tabIndex={-1}
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              data-testid="nav-mobile"
              className="fixed top-0 right-0 bottom-0 w-[80%] max-w-sm bg-background border-l border-border shadow-2xl z-50 flex flex-col 2xl:hidden"
            >
              <div className="p-6 flex items-center justify-between border-b border-border/50">
                <span id="mobile-navigation-title" className="font-display font-bold text-lg">{t.nav.menu}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setLang(lang === "zh" ? "en" : "zh")}
                    data-testid="button-language-mobile"
                    className="px-3 py-1 rounded-full text-xs font-bold border border-border text-muted-foreground hover:text-[#1A3D4A] hover:border-[#1A3D4A] transition-colors"
                  >
                    {lang === "zh" ? "EN" : "中"}
                  </button>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label={lang === "zh" ? "關閉導覽選單" : "Close navigation menu"}
                    aria-expanded={mobileMenuOpen}
                    aria-controls="mobile-navigation-menu"
                    data-testid="button-close-mobile-menu"
                    className="p-2 -mr-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
                  >
                    <X aria-hidden="true" className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-4 flex-1 overflow-y-auto flex flex-col gap-2">
                {NAV_LINKS.map((link) => {
                  const isActive = location === link.href || (link.href !== "/" && location.startsWith(link.href));
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      data-testid={`link-mobile-nav-${link.href === "/" ? "home" : link.href.slice(1)}`}
                      className={`flex items-center gap-3 px-4 py-4 rounded-xl text-base font-semibold transition-all ${
                        isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>

              <div className="p-6 border-t border-border/50">
                <Button asChild className="w-full rounded-xl py-6 text-lg font-bold shadow-md shadow-primary/20">
                  <Link href="/contact" onClick={() => setMobileMenuOpen(false)} data-testid="link-mobile-enquire">
                    {t.nav.enquire}
                  </Link>
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
