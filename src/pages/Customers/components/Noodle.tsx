import React from 'react';

interface NoodleProps {
  from: { x: number; y: number };
  to: { x: number; y: number };
  isActive: boolean;
}

const Noodle: React.FC<NoodleProps> = ({ from, to, isActive }) => {
  // Compute Bezier curve path
  const controlPointOffset = Math.abs(to.x - from.x) / 2;
  const path = `
    M ${from.x},${from.y}
    C ${from.x + controlPointOffset},${from.y}
      ${to.x - controlPointOffset},${to.y}
      ${to.x},${to.y}
  `;

  return (
    <svg style={{ overflow: 'visible', position: 'absolute' }}>
      <defs>
        <linearGradient id="pulseGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00f" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#0ff" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#00f" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      <path
        d={path}
        stroke={isActive ? 'url(#pulseGradient)' : '#ccc'}
        strokeWidth="4"
        fill="none"
        strokeDasharray={isActive ? '8 12' : '0'}
        style={{
          animation: isActive ? 'pulse-move 1.2s linear infinite' : 'none'
        }}
      />

      <style>
        {`
          @keyframes pulse-move {
            0% {
              stroke-dashoffset: 0;
            }
            100% {
              stroke-dashoffset: -20;
            }
          }
        `}
      </style>
    </svg>
  );
};

export default Noodle; 