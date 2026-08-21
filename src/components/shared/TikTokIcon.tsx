import React from 'react';

interface TikTokIconProps {
  className?: string;
  size?: number;
  colored?: boolean;
}

export default function TikTokIcon({ className = 'w-4 h-4', size, colored = true }: TikTokIconProps) {
  if (colored) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={size ? { width: size, height: size } : undefined}
      >
        {/* TikTok Authentic Cyan Layer */}
        <path
          d="M16.6 5.82s.51.5 0 0A4.28 4.28 0 0 1 12.55 2h-1.8v11.83a2.38 2.38 0 0 1-2.38 2.38 2.38 2.38 0 0 1-2.37-2.38 2.38 2.38 0 0 1 2.37-2.37c.39 0 .76.08 1.1.22V9.45a4.7 4.7 0 0 0-1.1-.13 4.67 4.67 0 0 0-4.67 4.68 4.67 4.67 0 0 0 4.67 4.68 4.67 4.67 0 0 0 4.68-4.68V8.34a6.54 6.54 0 0 0 3.65 1.1V7.15c-.4 0-1.25-.33-2.1-.98-.4-.32-.8-.8-1.02-1.33-.2-.5-.28-1.02-.28-1.02h.1z"
          fill="#25F4EE"
          transform="translate(-0.4, 0.4)"
        />
        {/* TikTok Authentic Neon Red/Magenta Layer */}
        <path
          d="M16.6 5.82s.51.5 0 0A4.28 4.28 0 0 1 12.55 2h-1.8v11.83a2.38 2.38 0 0 1-2.38 2.38 2.38 2.38 0 0 1-2.37-2.38 2.38 2.38 0 0 1 2.37-2.37c.39 0 .76.08 1.1.22V9.45a4.7 4.7 0 0 0-1.1-.13 4.67 4.67 0 0 0-4.67 4.68 4.67 4.67 0 0 0 4.67 4.68 4.67 4.67 0 0 0 4.68-4.68V8.34a6.54 6.54 0 0 0 3.65 1.1V7.15c-.4 0-1.25-.33-2.1-.98-.4-.32-.8-.8-1.02-1.33-.2-.5-.28-1.02-.28-1.02h.1z"
          fill="#FE2C55"
          transform="translate(0.4, -0.4)"
        />
        {/* TikTok Crisp Pure White Foreground */}
        <path
          d="M16.6 5.82s.51.5 0 0A4.28 4.28 0 0 1 12.55 2h-1.8v11.83a2.38 2.38 0 0 1-2.38 2.38 2.38 2.38 0 0 1-2.37-2.38 2.38 2.38 0 0 1 2.37-2.37c.39 0 .76.08 1.1.22V9.45a4.7 4.7 0 0 0-1.1-.13 4.67 4.67 0 0 0-4.67 4.68 4.67 4.67 0 0 0 4.67 4.68 4.67 4.67 0 0 0 4.68-4.68V8.34a6.54 6.54 0 0 0 3.65 1.1V7.15c-.4 0-1.25-.33-2.1-.98-.4-.32-.8-.8-1.02-1.33-.2-.5-.28-1.02-.28-1.02h.1z"
          fill="#FFFFFF"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { width: size, height: size } : undefined}
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.88 2.89 2.89 0 0 1-2.89-2.88 2.89 2.89 0 0 1 2.89-2.89c.47 0 .91.1 1.33.28V9.56a6.34 6.34 0 0 0-1.33-.14 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.75a8.28 8.28 0 0 0 4.96 1.63V6.93a4.84 4.84 0 0 1-1.2-.24z" />
    </svg>
  );
}
