import React from "react";

export default function DiscoMateLogo({ size = 64 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main chat bubble */}
      <rect
        x="8"
        y="12"
        width="48"
        height="36"
        rx="18"
        fill="#5865F2"
        stroke="#404EED"
        strokeWidth="2"
      />
      {/* Bot face */}
      <ellipse
        cx="32"
        cy="30"
        rx="10"
        ry="9"
        fill="#fff"
      />
      {/* Eyes */}
      <circle cx="28" cy="30" r="1.5" fill="#5865F2" />
      <circle cx="36" cy="30" r="1.5" fill="#5865F2" />
      {/* Smile */}
      <path
        d="M29 34c1.5 1 4.5 1 6 0"
        stroke="#5865F2"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Antenna */}
      <rect
        x="30.5"
        y="8"
        width="3"
        height="8"
        rx="1.5"
        fill="#404EED"
      />
      <circle cx="32" cy="8" r="2" fill="#5865F2" stroke="#404EED" strokeWidth="1" />
      {/* Text (optional, can remove if you want just the icon) */}
      <text
        x="32"
        y="58"
        textAnchor="middle"
        fontFamily="'Segoe UI', 'Arial', sans-serif"
        fontWeight="bold"
        fontSize="10"
        fill="#fff"
        letterSpacing="1"
      >
        DiscoMate
      </text>
    </svg>
  );
} 