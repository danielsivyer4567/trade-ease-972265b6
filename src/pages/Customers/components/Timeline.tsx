import React, { useState, useEffect } from "react";
import { JourneyStageCard } from "./JourneyStageCard";
// import { User, FileText, CheckCircle, Briefcase, Package } from "lucide-react"; // Icons are now part of WorkflowStep
import { motion } from "framer-motion";
import type { WorkflowStep } from '../CustomerPortfolio'; // Import WorkflowStep type

// Remove hardcoded stages array, it will come from props
// const stages = [ ... ];

interface TimelineProps {
  steps: WorkflowStep[];
  onStepAction: (stepId: string) => void;
}

// CSS for flashing animation - will be injected or added to a global CSS file.
// For now, let's define it here for clarity, though ideally it would be in a CSS file.
const flashingRedAnimation = `
  @keyframes flashingRed {
    0%, 100% { color: red; opacity: 1; }
    50% { color: red; opacity: 0.3; }
  }
  .flashing-hazard {
    font-size: 1.5em; /* Larger font for !! */
    font-weight: bold;
    animation: flashingRed 1s infinite;
    margin: 0 0.2em; /* Spacing around the !! */
  }
`;

export function Timeline({ steps, onStepAction }: TimelineProps) {
  // Ensure steps is not undefined or null before trying to findIndex
  const currentIdx = steps ? steps.findIndex((s) => s.status === "current") : -1;
  const [pulsingConnectorIndex, setPulsingConnectorIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!steps || currentIdx === -1 || steps.length <= 1) {
      setPulsingConnectorIndex(null);
      return;
    }

    // If current step is the last step, no upward connectors to pulse
    if (currentIdx >= steps.length - 1) {
      setPulsingConnectorIndex(null);
      return;
    }

    const firstConnectorIdxToPulse = currentIdx + 1;
    const lastConnectorIdxToPulse = steps.length - 1;

    setPulsingConnectorIndex(firstConnectorIdxToPulse); // Start with the first target connector

    const intervalId = setInterval(() => {
      setPulsingConnectorIndex(prev => {
        // This check might be redundant if initialized correctly and not set to null elsewhere
        if (prev === null) return firstConnectorIdxToPulse; 

        let nextIndex = prev + 1;
        // If nextIndex goes beyond the last connector for an upcoming step, loop back to the first one
        if (nextIndex > lastConnectorIdxToPulse) {
          nextIndex = firstConnectorIdxToPulse;
        }
        return nextIndex;
      });
    }, 2000);

    return () => clearInterval(intervalId);
  }, [currentIdx, steps]); // Depend on steps array itself, not just its length

  if (!steps || steps.length === 0) {
    return (
      <div className="relative flex flex-col items-center justify-center pt-3 pb-12 bg-slate-50 min-h-[300px] overflow-hidden">
        <h3 className="text-xl font-semibold mb-2 text-gray-700 text-center w-full">Customer Journey</h3>
        <div className="w-3/4 border-b border-gray-300 mb-8"></div>
        <p className="text-muted-foreground">No journey steps available.</p>
      </div>
    );
  }

  return (
    <>
      <style>{flashingRedAnimation}</style>
      <div className="relative flex justify-center pt-3 pb-12 bg-slate-50 min-h-screen overflow-hidden">
        {/* Static background image */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }} // Keep subtle opacity
          transition={{ duration: 1.5 }}
          className="absolute inset-0 z-0 grayscale"
          style={{
            backgroundImage: `url('/backgrounds/acropolis.png.png')`, // Set static image
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />

        {/* Main container for reversed timeline */}
        <div className="relative flex flex-col-reverse items-center w-80 z-10">
          {/* Subtitle and Border - remains unchanged */}
          <h3 className="text-xl font-semibold mt-8 mb-2 text-gray-700 text-center w-full">Customer Journey</h3>
          <div className="w-3/4 border-b border-gray-300 mb-8"></div>

          {/* Electric flow pulse - This needs careful re-evaluation for reversed order.
              For now, we might simplify or adjust its positioning based on 'currentIdx' from the original (non-reversed) array.
              If 'currentIdx' refers to the item that IS 'current', its position in the reversed flow will be (steps.length - 1 - currentIdx).
          */}
          {currentIdx !== -1 && (
            <div
              className="absolute left-1/2 -translate-x-1/2 z-10"
              style={{
                // Adjust 'top' for flex-col-reverse. If currentIdx is 0 (originally first), it's now last.
                // This calculation will need refinement based on card heights.
                // bottom: `calc(${(steps.length - 1 - currentIdx) * 8}rem + 2.5rem)`, // Example: position from bottom
                top: `calc(${currentIdx * 8}rem + 2.5rem)`, // Keeping original logic for now, might need inversion
                width: '0.75rem',
                height: '6rem',
              }}
            >
              <svg width="100%" height="100%" style={{ overflow: 'visible' }}>
                <defs>
                  <filter id="electric-flow-glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
                    <feColorMatrix in="blur" mode="matrix"
                      values="0 0 0 0 0.231  0 0 0 0 0.514  0 0 0 0 0.965  0 0 0 0.7 0" result="glowColor" /> 
                    <feMerge>
                      <feMergeNode in="glowColor"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                <line
                  x1="50%" y1="0%" x2="50%" y2="100%"
                  stroke="#3b82f6" strokeWidth="4" strokeDasharray="8 12"
                  filter="url(#electric-flow-glow)"
                  style={{ animation: 'electric-dash-move 1s linear infinite' }}
                />
              </svg>
            </div>
          )}

          {/* Stages and Connectors - Iterating through PROPS.steps */}
          {/* The .map order is fine, flex-col-reverse handles the visual order */}
          <div className="flex flex-col-reverse items-center w-full z-10"> {/* Outer container for items + connectors */}
            {steps.map((step, idx) => (
              <React.Fragment key={step.id}>
                {/* Connector Line: Rendered *before* the card in markup due to flex-col-reverse,
                    so it appears *above* the card visually.
                    It connects the current card to the one *below* it (which is idx - 1 in original array).
                */}
                {idx > 0 && ( // Don't render connector for the visually topmost (originally last) item
                  <div
                    className="relative h-32 w-full flex justify-center items-center"
                    style={{ pointerEvents: 'none', zIndex: 0 }}
                  >
                    <div
                      className="absolute"
                      style={{ width: '2px', height: '100%', zIndex: 0 }}
                    >
                      <svg width="100%" height="100%" style={{ overflow: "visible" }}>
                        <line
                          x1="50%" y1="0"
                          x2="50%" y2="100%"
                          stroke="#9ca3af"
                          strokeWidth="2"
                          strokeDasharray="4 6"
                          // Pulsing logic: pulse connector *above* current (visually top) in reverse order
                          // If current step is idx, its connector to the next (visually below) should pulse.
                          // The connector is between idx and idx+1.
                          // In reversed: connector is between card `idx` and card `idx-1` (original `idx+1`).
                          // `pulsingConnectorIndex` refers to the *card index* whose connector *below* it pulses.
                          // In reversed view, if `pulsingConnectorIndex` is `idx`, it's the connector for the card at `idx`.
                          className={pulsingConnectorIndex === idx ? 'animate-connector-pulse' : ''}
                        />
                      </svg>
                    </div>
                  </div>
                )}
                <div 
                  onClick={() => step.requiresAction && !step.isActioned && onStepAction(step.id)}
                  className={`relative cursor-${step.requiresAction && !step.isActioned ? 'pointer' : 'default'} transition-opacity duration-300`}
                  style={{ opacity: pulsingConnectorIndex === idx ? 0.5 : 1 }}
                >
                  {step.requiresAction && !step.isActioned && (
                    <div className="flex items-center justify-center text-center my-1">
                      <span className="flashing-hazard">!!</span>
                      <span className="text-sm font-medium text-red-600">ACTION REQUIRED</span>
                      <span className="flashing-hazard">!!</span>
                    </div>
                  )}

                  {/* Arrows for current step */}
                  {step.status === 'current' && (
                    <>
                      {/* Left Arrow (rotated to point right, near edge) */}
                      <svg
                        width="40"
                        height="40"
                        viewBox="0 0 40 40"
                        style={{
                          position: "absolute",
                          left: -80, // push further left, near edge
                          top: "50%",
                          transform: "translateY(-50%) rotate(180deg)",
                          zIndex: 11
                        }}
                      >
                        <polygon points="0,20 40,0 40,40" fill="black" />
                      </svg>

                      {/* Right Arrow (no flip, near edge) */}
                      <svg
                        width="40"
                        height="40"
                        viewBox="0 0 40 40"
                        style={{
                          position: "absolute",
                          right: -80, // push further right, near edge
                          top: "50%",
                          transform: "translateY(-50%)",
                          zIndex: 11
                        }}
                      >
                        <polygon points="0,20 40,0 40,40" fill="black" />
                      </svg>
                    </>
                  )}

                  <JourneyStageCard
                    icon={step.icon} // Pass icon from step data
                    title={step.title}
                    status={step.status}
                    date={step.date}
                    isCurrent={step.status === "current"}
                    // Pass requiresAction and isActioned if JourneyStageCard needs them for other styling
                    // requiresAction={step.requiresAction}
                    // isActioned={step.isActioned}
                  />
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </>
  );
} 