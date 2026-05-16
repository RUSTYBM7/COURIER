interface AirpakLogoProps {
  size?: number;
  className?: string;
}

export function AirpakLogo({ size = 28, className }: AirpakLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <rect width="32" height="32" rx="6" fill="#007AFF" />
      <path d="M8 16h16M16 8v16" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="16" cy="16" r="6" fill="none" stroke="white" strokeWidth="2" />
    </svg>
  );
}
