import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrganization } from '@/contexts/OrganizationContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Building2, Users, Crown, Briefcase, Plus, Mail, Settings, Shield, CreditCard, Zap, Key, MessageSquare, Bot, Phone, Check, Star, X, Calendar, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface PricingFeature {
  name: string;
  included: boolean;
  highlight?: boolean;
}

interface PricingTier {
  id: string;
  name: string;
  price: string | number;
  interval?: string;
  description: string;
  features: PricingFeature[];
  limitations?: string[];
  addOns?: string[];
  affiliateEarnings?: string;
  support: string;
  highlight?: boolean;
  popular?: boolean;
  cta: {
    text: string;
    href?: string;
    onClick?: () => void;
  };
  icon?: React.ReactNode;
}

interface PricingPlansProps {
  tiers?: PricingTier[];
  className?: string;
}

const defaultTiers: PricingTier[] = [
  {
    id: "free",
    name: "Free Starter",
    price: 0,
    interval: "forever",
    description: "Our Free Starter plan is designed to give you a taste of what our platform can do, capturing your attention with free access while highlighting the value of upgrading.",
    icon: (
      <motion.div
        animate={{
          rotate: 360
        }}
        transition={{
          duration: 4,
          ease: "linear",
          repeat: Infinity
        }}
        className="flex items-center justify-center h-5 w-5"
      >
        <Star className="h-5 w-5" />
      </motion.div>
    ),
    features: [
      { name: "Organizations: 1", included: true },
      { name: "Users: 1", included: true },
      { name: "Invoicing", included: true, highlight: true },
      { name: "Quoting", included: true, highlight: true },
      { name: "Calendar management", included: true, highlight: true },
    ],
    limitations: [
      "No automations",
      "No automated texts or emails", 
      "No other functions beyond core features",
      "You can view all other features but cannot actively use them"
    ],
    affiliateEarnings: "Earn 40% on any subscription referral",
    support: "Standard ticket support system",
    cta: {
      text: "Get Started Free",
      onClick: () => console.log("Free plan selected")
    }
  },
  {
    id: "growing",
    name: "Growing Pain Relief",
    price: 75,
    interval: "/month inc GST",
    description: "The Growing Pain Relief plan helps alleviate common business challenges, providing essential features and + optional add-ons as a pay as you go !",
    icon: (
      <motion.div
        animate={{
          x: [-1, 1, -1, 1, 0],
          y: [-1, 1, -1, 1, 0]
        }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          repeatDelay: 2,
          ease: "easeInOut"
        }}
      >
        <Users className="h-5 w-5 text-blue-500" />
      </motion.div>
    ),
    features: [
      { name: "Organizations: 1", included: true },
      { name: "Users: 3", included: true },
      { name: "Direct website inquiries auto-forwarded", included: true, highlight: true },
      { name: "Auto worker/ABN verification", included: true, highlight: true },
      { name: "Internal communications & tagging", included: true, highlight: true },
      { name: "Tax budgeting on each job", included: true, highlight: true },
      { name: "Financial report automation", included: true, highlight: true },
      { name: "Weekly financial report", included: true, highlight: true },
      { name: "Customer progression link", included: true, highlight: true },
      { name: "Customer journey view", included: true, highlight: true },
      { name: "Step by step job process + notify", included: true, highlight: true },
      { name: "Optional Add-ons", included: false },
      { name: "+ per user", included: false },
      { name: "AI automated red flagging", included: false },
      { name: "Invoice/job price rise alerts", included: false },
      { name: "Material order quantity error filter", included: false },
      { name: "Receipt upload AI read and sort", included: false },
      { name: "Boundary automated measure", included: false },
      { name: "Accounting software replacement", included: false },
      { name: "Instant digital signings", included: false },
      { name: "Instant pop-up signed variations", included: false },
      { name: "Weather notifications (voice)", included: false },
      { name: "New number forwarding", included: false },
      { name: "Compliance updates", included: false },
      { name: "Tag drop system for admin", included: false },
      { name: "Site to boss approval requests", included: false },
      { name: "Admin to boss approval requests", included: false },
      { name: "Customizable quote templates", included: false },
      { name: "Payment links", included: false },
      { name: "Remittance upload", included: false },
      { name: "Instant payment (no dongle)", included: false },
      { name: "Upload once to all social media", included: false },
    ],
    addOns: [
      "Advanced workflows: Extra cost per setup",
      "Additional Twilio numbers + call/text fees",
      "Ongoing AI token costs"
    ],
    affiliateEarnings: "Earn 40% on any subscription referral",
    support: "Standard ticket support system",
    popular: true,
    cta: {
      text: "Start Growing",
      onClick: () => console.log("Growing plan selected")
    }
  },
  {
    id: "premium",
    name: "Premium Edge",
    price: 449,
    interval: "/month",
    description: "Unlock the full potential of our platform with Premium Edge, providing comprehensive tools and unlimited usage for a truly streamlined operation.",
    icon: (
      <motion.div
        initial={{
          scale: 1,
          filter: "drop-shadow(0 0px 0px rgba(252, 211, 77, 0))",
          color: "#FCD34D"
        }}
        animate={{
          scale: [1, 1.1, 1],
          filter: [
            "drop-shadow(0 0px 0px rgba(252, 211, 77, 0))",
            "drop-shadow(0 0px 8px rgba(252, 211, 77, 0.8))",
            "drop-shadow(0 0px 0px rgba(252, 211, 77, 0))"
          ],
          color: ["#FCD34D", "#D97706", "#FCD34D"]
        }}
        transition={{
          duration: 1.5,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "loop"
        }}
        className="flex items-center justify-center h-5 w-5"
      >
        <Zap className="h-5 w-5" />
      </motion.div>
    ),
    features: [
      { name: "Organizations: 1", included: true },
      { name: "Users: 15 (all features included)", included: true },
      { name: "Direct website inquiries auto-forwarded", included: true, highlight: true },
      { name: "Auto worker/ABN verification", included: true, highlight: true },
      { name: "Internal communications & tagging", included: true, highlight: true },
      { name: "AI automated red flagging", included: true, highlight: true },
      { name: "Invoice/job price rise alerts", included: true, highlight: true },
      { name: "Material order quantity error filter", included: true, highlight: true },
      { name: "Receipt upload AI read and sort", included: true, highlight: true },
      { name: "Boundary automated measure", included: true, highlight: true },
      { name: "Accounting software replacement", included: true, highlight: true },
      { name: "Tax budgeting on each job", included: true, highlight: true },
      { name: "Financial report automation", included: true, highlight: true },
      { name: "Weekly financial report", included: true, highlight: true },
      { name: "Customer progression link", included: true, highlight: true },
      { name: "Instant digital signings", included: true, highlight: true },
      { name: "Instant pop-up signed variations", included: true, highlight: true },
      { name: "Weather notifications (voice)", included: true, highlight: true },
      { name: "Multiple calendars", included: true, highlight: true },
      { name: "New number forwarding", included: true, highlight: true },
      { name: "Compliance updates", included: true, highlight: true },
      { name: "150+ personalised automations", included: true, highlight: true },
      { name: "Tag drop system for admin", included: true, highlight: true },
      { name: "Site to boss approval requests", included: true, highlight: true },
      { name: "Admin to boss approval requests", included: true, highlight: true },
      { name: "Customizable quote templates", included: true, highlight: true },
      { name: "Payment links", included: true, highlight: true },
      { name: "Remittance upload", included: true, highlight: true },
      { name: "Step-by-step job process + notify", included: true, highlight: true },
      { name: "Instant payment (no dongle)", included: true, highlight: true },
      { name: "Upload once to all social media", included: true, highlight: true },
      { name: "Customer journey view", included: true, highlight: true },
      { name: "Customer view any update auto", included: true, highlight: true },
      { name: "Automated Google review requests", included: true, highlight: true }
    ],
    addOns: [
      "Advanced workflows: Extra cost per setup",
      "Additional Twilio numbers + call/text fees",
      "Ongoing AI token costs"
    ],
    affiliateEarnings: "Earn 40% on any subscription referral",
    support: "Priority ticket support system",
    highlight: true,
    cta: {
      text: "Go Premium",
      onClick: () => console.log("Premium plan selected")
    }
  },
  {
    id: "skeleton",
    name: "Skeleton Key Access",
    price: "Contact Us",
    description: "The Skeleton Key Access all the control, allowing you to white label our entire business and sell it as your own!",
    icon: (
      <motion.div
        initial={{
          rotate: 0,
          filter: "drop-shadow(0 0px 0px rgba(209, 213, 219, 0))",
          color: "rgb(209, 213, 219)"
        }}
        animate={{
          rotateY: 360,
          filter: [
            "drop-shadow(0 0px 0px rgba(209, 213, 219, 0))",
            "drop-shadow(0 0px 8px rgba(52, 211, 153, 0.8))",
            "drop-shadow(0 0px 0px rgba(209, 213, 219, 0))"
          ],
          color: [
            "rgb(209, 213, 219)",
            "rgb(52, 211, 153)",
            "rgb(209, 213, 219)"
          ]
        }}
        transition={{
          duration: 1.5,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "loop"
        }}
        className="flex items-center justify-center h-5 w-5"
      >
        <Crown className="h-5 w-5" />
      </motion.div>
    ),
    features: [
      { name: "White-label entire business", included: true, highlight: true },
      { name: "Comprehensive A-Z training videos", included: true, highlight: true },
      { name: "Monetization opportunity", included: true, highlight: true },
      { name: "AI automated red flagging", included: true, highlight: true },
      { name: "Invoice/job price rise alerts", included: true, highlight: true },
      { name: "Material order quantity error filter", included: true, highlight: true },
      { name: "Receipt upload AI read and sort", included: true, highlight: true },
      { name: "Boundary automated measure", included: true, highlight: true },
      { name: "Accounting software replacement", included: true, highlight: true },
      { name: "Tax budgeting on each job", included: true, highlight: true },
      { name: "Financial report automation", included: true, highlight: true },
      { name: "Weekly financial report", included: true, highlight: true },
      { name: "Customer progression link", included: true, highlight: true },
      { name: "Instant digital signings", included: true, highlight: true },
      { name: "Instant pop-up signed variations", included: true, highlight: true },
      { name: "Weather notifications (voice)", included: true, highlight: true },
      { name: "Multiple calendars", included: true, highlight: true },
      { name: "New number forwarding", included: true, highlight: true },
      { name: "Compliance updates", included: true, highlight: true },
      { name: "150+ personalised automations", included: true, highlight: true },
      { name: "Tag drop system for admin", included: true, highlight: true },
      { name: "Site to boss approval requests", included: true, highlight: true },
      { name: "Admin to boss approval requests", included: true, highlight: true },
      { name: "Customizable quote templates", included: true, highlight: true },
      { name: "Payment links", included: true, highlight: true },
      { name: "Remittance upload", included: true, highlight: true },
      { name: "Step-by-step job process + notify", included: true, highlight: true },
      { name: "Instant payment (no dongle)", included: true, highlight: true },
      { name: "Upload once to all social media", included: true, highlight: true },
      { name: "Customer journey view", included: true, highlight: true },
      { name: "Customer view any update auto", included: true, highlight: true },
      { name: "Automated Google review requests", included: true, highlight: true },
      { name: "Client management & permissions", included: true, highlight: true },
      { name: "Sell workflows you create", included: true, highlight: true },
      { name: "Dedicated developer option", included: true, highlight: true }
    ],
    addOns: [
      "Pricing based on conditional setup",
      "AI tokens only additional ongoing cost",
      "Additional Twilio numbers + call/text fees"
    ],
    affiliateEarnings: "Keep all money from your users",
    support: "Highest priority support system",
    cta: {
      text: "Contact Sales",
      onClick: () => console.log("Skeleton Key contact requested")
    }
  }
];

export function PricingPlans({ tiers = defaultTiers, className }: PricingPlansProps) {
  return (
    <section className={cn("min-h-screen w-full py-12 px-4 bg-black text-white relative overflow-hidden", className)}>
      {/* Smoke Effect Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Multiple smoke particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              background: `radial-gradient(circle, rgba(200, 200, 200, 0.8) 0%, rgba(150, 150, 150, 0.6) 30%, rgba(100, 100, 100, 0.3) 60%, transparent 80%)`,
              width: `${Math.random() * 150 + 80}px`,
              height: `${Math.random() * 150 + 80}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              filter: 'blur(1px)',
            }}
            animate={{
              x: [0, Math.random() * 300 - 150, Math.random() * 400 - 200],
              y: [0, Math.random() * -200 - 100, Math.random() * -400 - 200],
              scale: [0.3, 1.2, 0.1],
              opacity: [0, 0.7, 0],
            }}
            transition={{
              duration: Math.random() * 8 + 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 3,
            }}
          />
        ))}
        
        {/* Larger smoke clouds */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={`cloud-${i}`}
            className="absolute rounded-full"
            style={{
              background: `radial-gradient(ellipse, rgba(180, 180, 180, 0.9) 0%, rgba(140, 140, 140, 0.7) 20%, rgba(100, 100, 100, 0.4) 50%, transparent 70%)`,
              width: `${Math.random() * 300 + 200}px`,
              height: `${Math.random() * 200 + 150}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              filter: 'blur(2px)',
            }}
            animate={{
              x: [0, Math.random() * 200 - 100],
              y: [0, Math.random() * -300 - 150],
              scale: [0.2, 1.5, 0.1],
              opacity: [0, 0.6, 0],
              rotate: [0, Math.random() * 180],
            }}
            transition={{
              duration: Math.random() * 12 + 18,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5,
            }}
          />
        ))}
        
        {/* Wispy smoke trails */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`wisp-${i}`}
            className="absolute"
            style={{
              background: `linear-gradient(45deg, rgba(160, 160, 160, 0.6) 0%, rgba(120, 120, 160, 0.4) 50%, transparent 100%)`,
              width: `${Math.random() * 80 + 40}px`,
              height: `${Math.random() * 200 + 100}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              borderRadius: '50% 20% 50% 20%',
              filter: 'blur(1.5px)',
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * -250 - 100],
              rotate: [0, Math.random() * 90 - 45],
              opacity: [0, 0.5, 0],
              scaleX: [1, Math.random() * 0.5 + 0.5],
            }}
            transition={{
              duration: Math.random() * 10 + 15,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 4,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto max-w-[1400px] relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-white mb-4">
            Choose Your Plan
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Select the perfect plan for your business needs. Start free and upgrade as you grow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-24 px-4">
          {tiers.map((tier) => (
            <Card
              key={tier.id}
              className={cn(
                "relative flex flex-col h-full transition-all duration-300 hover:shadow-lg bg-gray-900 text-white border border-gray-700",
                tier.popular && "border-blue-500",
                tier.highlight && tier.id === "premium" && "border-2",
                tier.id === "skeleton" && "border-2",
                !tier.popular && tier.id !== "skeleton" && "border-gray-700 border-1"
              )}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-500 text-white">
                    Most Popular
                  </Badge>
                </div>
              )}
              {tier.highlight && tier.id === "premium" && (
                <motion.div
                  className="absolute inset-0 rounded-lg -z-10"
                  style={{
                    background: "linear-gradient(45deg, #FCD34D, #D97706, #FCD34D)",
                    filter: "blur(8px)",
                  }}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0, 0.2, 0],
                    scale: [1, 1.02, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "loop",
                  }}
                />
              )}
              
              {tier.id === "skeleton" && (
                <motion.div
                  className="absolute inset-0 rounded-lg -z-10"
                  style={{
                    background: "linear-gradient(45deg, rgb(209, 213, 219), rgb(52, 211, 153), rgb(209, 213, 219))",
                    filter: "blur(8px)",
                  }}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0, 0.2, 0],
                    scale: [1, 1.02, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "loop",
                  }}
                />
              )}

              <CardHeader className="text-center pb-8">
                <div className="flex items-center justify-center gap-2 mb-4">
                  {tier.icon}
                  {tier.id === "premium" ? (
                    <motion.div
                      initial={{
                        filter: "drop-shadow(0 0px 0px rgba(252, 211, 77, 0))",
                        color: "#FCD34D"
                      }}
                      animate={{
                        filter: [
                          "drop-shadow(0 0px 0px rgba(252, 211, 77, 0))",
                          "drop-shadow(0 0px 8px rgba(252, 211, 77, 0.8))",
                          "drop-shadow(0 0px 0px rgba(252, 211, 77, 0))"
                        ],
                        color: ["#FCD34D", "#D97706", "#FCD34D"]
                      }}
                      transition={{
                        duration: 1.5,
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatType: "loop"
                      }}
                    >
                      <CardTitle className="text-xl font-bold text-white">
                        {tier.name}
                      </CardTitle>
                    </motion.div>
                  ) : tier.id === "skeleton" ? (
                    <motion.div
                      initial={{
                        filter: "drop-shadow(0 0px 0px rgba(209, 213, 219, 0))",
                        color: "rgb(209, 213, 219)"
                      }}
                      animate={{
                        filter: [
                          "drop-shadow(0 0px 0px rgba(209, 213, 219, 0))",
                          "drop-shadow(0 0px 8px rgba(52, 211, 153, 0.8))",
                          "drop-shadow(0 0px 0px rgba(209, 213, 219, 0))"
                        ],
                        color: [
                          "rgb(209, 213, 219)",
                          "rgb(52, 211, 153)",
                          "rgb(209, 213, 219)"
                        ]
                      }}
                      transition={{
                        duration: 1.5,
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatType: "loop"
                      }}
                    >
                      <CardTitle className="text-2xl font-bold text-white">
                        {tier.name}
                      </CardTitle>
                    </motion.div>
                  ) : (
                    <CardTitle className="text-xl font-bold text-white">
                      {tier.name}
                    </CardTitle>
                  )}
                </div>
                
                <div className="mb-6">
                  <div className="flex items-baseline justify-center gap-1">
                    {typeof tier.price === 'number' ? (
                      <>
                        <span className="text-3xl font-bold text-white">${tier.price}</span>
                        <span className="text-sm text-gray-400">
                          {tier.interval}
                        </span>
                      </>
                    ) : (
                      <span className="text-2xl font-bold text-blue-500">
                        {tier.price}
                      </span>
                    )}
                  </div>
                </div>

                <CardDescription className={cn(
                  "text-sm leading-relaxed text-gray-400 min-h-[100px]",
                  tier.id === "skeleton" && "text-center"
                )}>
                  {tier.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1 space-y-8 px-6 relative">
                <div>
                  <div className="relative">
                    <Separator className="absolute -left-6 -right-6 border-2 border-gray-600 w-[calc(100%+48px)]" />
                  </div>
                  <h4 className="font-semibold text-sm mb-3 text-white pt-6">
                    Core Features
                  </h4>
                  <ul className="space-y-2">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        {feature.included ? (
                          <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        ) : (
                          <span className="h-4 w-4 text-white mt-0.5 flex-shrink-0 flex items-center justify-center text-sm font-bold">+</span>
                        )}
                        <span className={cn(
                          feature.highlight && "font-medium text-white",
                          !feature.included && "text-gray-400"
                        )}>
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {tier.limitations && tier.limitations.length > 0 && (
                  <div>
                    <div className="relative">
                      <Separator className="absolute -left-6 -right-6 border-2 border-gray-600 w-[calc(100%+48px)]" />
                    </div>
                    <h4 className="font-semibold text-sm mb-2 text-red-600 pt-6">
                      Limitations
                    </h4>
                    <ul className="space-y-1">
                      {tier.limitations.map((limitation, index) => (
                        <li key={index} className="text-xs text-gray-400 flex items-start gap-1">
                          <span className="text-red-500">•</span>
                          {limitation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {tier.addOns && tier.addOns.length > 0 && (
                  <div>
                    <div className="relative">
                      <Separator className="absolute -left-6 -right-6 border-2 border-gray-600 w-[calc(100%+48px)]" />
                    </div>
                    <h4 className="text-sm mb-2 text-white pt-6">
                      Optional Add-ons
                    </h4>
                    <ul className="space-y-1">
                      {tier.addOns.map((addon, index) => (
                        <li key={index} className="text-xs text-gray-400 flex items-start gap-1">
                          <span className="text-blue-500">+</span>
                          {addon}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="relative">
                    <Separator className="absolute -left-6 -right-6 border-2 border-gray-600 w-[calc(100%+48px)]" />
                  </div>
                  <div className="text-xs space-y-1 text-gray-400 pt-6">
                    <p className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3 text-gray-400" />
                      <span className="font-medium">Support:</span> {tier.support}
                    </p>
                    <p className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-gray-400" />
                      <span className="font-medium">Affiliate:</span> {tier.affiliateEarnings}
                    </p>
                  </div>
                </div>
              </CardContent>

              <div className="p-6 pt-0">
                <Button
                  className={cn(
                    "w-full",
                    tier.highlight && "bg-blue-500 hover:bg-blue-600 text-white",
                    tier.popular && "bg-blue-500 hover:bg-blue-600 text-white"
                  )}
                  onClick={tier.cta.onClick}
                  asChild={Boolean(tier.cta.href)}
                >
                  {tier.cta.href ? (
                    <a href={tier.cta.href}>
                      {tier.cta.text}
                    </a>
                  ) : (
                    tier.cta.text
                  )}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-400">
            All plans include our core platform features. Upgrade or downgrade at any time.
          </p>
        </div>
      </div>
    </section>
  );
}

export default function OrganizationSettings() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    currentOrganization, 
    userOrganizations, 
    subscriptionTier,
    canCreateMoreOrganizations,
    updateOrganization,
    inviteToOrganization,
    createOrganization
  } = useOrganization();
  const { toast } = useToast();

  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');
  const [isAgencyInvite, setIsAgencyInvite] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [maxUsers, setMaxUsers] = useState(0);

  const [isCreateOrgDialogOpen, setIsCreateOrgDialogOpen] = useState(false);
  const [newOrgName, setNewOrgName] = useState('');
  const [newOrgType, setNewOrgType] = useState('');

  useEffect(() => {
    const fetchFeatureAccess = async () => {
      const { data: accessData } = await supabase
        .rpc('has_feature_access', { feature_key: 'automations' });
      
      const { data: usersData } = await supabase
        .rpc('get_feature_limit', { feature_key: 'max_users' });

      setHasAccess(accessData);
      setMaxUsers(usersData);
    };

    fetchFeatureAccess();
  }, []);

  const handleInvite = async () => {
    if (!inviteEmail) {
      toast({
        title: 'Email required',
        description: 'Please enter an email address to invite',
        variant: 'destructive'
      });
      return;
    }

    const success = await inviteToOrganization(inviteEmail, inviteRole, isAgencyInvite);
    if (success) {
      setInviteEmail('');
      setInviteRole('member');
      setIsAgencyInvite(false);
      setIsInviteDialogOpen(false);
    }
  };

  const handleCreateOrganization = async () => {
    if (!newOrgName) {
      toast({
        title: 'Organization name required',
        description: 'Please enter a name for your organization',
        variant: 'destructive'
      });
      return;
    }

    const org = await createOrganization({
      name: newOrgName,
      business_type: newOrgType
    });

    if (org) {
      setNewOrgName('');
      setNewOrgType('');
      setIsCreateOrgDialogOpen(false);
    }
  };

  const handleUpgrade = (tier: 'premium' | 'agency') => {
    toast({
      title: 'Upgrade to ' + tier,
      description: 'Payment integration coming soon. Contact support for manual upgrade.',
    });
  };

  if (hasAccess) {
    // Enable the feature
  } else {
    // Show upgrade prompt
  }

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <Tabs defaultValue="organizations" className="w-full">
        <div className="fixed top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex-shrink-0">
                <Button 
                  variant="ghost" 
                  className="text-gray-600 hover:text-gray-900"
                  onClick={() => navigate('/settings')}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Settings
                </Button>
              </div>
              <div className="flex-grow flex justify-center">
                <TabsList className="bg-gray-100">
                  <TabsTrigger value="organizations">Organizations</TabsTrigger>
                  <TabsTrigger value="subscription">Subscription</TabsTrigger>
                  {subscriptionTier === 'skeleton_key' && (
                    <TabsTrigger value="agency">Client Management</TabsTrigger>
                  )}
                </TabsList>
              </div>
              <div className="flex-shrink-0 w-[150px]"></div>
            </div>
          </div>
        </div>

        <div className="pt-16">
          <TabsContent value="organizations" className="mt-0">
            <div className="container mx-auto p-6 max-w-6xl">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Organization Settings</h1>
                <p className="text-gray-600">Manage your organizations and subscription</p>
              </div>

              {/* Current Organization */}
              <Card className="mb-6 bg-white shadow-sm border border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <Building2 className="h-5 w-5 text-gray-700" />
                    Current Organization
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Manage your current organization settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {currentOrganization ? (
                    <>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <Label className="text-gray-700">Organization Name</Label>
                          <Input 
                            value={currentOrganization.name} 
                            disabled 
                            className="mt-1 bg-gray-50 border-gray-200"
                          />
                        </div>
                        <div>
                          <Label className="text-gray-700">Business Type</Label>
                          <Input 
                            value={currentOrganization.business_type || 'Not specified'} 
                            disabled 
                            className="mt-1 bg-gray-50 border-gray-200"
                          />
                        </div>
                        <div>
                          <Label className="text-gray-700">ABN</Label>
                          <Input 
                            value={currentOrganization.abn || 'Not provided'} 
                            disabled 
                            className="mt-1 bg-gray-50 border-gray-200"
                          />
                        </div>
                        <div>
                          <Label className="text-gray-700">Email</Label>
                          <Input 
                            value={currentOrganization.email || 'Not provided'} 
                            disabled 
                            className="mt-1 bg-gray-50 border-gray-200"
                          />
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => navigate(`/settings/organization/${currentOrganization.id}/edit`)}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Edit Details
                        </Button>
                        <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                              <Mail className="h-4 w-4 mr-2" />
                              Invite Members
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-white">
                            <DialogHeader>
                              <DialogTitle className="text-gray-900">Invite to Organization</DialogTitle>
                              <DialogDescription className="text-gray-600">
                                Send an invitation to join {currentOrganization.name}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label className="text-gray-700">Email Address</Label>
                                <Input
                                  type="email"
                                  placeholder="colleague@example.com"
                                  value={inviteEmail}
                                  onChange={(e) => setInviteEmail(e.target.value)}
                                  className="border-gray-300"
                                />
                              </div>
                              <div>
                                <Label className="text-gray-700">Role</Label>
                                <Select value={inviteRole} onValueChange={setInviteRole}>
                                  <SelectTrigger className="border-gray-300">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="bg-white">
                                    <SelectItem value="viewer">Viewer</SelectItem>
                                    <SelectItem value="member">Member</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              {subscriptionTier === 'skeleton_key' && (
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    id="agency-invite"
                                    checked={isAgencyInvite}
                                    onChange={(e) => setIsAgencyInvite(e.target.checked)}
                                    className="rounded border-gray-300"
                                  />
                                  <Label htmlFor="agency-invite" className="text-gray-700">
                                    Invite as agency client
                                  </Label>
                                </div>
                              )}
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)} className="border-gray-300 text-gray-700">
                                Cancel
                              </Button>
                              <Button onClick={handleInvite} className="bg-blue-600 hover:bg-blue-700 text-white">
                                Send Invitation
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </>
                  ) : (
                    <p className="text-gray-600">No organization selected</p>
                  )}
                </CardContent>
              </Card>

              {/* All Organizations */}
              <Card className="bg-white shadow-sm border border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-gray-900">
                    <span className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-gray-700" />
                      Your Organizations
                    </span>
                    {canCreateMoreOrganizations && (
                      <Dialog open={isCreateOrgDialogOpen} onOpenChange={setIsCreateOrgDialogOpen}>
                        <DialogTrigger asChild>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                            <Plus className="h-4 w-4 mr-2" />
                            New Organization
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white">
                          <DialogHeader>
                            <DialogTitle className="text-gray-900">Create New Organization</DialogTitle>
                            <DialogDescription className="text-gray-600">
                              Set up a new organization for your business
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label className="text-gray-700">Organization Name</Label>
                              <Input
                                placeholder="My Business Name"
                                value={newOrgName}
                                onChange={(e) => setNewOrgName(e.target.value)}
                                className="border-gray-300"
                              />
                            </div>
                            <div>
                              <Label className="text-gray-700">Business Type</Label>
                              <Input
                                placeholder="e.g., Construction, Plumbing, Electrical"
                                value={newOrgType}
                                onChange={(e) => setNewOrgType(e.target.value)}
                                className="border-gray-300"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsCreateOrgDialogOpen(false)} className="border-gray-300 text-gray-700">
                              Cancel
                            </Button>
                            <Button onClick={handleCreateOrganization} className="bg-blue-600 hover:bg-blue-700 text-white">
                              Create Organization
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Organizations you own or have access to
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {userOrganizations.map((org) => (
                      <div
                        key={org.organization_id}
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50/50 hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          {org.access_type === 'agency' ? (
                            <Briefcase className="h-5 w-5 text-purple-500" />
                          ) : (
                            <Building2 className="h-5 w-5 text-blue-500" />
                          )}
                          <div>
                            <p className="font-medium text-gray-900">{org.organization_name}</p>
                            <p className="text-sm text-gray-600">
                              {org.access_type === 'agency' ? 'Agency Access' : `Role: ${org.role}`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {org.is_current && (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800">Current</Badge>
                          )}
                          {!org.is_current && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.location.reload()}
                              className="border-gray-300 text-gray-700 hover:bg-gray-50"
                            >
                              Switch
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="subscription" className="m-0 w-full bg-black">
            <PricingPlans />
          </TabsContent>

          {subscriptionTier === 'skeleton_key' && (
            <TabsContent value="agency" className="mt-0 bg-gray-50">
              <div className="container mx-auto p-6 max-w-6xl">
                <Card className="bg-white shadow-sm border border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-gray-900">Agency Client Management</CardTitle>
                    <CardDescription className="text-gray-600">
                      Manage your client organizations and permissions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Agency management features coming soon...
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}
        </div>
      </Tabs>
    </div>
  );
} 