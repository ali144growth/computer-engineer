import React from 'react';

export function CircuitBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Base deep background */}
      <div className="absolute inset-0 bg-[#0A0E14]" />

      {/* Extremely faint circuit & grid lines texture */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.035]"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <defs>
          {/* Subtle grid pattern */}
          <pattern
            id="circuit-grid"
            width="64"
            height="64"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 64 0 L 0 0 0 64"
              fill="none"
              stroke="#4CE0D2"
              strokeWidth="0.8"
            />
            {/* PCB Trace node points */}
            <circle cx="0" cy="0" r="1.5" fill="#4CE0D2" />
            <circle cx="64" cy="0" r="1.5" fill="#4CE0D2" />
            <circle cx="0" cy="64" r="1.5" fill="#4CE0D2" />
            <circle cx="32" cy="32" r="1" fill="#4CE0D2" />
          </pattern>

          {/* Micro circuit trace diagonal */}
          <pattern
            id="circuit-traces"
            width="256"
            height="256"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 32 32 L 64 32 L 96 64 L 160 64 L 192 32 L 224 32"
              fill="none"
              stroke="#4CE0D2"
              strokeWidth="1"
            />
            <path
              d="M 64 128 L 128 128 L 160 160 L 160 224"
              fill="none"
              stroke="#4CE0D2"
              strokeWidth="1"
            />
            <path
              d="M 192 128 L 224 160 L 224 192 L 192 224"
              fill="none"
              stroke="#4CE0D2"
              strokeWidth="1"
            />
            <circle cx="32" cy="32" r="2.5" fill="#4CE0D2" />
            <circle cx="224" cy="32" r="2.5" fill="#4CE0D2" />
            <circle cx="160" cy="224" r="2.5" fill="#4CE0D2" />
            <rect x="62" y="126" width="4" height="4" fill="#4CE0D2" />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#circuit-grid)" />
        <rect width="100%" height="100%" fill="url(#circuit-traces)" />
      </svg>

      {/* Subtle radial falloff for natural depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,transparent_0%,#0A0E14_85%)] opacity-80" />
    </div>
  );
}
