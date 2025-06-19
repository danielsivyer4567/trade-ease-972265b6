import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Check, Star, Users, Zap, Crown, MessageSquare, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

// --- Interfaces and Data (Copied for standalone use) ---

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

const allTiers: PricingTier[] = [
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
    ],
    limitations: [
      "No automations",
      "No automated texts or emails", 
      "No other functions beyond core features",
      "You can view all other features but cannot actively use them"
    ],
    affiliateEarnings: "Earn 40% on any subscription referral",
    support: "Standard ticket support system",
    cta: { text: "Current Plan" }
  },
  {
    id: "growing",
    name: "Growing Pain Relief",
    price: 75,
    interval: "/month inc GST",
    description: "The Growing Pain Relief plan helps alleviate common business challenges, providing essential features and + optional add-ons as a pay as you go !",
    icon: <Users className="h-5 w-5 text-blue-500" />,
    features: [
      { name: "Organizations: 1", included: true },
      { name: "Users: 3", included: true },
      { name: "Direct website inquiries auto-forwarded", included: true, highlight: true },
      { name: "Auto worker/ABN verification", included: true, highlight: true },
      { name: "Internal communications & tagging", included: true, highlight: true },
    ],
    addOns: [
      "Advanced workflows: Extra cost per setup",
      "Additional Twilio numbers + call/text fees",
      "Ongoing AI token costs"
    ],
    affiliateEarnings: "Earn 40% on any subscription referral",
    support: "Standard ticket support system",
    cta: { text: "Upgrade or Downgrade" }
  },
  {
    id: "premium",
    name: "Premium Edge",
    price: 449,
    interval: "/month",
    description: "Unlock the full potential of our platform with Premium Edge, providing comprehensive tools and unlimited usage for a truly streamlined operation.",
    icon: <Zap className="h-5 w-5" />,
    features: [
      { name: "Everything in Growing, plus...", included: true, highlight: true },
      { name: "AI automated red flagging", included: true, highlight: true },
      { name: "Boundary automated measure", included: true, highlight: true },
      { name: "Accounting software replacement", included: true, highlight: true },
      { name: "150+ personalised automations", included: true, highlight: true },
    ],
    addOns: [
      "Advanced workflows: Extra cost per setup",
      "Additional Twilio numbers + call/text fees",
      "Ongoing AI token costs"
    ],
    affiliateEarnings: "Earn 40% on any subscription referral",
    support: "Priority ticket support system",
    highlight: true,
    cta: { text: "Manage Subscription" }
  },
  {
    id: "skeleton",
    name: "Skeleton Key Access",
    price: "Contact Us",
    description: "The Skeleton Key Access all the control, allowing you to white label our entire business and sell it as your own!",
    icon: <Crown className="h-5 w-5" />,
    features: [
      { name: "Everything in Premium, plus...", included: true, highlight: true },
      { name: "White-label entire business", included: true, highlight: true },
      { name: "Comprehensive A-Z training videos", included: true, highlight: true },
      { name: "Monetization opportunity", included: true, highlight: true },
    ],
    addOns: [
      "Pricing based on conditional setup",
      "AI tokens only additional ongoing cost",
      "Additional Twilio numbers + call/text fees"
    ],
    affiliateEarnings: "Keep all money from your users",
    support: "Highest priority support system",
    cta: { text: "Contact Support" }
  }
];


// --- Main Page Component ---

export default function MyPlanPage() {
  const navigate = useNavigate();
  // For demonstration, we'll hardcode the current plan.
  // In a real app, you would get this from your authentication context or user data.
  const currentPlanId = "premium"; 
  const tier = allTiers.find(t => t.id === currentPlanId);

  if (!tier) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <p>No active plan found.</p>
        <Button onClick={() => navigate('/settings/trade-ease-plan-details')} className="ml-4">
          Choose a Plan
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-black text-white p-8">
        <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-gray-800">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <Button 
                        variant="ghost" 
                        className="text-gray-400 hover:text-white"
                        onClick={() => navigate('/settings/trade-ease-plan-details')}
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Plan Selection
                    </Button>
                </div>
            </div>
        </div>

      <div className="flex flex-col items-center justify-center pt-16">
        <div className="relative mb-8">
            <Badge className="bg-blue-600 text-white text-2xl font-bold py-2 px-6 rounded-lg shadow-lg">
                My Plan
            </Badge>
        </div>

        <div className="w-full max-w-2xl">
          <Card
            key={tier.id}
            className={cn(
              "relative flex flex-col h-full transition-all duration-300 bg-gray-900 text-white border-2 border-blue-500 shadow-2xl shadow-blue-500/20"
            )}
          >
            {tier.highlight && (
              <motion.div
                className="absolute inset-0 rounded-lg -z-10"
                style={{
                  background: "linear-gradient(45deg, #3b82f6, #60a5fa, #3b82f6)",
                  filter: "blur(16px)",
                }}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0, 0.4, 0],
                  scale: [1, 1.03, 1],
                }}
                transition={{
                  duration: 2.5,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "loop",
                }}
              />
            )}

            <CardHeader className="text-center pb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                {tier.icon}
                <h3 className="text-3xl font-bold">{tier.name}</h3>
              </div>
              <div className="mb-6">
                <div className="flex items-baseline justify-center gap-1">
                  {typeof tier.price === 'number' ? (
                    <>
                      <span className="text-5xl font-bold text-white">${tier.price}</span>
                      <span className="text-lg text-gray-400">/{tier.interval}</span>
                    </>
                  ) : (
                    <span className="text-4xl font-bold text-blue-400">{tier.price}</span>
                  )}
                </div>
              </div>
              <CardDescription className="text-md text-gray-300">{tier.description}</CardDescription>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col justify-between space-y-6 px-8">
                <div>
                    <Separator className="mb-6 border-gray-600" />
                    <h4 className="font-semibold text-lg mb-4 text-white">Core Features</h4>
                    <ul className="space-y-3">
                    {tier.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3 text-md">
                        <Check className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                        <span className={cn(feature.highlight && "font-semibold text-white")}>
                            {feature.name}
                        </span>
                        </li>
                    ))}
                    </ul>
                </div>

              {tier.addOns && tier.addOns.length > 0 && (
                <div>
                    <Separator className="mb-6 border-gray-600" />
                    <h4 className="font-semibold text-lg mb-4 text-white">Your Add-ons</h4>
                    <ul className="space-y-2">
                    {tier.addOns.map((addon, index) => (
                        <li key={index} className="text-md text-gray-300 flex items-start gap-2">
                          <span className="text-blue-400">+</span>
                          {addon}
                        </li>
                    ))}
                    </ul>
                </div>
                )}

              <div className="mt-auto">
                  <Separator className="mt-8 mb-6 border-gray-600" />
                  <div className="text-md space-y-2 text-gray-300">
                      <p className="flex items-center gap-2"><MessageSquare className="h-4 w-4 text-gray-400" /> <span className="font-medium">Support Level:</span> {tier.support}</p>
                      <p className="flex items-center gap-2"><Star className="h-4 w-4 text-gray-400" /> <span className="font-medium">Affiliate Earnings:</span> {tier.affiliateEarnings}</p>
                  </div>
              </div>
            </CardContent>

            <div className="p-8 pt-6">
              <Button
                size="lg"
                className="w-full text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white"
                onClick={tier.cta.onClick}
              >
                {tier.cta.text}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
} 