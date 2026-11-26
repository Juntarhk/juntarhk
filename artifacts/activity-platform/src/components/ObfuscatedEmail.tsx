import { useEffect, useState } from "react";

interface ObfuscatedEmailProps {
  user: string;
  domain: string;
  className?: string;
  subject?: string;
  display?: string;
}

export function ObfuscatedEmail({
  user,
  domain,
  className,
  subject,
  display,
}: ObfuscatedEmailProps) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    setRevealed(true);
  }, []);

  if (!revealed) {
    return (
      <span
        className={className}
        aria-label={`${user} at ${domain}`}
        data-obfuscated="email"
      >
        {user}
        <span aria-hidden="true">{" "}[at]{" "}</span>
        {domain}
      </span>
    );
  }

  const address = `${user}@${domain}`;
  const href = subject
    ? `mailto:${address}?subject=${encodeURIComponent(subject)}`
    : `mailto:${address}`;

  return (
    <a href={href} className={className}>
      {display ?? address}
    </a>
  );
}
