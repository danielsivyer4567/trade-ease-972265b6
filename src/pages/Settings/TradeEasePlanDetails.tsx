import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Check, Star, Users, Zap, Crown, MessageSquare, ArrowLeft, Key } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

// --- Interfaces and Data (Moved from OrganizationSettings) ---

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
      { name: "Unlimited users in 1 organization", included: true },
      { name: "Invoicing", included: true, highlight: true },
      { name: "Quoting", included: true, highlight: true },
      { name: "Single Calendar Management", included: true, highlight: true },
      { name: "Integration with Xero, MYOB, QuickBooks + 50 more", included: true, highlight: true },
      { name: "Integration with external calendars", included: true, highlight: true },
      { name: "40% affiliate commission on any subscription for life - no limit payout", included: true, highlight: true }
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
      { name: "3 users in 1 organization", included: true },
      { name: "Integration with Xero, MYOB, QuickBooks + 50 more", included: true, highlight: true },
      { name: "Integration with external calendars", included: true, highlight: true },
      { name: "Trade specific calculators and features", included: true, highlight: true },
      { name: "Request for free trade specific feature or tool", included: true, highlight: true },
      { name: "Direct website inquiries auto-forwarded", included: true, highlight: true },
      { name: "Auto worker/ABN verification", included: true, highlight: true },
      { name: "Internal communications & tagging", included: true, highlight: true },
      { name: "Tax budgeting on each job", included: true, highlight: true },
      { name: "Financial report automation", included: true, highlight: true },
      { name: "Weekly financial report", included: true, highlight: true },
      { name: "Customer progression link", included: true, highlight: true },
      { name: "Customer journey view", included: true, highlight: true },
      { name: "Step by step job process + notify", included: true, highlight: true },
      { name: "40% affiliate commission on any subscription for life - no limit payout", included: true, highlight: true },
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
      { name: "Unlimited users in 1 organization", included: true, highlight: true },
      { name: "Unlimited notification texts to customers and staff", included: true, highlight: true },
      { name: "Unlimited Calendars", included: true, highlight: true },
      { name: "Invoicing & Quoting", included: true, highlight: true },
      { name: "Single Calendar Management", included: true, highlight: true },
      { name: "Integration with Xero, MYOB, QuickBooks + 50 more", included: true, highlight: true },
      { name: "Integration with external calendars", included: true, highlight: true },
      { name: "Trade specific calculators and features", included: true, highlight: true },
      { name: "Request for free trade specific feature or tool", included: true, highlight: true },
      { name: "Business Structure Layout Map", included: true, highlight: true },
      { name: "NCC Code Search via Voice", included: true, highlight: true },
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
      { name: "40% affiliate commission on any subscription for life - no limit payout", included: true, highlight: true }
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
      { name: "Integration with Xero, MYOB, QuickBooks + 50 more", included: true, highlight: true },
      { name: "Integration with external calendars", included: true, highlight: true },
      { name: "Trade specific calculators and features", included: true, highlight: true },
      { name: "Request for free trade specific feature or tool", included: true, highlight: true },
      { name: "NCC Code Search via Voice", included: true, highlight: true },
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
      { name: "Unlimited Calendars", included: true, highlight: true },
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
      { name: "Dedicated developer option", included: true, highlight: true },
      { name: "40% affiliate commission on any subscription for life - no limit payout", included: true, highlight: true }
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

// --- Component (Moved from OrganizationSettings) ---

export function PricingPlans({ tiers = defaultTiers, className }: PricingPlansProps) {
  return (
    <section className={cn("min-h-screen w-full py-12 px-4 bg-black text-white relative overflow-hidden", className)}>
      {/* Smoke Effect Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
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
                  <h3 className="text-xl font-bold">{tier.name}</h3>
                </div>
                <div className="mb-6">
                  <div className="flex items-baseline justify-center gap-1">
                    {typeof tier.price === 'number' ? (
                      <>
                        <span className="text-4xl font-bold text-white">${tier.price}</span>
                        <span className="text-sm text-gray-400">/{tier.interval}</span>
                      </>
                    ) : (
                      <span className="text-2xl font-bold text-blue-500">{tier.price}</span>
                    )}
                  </div>
                </div>
                <CardDescription className="text-sm text-gray-400 min-h-[100px]">{tier.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col justify-between space-y-6">
                  <div>
                      <Separator className="mb-4 border-gray-600" />
                      <h4 className="font-semibold text-sm mb-3 text-white">Core Features</h4>
                      <ul className="space-y-2">
                      {tier.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                          {feature.included ? (
                              <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          ) : (
                              <span className="h-4 w-4 text-white mt-0.5 flex-shrink-0 flex items-center justify-center text-sm font-bold">+</span>
                          )}
                          <span className={cn(feature.highlight && "font-medium text-white", !feature.included && "text-gray-400")}>
                              {feature.name}
                          </span>
                          </li>
                      ))}
                      </ul>
                  </div>

                  {tier.limitations && tier.limitations.length > 0 && (
                  <div>
                      <Separator className="mb-4 border-gray-600" />
                      <h4 className="font-semibold text-sm mb-2 text-red-600">Limitations</h4>
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
                      <Separator className="mb-4 border-gray-600" />
                      <h4 className="text-sm mb-2 text-white">Optional Add-ons</h4>
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

                <div className="mt-auto">
                    <Separator className="mt-6 mb-4 border-gray-600" />
                    <div className="text-xs space-y-1 text-gray-400">
                        <p className="flex items-center gap-1"><MessageSquare className="h-3 w-3 text-gray-400" /> <span className="font-medium">Support:</span> {tier.support}</p>
                        <p className="flex items-center gap-1"><Star className="h-3 w-3 text-gray-400" /> <span className="font-medium">Affiliate:</span> {tier.affiliateEarnings}</p>
                    </div>
                </div>
              </CardContent>

              <div className="p-6 pt-4">
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
      </div>
    </section>
  );
}

// --- Main Page Component ---

export default function TradeEasePlanDetails() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-black">
        <div className="fixed top-0 z-50 w-full bg-black/80 backdrop-blur-sm border-b border-gray-800">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-1">
                      <Button 
                        variant="ghost" 
                        className="text-gray-400 hover:text-white"
                        onClick={() => navigate('/settings')}
                      >
                          <ArrowLeft className="h-4 w-4 mr-2" />
                          Back to Settings
                      </Button>
                    </div>
                    <div className="flex-1 flex justify-center">
                      <Button 
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg px-8 py-3"
                        onClick={() => navigate('/settings/my-plan')}
                      >
                        My Plan Details
                      </Button>
                    </div>
                    <div className="flex-1"></div> {/* Right spacer */}
                </div>
            </div>
        </div>
        <div className="pt-16">
            <PricingPlans />
        </div>
    </div>
  );
} 