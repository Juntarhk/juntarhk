/**
 * Google Analytics 4 initialisation.
 *
 * Uses import.meta.env.VITE_GA4_ID so Vite substitutes the real value at
 * build time and returns `undefined` (not a truthy literal string) when the
 * variable is absent. Calling this when the variable is unset is a complete
 * no-op — no script is injected and no network request is made.
 */
export function initGA4(): void {
  const id: string | undefined = import.meta.env.VITE_GA4_ID;
  if (!id) return;

  // Bootstrap dataLayer and the gtag dispatcher before the async script loads.
  window.dataLayer = window.dataLayer ?? [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  window.gtag = function (...args: any[]) {
    window.dataLayer!.push(args);
  };

  window.gtag("js", new Date());
  window.gtag("config", id);

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(script);
}
