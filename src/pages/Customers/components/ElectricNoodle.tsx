import React from "react";

interface ElectricNoodleProps {
  from: { x: number; y: number };
  to: { x: number; y: number };
  isActive?: boolean;
}

export const ElectricNoodle: React.FC<ElectricNoodleProps> = ({ from, to, isActive = true }) => {
  const controlY = (from.y + to.y) / 2;
  const path = `M${from.x},${from.y} C${from.x},${controlY} ${to.x},${controlY} ${to.x},${to.y}`;

  return (
    <svg
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        pointerEvents: "none",
        width: "100%",
        height: "100%",
        overflow: "visible",
        zIndex: 2,
        border: "2px dashed red",
      }}
    >
      <defs>
        <filter id="electric-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
          <feColorMatrix in="blur" mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 2 -0.5" result="glow" />
          <feBlend in="SourceGraphic" in2="glow" mode="lighter" />
        </filter>
      </defs>
      <path
        d={path}
        stroke="red"
        strokeWidth={5}
        fill="none"
        strokeDasharray="14 10"
        style={{
          animation: isActive ? "dash-move 1.2s linear infinite" : "none",
          strokeLinejoin: "round",
        }}
      />
      <style>
        {`
          @keyframes dash-move {
            to {
              stroke-dashoffset: -24;
            }
          }
        `}
      </style>
    </svg>
  );
}; 