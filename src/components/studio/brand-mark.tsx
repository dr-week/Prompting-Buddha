export function BrandMark({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2.5" y="2.5" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
      <rect x="14.5" y="2.5" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
      <rect x="2.5" y="14.5" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M14.5 16h7M14.5 20h4.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      <path d="M11.5 6h1M6 11.5v1M18 11.5v1M11.5 18h1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
