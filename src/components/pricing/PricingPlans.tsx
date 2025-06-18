"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Check, X, Users, Calendar, MessageSquare, Zap, Phone, Star, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

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
    icon: <Star className="h-5 w-5" />,
    features: [
      { name: "Organizations: 1", included: true },
      { name: "Users: 1", included: true },
      { name: "Invoicing", included: true, highlight: true },
      { name: "Quoting", included: true, highlight: true },
      { name: "Calendar management", included: true, highlight: true },
      { name: "Automations", included: false },
      { name: "Automated texts or emails", included: false },
      { name: "Advanced features", included: false }
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
    description: "The Growing Pain Relief plan helps alleviate common business challenges, providing essential features and optional add-ons to demonstrate further value.",
    icon: <Users className="h-5 w-5" />,
    features: [
      { name: "Organizations: 1", included: true },
      { name: "Users: 3", included: true },
      { name: "Direct website inquiries auto-forwarded", included: true, highlight: true },
      { name: "Auto worker/ABN verification", included: true, highlight: true },
      { name: "Internal communications & tagging", included: true, highlight: true },
      { name: "Automated Text Messages", included: false },
      { name: "Automations", included: false },
      { name: "AI Agent Systems", included: false }
    ],
    addOns: [
      "Automated Text Messages: +$20/month + 10c per text/email",
      "Automations: Cost per setup + monthly cost",
      "AI Agent Systems: Setup fees + monthly costs + per-AI credit charges"
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
    icon: <Zap className="h-5 w-5" />,
    features: [
      { name: "Users: 15 (all features included)", included: true },
      { name: "Every platform feature unlocked", included: true, highlight: true },
      { name: "Unlimited free texts", included: true, highlight: true },
      { name: "Unlimited automations & follow-ups", included: true, highlight: true },
      { name: "Unlimited automatic review requests", included: true, highlight: true },
      { name: "Call through app with new number", included: true, highlight: true },
      { name: "Free basic workflow setup", included: true, highlight: true },
      { name: "Free basic bot systems", included: true, highlight: true }
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
    description: "The Skeleton Key Access plan offers ultimate flexibility and control, allowing you to white-label our entire business and build your own.",
    icon: <Crown className="h-5 w-5" />,
    features: [
      { name: "White-label entire business", included: true, highlight: true },
      { name: "Comprehensive A-Z training videos", included: true, highlight: true },
      { name: "Monetization opportunity", included: true, highlight: true },
      { name: "Texts included for you", included: true, highlight: true },
      { name: "Unlimited access to all features", included: true, highlight: true },
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
    <section className={cn("py-12 px-4 bg-background", className)}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Choose Your Plan
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Select the perfect plan for your business needs. Start free and upgrade as you grow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((tier) => (
            <Card
              key={tier.id}
              className={cn(
                "relative flex flex-col h-full transition-all duration-300 hover:shadow-lg",
                tier.highlight && "border-primary shadow-lg scale-105",
                                tier.popular && "border-blue-500"
              )}
            >
                            {tier.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-500 text-white">
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  {tier.icon}
                  <CardTitle className="text-xl font-bold">
                    {tier.name}
                  </CardTitle>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-baseline justify-center gap-1">
                    {typeof tier.price === 'number' ? (
                      <>
                        <span className="text-3xl font-bold">${tier.price}</span>
                        <span className="text-sm text-muted-foreground">
                          {tier.interval}
                        </span>
                      </>
                    ) : (
                      <span className="text-2xl font-bold text-primary">
                        {tier.price}
                      </span>
                    )}
                  </div>
                </div>

                <CardDescription className="text-sm leading-relaxed">
                  {tier.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1 space-y-4">
                {/* Core Features */}
                <div>
                  <h4 className="font-semibold text-sm mb-3 text-foreground">
                    Core Features
                  </h4>
                  <ul className="space-y-2">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        {feature.included ? (
                          <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        ) : (
                          <X className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                        )}
                        <span className={cn(
                          feature.highlight && "font-medium text-primary",
                          !feature.included && "text-muted-foreground"
                        )}>
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Limitations */}
                {tier.limitations && tier.limitations.length > 0 && (
                  <div>
                    <Separator className="my-3" />
                    <h4 className="font-semibold text-sm mb-2 text-red-600">
                      Limitations
                    </h4>
                    <ul className="space-y-1">
                      {tier.limitations.map((limitation, index) => (
                        <li key={index} className="text-xs text-muted-foreground flex items-start gap-1">
                          <span className="text-red-500">•</span>
                          {limitation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Add-ons */}
                {tier.addOns && tier.addOns.length > 0 && (
                  <div>
                    <Separator className="my-3" />
                                        <h4 className="font-semibold text-sm mb-2 text-white">
                      Optional Add-ons
                    </h4>
                    <ul className="space-y-1">
                      {tier.addOns.map((addon, index) => (
                        <li key={index} className="text-xs text-white flex items-start gap-1">
                          <span className="text-white">+</span>
                          {addon}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Support & Earnings */}
                <div className="space-y-2 pt-2">
                  <Separator />
                  <div className="text-xs space-y-1">
                    <p className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      <span className="font-medium">Support:</span> {tier.support}
                    </p>
                    <p className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      <span className="font-medium">Affiliate:</span> {tier.affiliateEarnings}
                    </p>
                  </div>
                </div>
              </CardContent>

              <div className="p-6 pt-0">
                <Button
                  className={cn(
                    "w-full",
                    tier.highlight && "bg-primary hover:bg-primary/90",
                                        tier.popular && "bg-blue-500 hover:bg-blue-600"
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
          <p className="text-sm text-muted-foreground">
            All plans include our core platform features. Upgrade or downgrade at any time.
          </p>
        </div>
      </div>
    </section>
  );
}

export default function Component() {
  return <PricingPlans />;
} 