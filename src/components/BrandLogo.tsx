/** Erudite's typographic wordmark. */
export function BrandLogo({ className = "" }: { className?: string }) {
  return <span className={`brand-logo ${className}`}>
    <span className="brand-wordmark">erudite<span className="brand-period">.</span></span>
  </span>;
}
