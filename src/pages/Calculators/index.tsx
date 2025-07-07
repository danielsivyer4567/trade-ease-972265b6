import React from "react";
import { AppLayout } from "@/components/ui/AppLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { Calculator, Percent, Gauge, Ruler, Construction, Compass, ArrowUpDown, Square, FileCode, Hammer, Brush, Home, FileText, FileCheck, Zap, Droplets, Shield, AlertTriangle } from "lucide-react";

import { Link } from "react-router-dom";
import { SectionHeader } from "@/components/ui/SectionHeader";

const HardHatIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 animate-pulse"
  >
    {/* Hard hat brim/visor */}
    <ellipse 
      cx="12" 
      cy="17" 
      rx="10" 
      ry="2" 
      fill="#FFF" 
      stroke="#333" 
      strokeWidth="1.5"
    />
    
    {/* Hard hat main body */}
    <path
      d="M4 17c0-4.4 3.6-8 8-8s8 3.6 8 8"
      fill="#FFF"
      stroke="#333"
      strokeWidth="2"
    />
    
    {/* Hard hat top ridge */}
    <path
      d="M6 15c0-3.3 2.7-6 6-6s6 2.7 6 6"
      fill="none"
      stroke="#666"
      strokeWidth="1"
    />
    
    {/* Hard hat crown/top */}
    <path
      d="M8 13c0-2.2 1.8-4 4-4s4 1.8 4 4"
      fill="none"
      stroke="#999"
      strokeWidth="0.8"
    />
    
    {/* Side reinforcement points */}
    <circle cx="6.5" cy="15.5" r="1" fill="#333"/>
    <circle cx="17.5" cy="15.5" r="1" fill="#333"/>
    
    {/* Center logo/emblem area with animation */}
    <circle cx="12" cy="13" r="1.5" fill="none" stroke="#666" strokeWidth="1"/>
    <g transform-origin="12 13">
      <animateTransform
        attributeName="transform"
        attributeType="XML"
        type="rotate"
        values="0 12 13;360 12 13"
        dur="4s"
        repeatCount="indefinite"
      />
      <circle cx="12" cy="13" r="0.8" fill="#E5E5E5"/>
      <rect x="11.5" y="12.5" width="1" height="1" fill="#666"/>
    </g>
    
    {/* Animated construction sparkles */}
    <g opacity="0">
      <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite"/>
      <circle cx="8" cy="11" r="0.3" fill="#FFD700"/>
      <circle cx="16" cy="12" r="0.3" fill="#FFD700"/>
      <circle cx="10" cy="9" r="0.3" fill="#FFD700"/>
    </g>
  </svg>
);

const PropertyBoundaryIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-blue-600 animate-pulse"
  >
    {/* Property boundary outline - animated drawing */}
    <path
      d="M6 8 L24 8 L24 22 L6 22 Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeDasharray="60"
      strokeDashoffset="60"
    >
      <animate
        attributeName="stroke-dashoffset"
        values="60;0;60"
        dur="3s"
        repeatCount="indefinite"
      />
    </path>
    
    {/* Corner markers with enhanced animation */}
    <circle cx="6" cy="8" r="1.5" fill="currentColor" opacity="0">
      <animate attributeName="opacity" values="0;1;0" dur="3s" begin="0.5s" repeatCount="indefinite"/>
      <animate attributeName="r" values="1.5;2;1.5" dur="3s" begin="0.5s" repeatCount="indefinite"/>
    </circle>
    <circle cx="24" cy="8" r="1.5" fill="currentColor" opacity="0">
      <animate attributeName="opacity" values="0;1;0" dur="3s" begin="1s" repeatCount="indefinite"/>
      <animate attributeName="r" values="1.5;2;1.5" dur="3s" begin="1s" repeatCount="indefinite"/>
    </circle>
    <circle cx="24" cy="22" r="1.5" fill="currentColor" opacity="0">
      <animate attributeName="opacity" values="0;1;0" dur="3s" begin="1.5s" repeatCount="indefinite"/>
      <animate attributeName="r" values="1.5;2;1.5" dur="3s" begin="1.5s" repeatCount="indefinite"/>
    </circle>
    <circle cx="6" cy="22" r="1.5" fill="currentColor" opacity="0">
      <animate attributeName="opacity" values="0;1;0" dur="3s" begin="2s" repeatCount="indefinite"/>
      <animate attributeName="r" values="1.5;2;1.5" dur="3s" begin="2s" repeatCount="indefinite"/>
    </circle>
    
    {/* Measurement lines with enhanced animation */}
    <g opacity="0">
      <animate attributeName="opacity" values="0;1;1;0" dur="3s" begin="2.5s" repeatCount="indefinite"/>
      
      {/* Top measurement */}
      <line x1="6" y1="6" x2="24" y2="6" stroke="currentColor" strokeWidth="1"/>
      <line x1="6" y1="5" x2="6" y2="7" stroke="currentColor" strokeWidth="1"/>
      <line x1="24" y1="5" x2="24" y2="7" stroke="currentColor" strokeWidth="1"/>
      <text x="15" y="4" fontSize="3" fill="currentColor" textAnchor="middle">25m</text>
      
      {/* Right measurement */}
      <line x1="26" y1="8" x2="26" y2="22" stroke="currentColor" strokeWidth="1"/>
      <line x1="25" y1="8" x2="27" y2="8" stroke="currentColor" strokeWidth="1"/>
      <line x1="25" y1="22" x2="27" y2="22" stroke="currentColor" strokeWidth="1"/>
      <text x="29" y="16" fontSize="3" fill="currentColor" textAnchor="middle">15m</text>
    </g>
    
    {/* Survey compass indicator with rotation */}
    <g transform="translate(28,4)" opacity="0">
      <animate attributeName="opacity" values="0;1;1;0" dur="3s" begin="1s" repeatCount="indefinite"/>
      <circle cx="0" cy="0" r="2" fill="none" stroke="currentColor" strokeWidth="0.5"/>
      <g transform-origin="0 0">
        <animateTransform
          attributeName="transform"
          attributeType="XML"
          type="rotate"
          values="0 0 0;360 0 0"
          dur="8s"
          repeatCount="indefinite"
        />
        <path d="M0,-1.5 L0.5,1 L0,0.5 L-0.5,1 Z" fill="currentColor"/>
      </g>
      <text x="0" y="3.5" fontSize="2.5" fill="currentColor" textAnchor="middle">N</text>
    </g>
  </svg>
);

const TimberPicketIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="text-yellow-600 animate-pulse"
  >
    {/* Horizontal rails */}
    <line x1="2" y1="14" x2="30" y2="14" stroke="currentColor" strokeWidth="1.5"/>
    <line x1="2" y1="22" x2="30" y2="22" stroke="currentColor" strokeWidth="1.5"/>
    
    {/* Colonial pine pickets with swaying animation */}
    <g transform-origin="5.25 18">
      <animateTransform
        attributeName="transform"
        attributeType="XML"
        type="rotate"
        values="0 5.25 18;2 5.25 18;0 5.25 18;-2 5.25 18;0 5.25 18"
        dur="4s"
        repeatCount="indefinite"
      />
      <rect x="4" y="10" width="2.5" height="16" fill="currentColor" rx="0.5"/>
      <circle cx="5.25" cy="10" r="1.25" fill="currentColor"/>
    </g>
    
    <g transform-origin="9.75 17">
      <animateTransform
        attributeName="transform"
        attributeType="XML"
        type="rotate"
        values="0 9.75 17;-2 9.75 17;0 9.75 17;2 9.75 17;0 9.75 17"
        dur="4.5s"
        repeatCount="indefinite"
      />
      <rect x="8.5" y="8" width="2.5" height="18" fill="currentColor" rx="0.5"/>
      <circle cx="9.75" cy="8" r="1.25" fill="currentColor"/>
    </g>
    
    <g transform-origin="14.25 18">
      <animateTransform
        attributeName="transform"
        attributeType="XML"
        type="rotate"
        values="0 14.25 18;1.5 14.25 18;0 14.25 18;-1.5 14.25 18;0 14.25 18"
        dur="3.8s"
        repeatCount="indefinite"
      />
      <rect x="13" y="10" width="2.5" height="16" fill="currentColor" rx="0.5"/>
      <circle cx="14.25" cy="10" r="1.25" fill="currentColor"/>
    </g>
    
    <g transform-origin="18.75 17">
      <animateTransform
        attributeName="transform"
        attributeType="XML"
        type="rotate"
        values="0 18.75 17;-1.8 18.75 17;0 18.75 17;1.8 18.75 17;0 18.75 17"
        dur="4.2s"
        repeatCount="indefinite"
      />
      <rect x="17.5" y="8" width="2.5" height="18" fill="currentColor" rx="0.5"/>
      <circle cx="18.75" cy="8" r="1.25" fill="currentColor"/>
    </g>
    
    <g transform-origin="23.25 18">
      <animateTransform
        attributeName="transform"
        attributeType="XML"
        type="rotate"
        values="0 23.25 18;2.2 23.25 18;0 23.25 18;-2.2 23.25 18;0 23.25 18"
        dur="3.5s"
        repeatCount="indefinite"
      />
      <rect x="22" y="10" width="2.5" height="16" fill="currentColor" rx="0.5"/>
      <circle cx="23.25" cy="10" r="1.25" fill="currentColor"/>
    </g>
    
    <g transform-origin="27.75 17">
      <animateTransform
        attributeName="transform"
        attributeType="XML"
        type="rotate"
        values="0 27.75 17;-2.5 27.75 17;0 27.75 17;2.5 27.75 17;0 27.75 17"
        dur="4.8s"
        repeatCount="indefinite"
      />
      <rect x="26.5" y="8" width="2.5" height="18" fill="currentColor" rx="0.5"/>
      <circle cx="27.75" cy="8" r="1.25" fill="currentColor"/>
    </g>
    
    {/* Wood grain effect lines */}
    <line x1="5" y1="12" x2="5" y2="24" stroke="currentColor" strokeWidth="0.3" opacity="0.4"/>
    <line x1="9.5" y1="10" x2="9.5" y2="24" stroke="currentColor" strokeWidth="0.3" opacity="0.4"/>
    <line x1="14" y1="12" x2="14" y2="24" stroke="currentColor" strokeWidth="0.3" opacity="0.4"/>
    <line x1="18.5" y1="10" x2="18.5" y2="24" stroke="currentColor" strokeWidth="0.3" opacity="0.4"/>
    <line x1="23" y1="12" x2="23" y2="24" stroke="currentColor" strokeWidth="0.3" opacity="0.4"/>
    <line x1="27.5" y1="10" x2="27.5" y2="24" stroke="currentColor" strokeWidth="0.3" opacity="0.4"/>
    
    {/* Animated wind effect */}
    <g opacity="0.3">
      <animate attributeName="opacity" values="0.3;0.6;0.3" dur="3s" repeatCount="indefinite"/>
      <path d="M2 6 Q8 4 12 6 Q16 8 20 6 Q24 4 30 6" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2"/>
    </g>
  </svg>
);

const CashPileIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-green-500 animate-pulse"
  >
    {/* Bottom dollar bill */}
    <rect x="3" y="14" width="18" height="7" rx="1" fill="currentColor" opacity="0.8" />
    <rect x="3" y="14" width="18" height="7" rx="1" fill="none" stroke="currentColor" strokeWidth="0.5" />
    <text x="12" y="18.5" fontSize="4" fill="#fff" textAnchor="middle" fontWeight="bold">$</text>
    
    {/* Middle dollar bill with floating animation */}
    <g transform-origin="11 13.5">
      <animateTransform
        attributeName="transform"
        attributeType="XML"
        type="translate"
        values="0 0;0 -1;0 0"
        dur="2s"
        repeatCount="indefinite"
      />
      <rect x="2" y="10" width="18" height="7" rx="1" fill="currentColor" opacity="0.9" />
      <rect x="2" y="10" width="18" height="7" rx="1" fill="none" stroke="currentColor" strokeWidth="0.5" />
      <text x="11" y="14.5" fontSize="4" fill="#fff" textAnchor="middle" fontWeight="bold">$</text>
    </g>
    
    {/* Top dollar bill with floating animation */}
    <g transform-origin="13 9.5">
      <animateTransform
        attributeName="transform"
        attributeType="XML"
        type="translate"
        values="0 0;0 -1.5;0 0"
        dur="2.5s"
        repeatCount="indefinite"
      />
      <rect x="4" y="6" width="18" height="7" rx="1" fill="currentColor" />
      <rect x="4" y="6" width="18" height="7" rx="1" fill="none" stroke="currentColor" strokeWidth="0.5" />
      <text x="13" y="10.5" fontSize="4" fill="#fff" textAnchor="middle" fontWeight="bold">$</text>
    </g>
    
    {/* Decorative corner elements on top bill */}
    <circle cx="7" cy="8.5" r="0.8" fill="none" stroke="#fff" strokeWidth="0.3" />
    <circle cx="19" cy="8.5" r="0.8" fill="none" stroke="#fff" strokeWidth="0.3" />
    <circle cx="7" cy="11.5" r="0.8" fill="none" stroke="#fff" strokeWidth="0.3" />
    <circle cx="19" cy="11.5" r="0.8" fill="none" stroke="#fff" strokeWidth="0.3" />
    
    {/* Animated money symbols floating up */}
    <g opacity="0">
      <animate attributeName="opacity" values="0;1;0" dur="3s" repeatCount="indefinite"/>
      <g transform-origin="8 4">
        <animateTransform
          attributeName="transform"
          attributeType="XML"
          type="translate"
          values="0 8;0 0;0 -4"
          dur="3s"
          repeatCount="indefinite"
        />
        <text x="8" y="4" fontSize="3" fill="currentColor" textAnchor="middle" fontWeight="bold">$</text>
      </g>
      <g transform-origin="16 4">
        <animateTransform
          attributeName="transform"
          attributeType="XML"
          type="translate"
          values="0 8;0 0;0 -4"
          dur="3s"
          begin="1s"
          repeatCount="indefinite"
        />
        <text x="16" y="4" fontSize="3" fill="currentColor" textAnchor="middle" fontWeight="bold">$</text>
      </g>
    </g>
  </svg>
);

const AnimatedHammerIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 animate-pulse"
  >
    {/* Claw hammer head */}
    <g transform-origin="12 10">
      <animateTransform
        attributeName="transform"
        attributeType="XML"
        type="rotate"
        values="0 12 10;-20 12 10;0 12 10;15 12 10;0 12 10"
        dur="2.5s"
        repeatCount="indefinite"
      />
      
      {/* Hammer striking face */}
      <rect x="9" y="8" width="6" height="3" rx="0.5" fill="#374151" />
      <rect x="9.5" y="8.5" width="5" height="2" rx="0.3" fill="#4B5563" />
      
      {/* Curved claw */}
      <path 
        d="M16 9.5 Q19 8 20 10 Q21 12 19 11 Q17 10 16 9.5" 
        fill="#374151" 
        stroke="#1F2937" 
        strokeWidth="0.3"
      />
      <path 
        d="M15.8 9.7 Q18.5 8.5 19.5 10.2 Q20.2 11.5 18.8 10.8 Q17 10 15.8 9.7" 
        fill="#4B5563" 
      />
      
      {/* Hammer head connection */}
      <rect x="11" y="9" width="2" height="2" rx="0.2" fill="#1F2937" />
    </g>
    
    {/* Blue handle with texture */}
    <g transform-origin="12 10">
      <animateTransform
        attributeName="transform"
        attributeType="XML"
        type="rotate"
        values="0 12 10;-20 12 10;0 12 10;15 12 10;0 12 10"
        dur="2.5s"
        repeatCount="indefinite"
      />
      
      {/* Main blue handle */}
      <rect x="11.5" y="11" width="1.5" height="11" rx="0.7" fill="#1E40AF" />
      
      {/* Handle grip texture */}
      <rect x="11.6" y="13" width="1.3" height="0.3" rx="0.1" fill="#3B82F6" opacity="0.7" />
      <rect x="11.6" y="14" width="1.3" height="0.3" rx="0.1" fill="#3B82F6" opacity="0.7" />
      <rect x="11.6" y="15" width="1.3" height="0.3" rx="0.1" fill="#3B82F6" opacity="0.7" />
      <rect x="11.6" y="16" width="1.3" height="0.3" rx="0.1" fill="#3B82F6" opacity="0.7" />
      <rect x="11.6" y="17" width="1.3" height="0.3" rx="0.1" fill="#3B82F6" opacity="0.7" />
      <rect x="11.6" y="18" width="1.3" height="0.3" rx="0.1" fill="#3B82F6" opacity="0.7" />
      <rect x="11.6" y="19" width="1.3" height="0.3" rx="0.1" fill="#3B82F6" opacity="0.7" />
      
      {/* Yellow branding area */}
      <rect x="11.4" y="12" width="1.7" height="1.2" rx="0.3" fill="#FCD34D" />
      <rect x="11.5" y="12.2" width="1.5" height="0.8" rx="0.2" fill="#F59E0B" />
      
      {/* Handle end cap */}
      <ellipse cx="12.25" cy="22" rx="0.8" ry="0.3" fill="#1E40AF" />
    </g>
  </svg>
);

const ConcreteIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-gray-500 animate-pulse"
  >
    {/* Concrete mixer truck body */}
    <rect x="2" y="14" width="12" height="6" rx="1" fill="#FCD34D" />
    <rect x="2" y="15" width="12" height="2" rx="0.3" fill="#F59E0B" />
    
    {/* Mixer drum */}
    <ellipse cx="12" cy="12" rx="6" ry="4" fill="#E5E7EB" />
    <ellipse cx="12" cy="11" rx="5.5" ry="3.5" fill="#D1D5DB" />
    
    {/* Mixer drum rotation */}
    <g transform-origin="12 11.5">
      <animateTransform
        attributeName="transform"
        attributeType="XML"
        type="rotate"
        values="0 12 11.5;360 12 11.5"
        dur="3s"
        repeatCount="indefinite"
      />
      <ellipse cx="12" cy="11.5" rx="4" ry="2.5" fill="none" stroke="#9CA3AF" strokeWidth="0.5" />
      <line x1="12" y1="9" x2="12" y2="14" stroke="#9CA3AF" strokeWidth="0.5" />
      <line x1="8.5" y1="11.5" x2="15.5" y2="11.5" stroke="#9CA3AF" strokeWidth="0.5" />
    </g>
    
    {/* Concrete being poured */}
    <g opacity="0.8">
      <animate attributeName="opacity" values="0.8;0.4;0.8" dur="2s" repeatCount="indefinite"/>
      <path d="M15 15 Q16 16 17 18 Q18 20 19 22" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="17" cy="18" r="0.5" fill="#6B7280" opacity="0.6"/>
      <circle cx="18" cy="20" r="0.7" fill="#6B7280" opacity="0.7"/>
      <circle cx="19" cy="22" r="0.8" fill="#6B7280" opacity="0.8"/>
    </g>
    
    {/* Truck wheels */}
    <circle cx="6" cy="19" r="2" fill="#374151" />
    <circle cx="6" cy="19" r="1.2" fill="#6B7280" />
    <circle cx="12" cy="19" r="2" fill="#374151" />
    <circle cx="12" cy="19" r="1.2" fill="#6B7280" />
    
    {/* Truck cab */}
    <rect x="14" y="12" width="4" height="6" rx="0.5" fill="#FCD34D" />
    <rect x="15" y="13" width="2" height="2" rx="0.2" fill="#3B82F6" opacity="0.7" />
    
    {/* Ground/surface */}
    <rect x="16" y="21" width="6" height="2" rx="0.5" fill="#D1D5DB" opacity="0.6" />
  </svg>
);

const WeatherIntelligenceIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-blue-600 animate-pulse"
  >
    {/* Main cloud with animation */}
    <g transform-origin="16 12">
      <animateTransform
        attributeName="transform"
        attributeType="XML"
        type="scale"
        values="1;1.1;1"
        dur="3s"
        repeatCount="indefinite"
      />
      <path d="M8 16c-2.2 0-4-1.8-4-4s1.8-4 4-4c0.4-2.6 2.6-4.5 5.2-4.4 2.4 0.1 4.4 2.1 4.4 4.4 1.8 0 3.4 1.6 3.4 3.5s-1.5 3.5-3.4 3.5" fill="currentColor" opacity="0.8"/>
    </g>
    
    {/* Sun rays with rotation */}
    <g transform-origin="24 8" opacity="0.7">
      <animateTransform
        attributeName="transform"
        attributeType="XML"
        type="rotate"
        values="0 24 8;360 24 8"
        dur="8s"
        repeatCount="indefinite"
      />
      <line x1="24" y1="4" x2="24" y2="6" stroke="currentColor" strokeWidth="1"/>
      <line x1="27" y1="5" x2="26" y2="6" stroke="currentColor" strokeWidth="1"/>
      <line x1="28" y1="8" x2="26" y2="8" stroke="currentColor" strokeWidth="1"/>
      <line x1="27" y1="11" x2="26" y2="10" stroke="currentColor" strokeWidth="1"/>
      <line x1="24" y1="12" x2="24" y2="10" stroke="currentColor" strokeWidth="1"/>
      <line x1="21" y1="11" x2="22" y2="10" stroke="currentColor" strokeWidth="1"/>
      <line x1="20" y1="8" x2="22" y2="8" stroke="currentColor" strokeWidth="1"/>
      <line x1="21" y1="5" x2="22" y2="6" stroke="currentColor" strokeWidth="1"/>
    </g>
    
    {/* Sun center */}
    <circle cx="24" cy="8" r="2" fill="currentColor" opacity="0.9"/>
    
    {/* Rain drops with falling animation */}
    <g opacity="0">
      <animate attributeName="opacity" values="0;1;0" dur="2s" begin="0.5s" repeatCount="indefinite"/>
      <ellipse cx="10" cy="20" rx="0.5" ry="2" fill="currentColor"/>
      <ellipse cx="14" cy="22" rx="0.5" ry="2" fill="currentColor"/>
      <ellipse cx="18" cy="20" rx="0.5" ry="2" fill="currentColor"/>
    </g>
    
    <g opacity="0">
      <animate attributeName="opacity" values="0;1;0" dur="2s" begin="1s" repeatCount="indefinite"/>
      <ellipse cx="12" cy="24" rx="0.5" ry="2" fill="currentColor"/>
      <ellipse cx="16" cy="26" rx="0.5" ry="2" fill="currentColor"/>
      <ellipse cx="20" cy="24" rx="0.5" ry="2" fill="currentColor"/>
    </g>
    
    {/* Wind lines with movement */}
    <g opacity="0">
      <animate attributeName="opacity" values="0;0.7;0" dur="3s" begin="2s" repeatCount="indefinite"/>
      <path d="M2 18 Q6 16 10 18" stroke="currentColor" strokeWidth="1" fill="none"/>
      <path d="M2 22 Q8 20 12 22" stroke="currentColor" strokeWidth="1" fill="none"/>
      <path d="M2 26 Q5 24 8 26" stroke="currentColor" strokeWidth="1" fill="none"/>
    </g>
    
    {/* Weather station antenna */}
    <line x1="28" y1="28" x2="28" y2="20" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="28" cy="20" r="1" fill="currentColor"/>
    <line x1="26" y1="22" x2="30" y2="22" stroke="currentColor" strokeWidth="0.8"/>
    <line x1="27" y1="24" x2="29" y2="24" stroke="currentColor" strokeWidth="0.8"/>
    
    {/* Signal waves */}
    <g opacity="0">
      <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite"/>
      <path d="M25 20 Q26 18 27 20" stroke="currentColor" strokeWidth="0.5" fill="none"/>
      <path d="M29 20 Q30 18 31 20" stroke="currentColor" strokeWidth="0.5" fill="none"/>
    </g>
  </svg>
);



const Calculators = () => {
  const calculators = [{
    title: "Markup Calculator",
    description: "Calculate price markups and profit margins for quotes and invoices",
    icon: (
      <div className="relative">
        <Percent className="h-6 w-6 text-green-500 animate-pulse" />
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
      </div>
    ),
    path: "/calculators/markup"
  }, {
    title: "Carpentry Calculators",
    description: "Calculate timber beam loads, spans, and other carpentry measurements for construction projects",
          icon: <AnimatedHammerIcon />,
    path: "/calculators/loads-spans"
  }, {
    title: "Concrete Calculator",

    description: "Calculate concrete volume needed for slabs, footings, and columns",
    icon: <Hammer className="h-6 w-6 text-blue-500" />,
    path: "/calculators/concrete"
  }, {
    title: "Angle Calculator",
    description: "Calculate angles and slopes using various measurement methods",
    icon: <Compass className="h-6 w-6 text-indigo-500" />,
    path: "/calculators/loads-spans?tab=degree"
  }, {
    title: "Stairs Calculator",
    description: "Calculate stair dimensions, risers, and treads for building projects",
    icon: <ArrowUpDown className="h-6 w-6 text-orange-500" />,
    path: "/calculators/loads-spans?tab=stairs"

  }, {
    title: "Fencing Calculator",
    description: "Calculate materials needed for fencing projects including posts, panels, and gates",
    icon: <TimberPicketIcon />,
    path: "/calculators/fencing"
  }, {
    title: "NCC Codes Reference",
    description: "Search and reference National Construction Code clauses for building compliance",
    icon: (
      <div className="relative">
        <FileCode className="h-6 w-6 text-red-500 animate-pulse" />
        <div className="absolute top-0 right-0 w-1 h-1 bg-red-400 rounded-full animate-bounce"></div>
      </div>
    ),
    path: "/calculators/ncc-codes"
  }, {

    title: "TDS Reference",
    description: "Timber Queensland Data Sheets - specifications, grades, and technical data",
    icon: <FileText className="h-6 w-6 text-green-500" />,
    path: "/calculators/tds"
  }, {
    title: "QBCC Forms Reference",
    description: "Queensland Building and Construction Commission forms and compliance documents",
    icon: <FileCheck className="h-6 w-6 text-blue-500" />,
    path: "/calculators/qbcc-forms"
  }];
  
  return (
    <AppLayout>
      <div className="container mx-auto py-6 px-4 space-y-6">
        <SectionHeader title="Tricks of the Trade" />
        
        <p className="text-xl font-bold text-center text-gray-700 mb-6">
          Trade Calculators
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {calculators.filter(c => ![
            "NCC Codes Reference",
            "Timber Qld Technical Data Sheet",
            "Qbcc Forms",
            "SafeWork NSW",
            "Consumer and Business Services",
            "Building and Energy",
            "Building Practitioners Board",
            "Access Canberra (Building and Planning)",
            "Consumer, Building and Occupational Services"
          ].includes(c.title)).map((calculator, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="bg-slate-200 p-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base md:text-lg">{calculator.title}</CardTitle>
                  {calculator.icon}
                </div>
                <CardDescription className="line-clamp-2 min-h-[40px]">{calculator.description}</CardDescription>
              </CardHeader>
              <CardFooter className="bg-slate-200 p-4">
                <Link 
                  to={calculator.path} 
                  className="w-full bg-blue-600 text-white py-2 rounded-md text-center hover:bg-blue-700 transition-colors"
                >
                  Open Calculator
                </Link>
              </CardFooter>
            </Card>
          ))}
          {/* Electrician Calculator Card */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="bg-slate-200 p-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base md:text-lg">Electrician Calculator</CardTitle>
                <div className="relative">
                  <Zap className="h-6 w-6 text-yellow-500 animate-pulse" />
                  <div className="absolute inset-0 animate-ping">
                    <Zap className="h-6 w-6 text-yellow-300 opacity-75" />
                  </div>
                </div>
              </div>
              <CardDescription className="line-clamp-2 min-h-[40px]">
                Calculate electrical loads, wire sizes, voltage drops, and more for electrical projects.
              </CardDescription>
            </CardHeader>
            <CardFooter className="bg-slate-200 p-4">
              <Link 
                to="/calculators/electrician" 
                className="w-full bg-blue-600 text-white py-2 rounded-md text-center hover:bg-blue-700 transition-colors"
              >
                Open Calculator
              </Link>
            </CardFooter>
          </Card>
          {/* Plumbing Calculator Card */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="bg-slate-200 p-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base md:text-lg">Plumbing Calculator</CardTitle>
                <div className="relative">
                  <Droplets className="h-6 w-6 text-blue-500 animate-pulse" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="absolute top-1 left-1 w-1 h-1 bg-blue-300 rounded-full animate-ping"></div>
                </div>
              </div>
              <CardDescription className="line-clamp-2 min-h-[40px]">
                Calculate pipe sizes, pressure loss, tank volumes, and more for plumbing projects.
              </CardDescription>
            </CardHeader>
            <CardFooter className="bg-slate-200 p-4">
              <Link 
                to="/calculators/plumbing" 
                className="w-full bg-blue-600 text-white py-2 rounded-md text-center hover:bg-blue-700 transition-colors"
              >
                Open Calculator
              </Link>
            </CardFooter>
          </Card>
        </div>

        {/* Property Measurement and Specialized Tools section */}
        <div className="mt-12">
          <div className="border-t-2 border-gray-300 my-8 w-full"></div>
          <h2 className="text-2xl font-bold text-center text-gray-700 mt-8 mb-8">Trade Secrets</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Property Measurement Tool Card */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="bg-slate-200 p-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base md:text-lg">Automatic Boundary Measure</CardTitle>
                  <PropertyBoundaryIcon />
                </div>
                <CardDescription className="line-clamp-2 min-h-[40px]">
                  Measure property dimensions and calculate area for site planning and compliance.
                </CardDescription>
              </CardHeader>
              <CardFooter className="bg-slate-200 p-4">
                <Link 
                  to="/property-measurement" 
                  className="w-full bg-blue-600 text-white py-2 rounded-md text-center hover:bg-blue-700 transition-colors"
                >
                  Open Calculator
                </Link>
              </CardFooter>
            </Card>
            {/* Job Cost Estimator Card */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="bg-slate-200 p-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base md:text-lg">Job Cost Estimator</CardTitle>
                  <CashPileIcon />
                </div>
                <CardDescription className="line-clamp-2 min-h-[40px]">
                  Estimate total job costs including materials, labor, and overhead
                </CardDescription>
              </CardHeader>
              <CardFooter className="bg-slate-200 p-4">
                <Link 
                  to="/calculators/job-cost" 
                  className="w-full bg-blue-600 text-white py-2 rounded-md text-center hover:bg-blue-700 transition-colors"
                >
                  Open Calculator
                </Link>
              </CardFooter>
            </Card>

            {/* Weather Intelligence Card */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="bg-slate-200 p-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base md:text-lg">Weather Intelligence</CardTitle>
                  <WeatherIntelligenceIcon />
                </div>
                <CardDescription className="line-clamp-2 min-h-[40px]">
                  Professional weather monitoring with location-based alerts and construction-specific forecasts
                </CardDescription>
              </CardHeader>
              <CardFooter className="bg-slate-200 p-4">
                <Link 
                  to="/weather-intelligence" 
                  className="w-full bg-blue-600 text-white py-2 rounded-md text-center hover:bg-blue-700 transition-colors"
                >
                  Open Tool
                </Link>
              </CardFooter>
            </Card>
            {/* Trade Rate Calculator Card */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="bg-slate-200 p-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base md:text-lg">Trade Rate Calculator</CardTitle>
                  <HardHatIcon />
                </div>
                <CardDescription className="line-clamp-2 min-h-[40px]">
                  Calculate hourly rates, markups, and profit margins for different trades
                </CardDescription>
              </CardHeader>
              <CardFooter className="bg-slate-200 p-4">
                <Link 
                  to="/settings/trade-rates" 
                  className="w-full bg-blue-600 text-white py-2 rounded-md text-center hover:bg-blue-700 transition-colors"
                >
                  Open Calculator
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>

        {/* Building industry regulators section */}
        <div className="mt-12">
          <div className="border-t-2 border-gray-300 my-8 w-full"></div>
          <h2 className="text-2xl font-bold text-center text-gray-700 mt-8 mb-8">Building industry regulators</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {calculators.filter(c => [
              "NCC Codes Reference",
              "Qbcc Forms",
              "Timber Qld Technical Data Sheet",
              "SafeWork NSW",
              "Consumer and Business Services",
              "Building and Energy",
              "Building Practitioners Board",
              "Access Canberra (Building and Planning)",
              "Consumer, Building and Occupational Services"
            ].includes(c.title)).map((calculator, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="bg-slate-200 p-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base md:text-lg">{calculator.title}</CardTitle>
                    {calculator.icon}
                  </div>
                  <CardDescription className="line-clamp-2 min-h-[40px]">{calculator.description}</CardDescription>
                </CardHeader>
                <CardFooter className="bg-slate-200 p-4">
                  <Link 
                    to={calculator.path} 
                    className="w-full bg-blue-600 text-white py-2 rounded-md text-center hover:bg-blue-700 transition-colors"
                  >
                    Open Reference
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Calculators;
