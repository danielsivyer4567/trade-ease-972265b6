import React, { useState } from 'react';
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

interface AddOn {
  name: string;
  price: number;
  included: boolean;
  id: string;
  unit?: string;
}

const allFeatures: AddOn[] = [
  // Core & Growing Features
  { id: 'unlimited-users-in-org', name: "Unlimited users in 1 organization", price: 30, included: false, unit: 'per user' },
  { id: 'unlimited-notification-texts', name: "Unlimited notification texts to customers and staff", price: 20, included: false },
  { id: 'unlimited-calendars', name: "Unlimited Calendars", price: 20, included: false },
  { id: 'invoicing', name: "Invoicing & Quoting", price: 0, included: true },
  { id: 'calendar', name: "Single Calendar Management", price: 0, included: true },
  { id: 'accounting-integration', name: "Integration with Xero, MYOB, QuickBooks + 50 more", price: 0, included: true },
  { id: 'calendar-integration', name: "Integration with external calendars", price: 0, included: true },
  { id: 'trade-calculators', name: "Trade specific calculators and features", price: 0, included: true },
  { id: 'feature-request', name: "Request for free trade specific feature or tool", price: 0, included: true },
  { id: 'affiliate-commission', name: "40% affiliate commission on any subscription for life - no limit payout", price: 0, included: true },
  { id: 'business-structure-map', name: "Business Structure Layout Map", price: 25, included: false },
  { id: 'ncc-voice-search', name: "NCC Code Search via Voice", price: 30, included: false },
  { id: 'web-inquiries', name: "Direct website inquiries auto-forwarded", price: 15, included: false },
  { id: 'abn-verify', name: "Auto worker/ABN verification", price: 5, included: false },
  { id: 'internal-comms', name: "Internal communications & tagging", price: 10, included: false },
  { id: 'tax-budgeting', name: "Tax budgeting on each job", price: 15, included: false },
  { id: 'financial-reports', name: "Financial report automation", price: 20, included: false },
  { id: 'weekly-reports', name: "Weekly financial report", price: 10, included: false },
  { id: 'customer-link', name: "Customer progression link", price: 10, included: false },
  { id: 'customer-journey', name: "Customer journey view", price: 10, included: false },
  { id: 'step-by-step-job', name: "Step by step job process + notify", price: 15, included: false },
  { id: 'ai-red-flagging', name: "AI automated red flagging", price: 25, included: false },
  { id: 'price-rise-alerts', name: "Invoice/job price rise alerts", price: 15, included: false },
  { id: 'material-order-filter', name: "Material order quantity error filter", price: 10, included: false },
  { id: 'receipt-upload-ai', name: "Receipt upload AI read and sort", price: 20, included: false },
  { id: 'boundary-measure', name: "Boundary automated measure", price: 30, included: false },
  { id: 'accounting-replacement', name: "Accounting software replacement", price: 50, included: false },
  { id: 'instant-signings', name: "Instant digital signings", price: 25, included: false },
  { id: 'popup-variations', name: "Instant pop-up signed variations", price: 20, included: false },
  { id: 'weather-notifications', name: "Weather notifications (voice)", price: 15, included: false },
  { id: 'new-number-forwarding', name: "New number forwarding", price: 10, included: false },
  { id: 'compliance-updates', name: "Compliance updates", price: 15, included: false },
  { id: 'personalized-automations', name: "150+ personalised automations", price: 40, included: false },
  { id: 'tag-drop-system', name: "Tag drop system for admin", price: 15, included: false },
  { id: 'site-approval-requests', name: "Site to boss approval requests", price: 20, included: false },
  { id: 'admin-approval-requests', name: "Admin to boss approval requests", price: 20, included: false },
  { id: 'custom-quote-templates', name: "Customizable quote templates", price: 25, included: false },
  { id: 'payment-links', name: "Payment links", price: 15, included: false },
  { id: 'remittance-upload', name: "Remittance upload", price: 10, included: false },
  { id: 'instant-payment', name: "Instant payment (no dongle)", price: 30, included: false },
  { id: 'social-media-upload', name: "Upload once to all social media", price: 20, included: false },
  { id: 'white-label', name: "White-label entire business", price: 100, included: false },
  { id: 'training-videos', name: "Comprehensive A-Z training videos", price: 50, included: false },
  { id: 'monetization', name: "Monetization opportunity", price: 75, included: false },
  { id: 'dedicated-developer', name: "Optional dedicated developer", price: 200, included: false }
];

interface PricingTier {
  id: string;
  name: string;
  price: string | number;
  interval?: string;
  description: string;
  includedFeatureIds: string[];
  addOns?: AddOn[];
  limitations?: string[];
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
    includedFeatureIds: ['orgs-1', 'users-1', 'invoicing', 'calendar', 'accounting-integration', 'calendar-integration', 'affiliate-commission'],
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
    includedFeatureIds: ['orgs-1', 'users-3', 'invoicing', 'calendar', 'accounting-integration', 'calendar-integration', 'trade-calculators', 'feature-request', 'web-inquiries', 'abn-verify', 'internal-comms', 'tax-budgeting', 'financial-reports', 'weekly-reports', 'customer-link', 'customer-journey', 'step-by-step-job', 'affiliate-commission'],
    addOns: [
      { id: 'adv-workflows', name: "Advanced workflows", price: 25, included: false },
      { id: 'twilio', name: "Additional Twilio numbers + call/text fees", price: 10, included: false },
      { id: 'ai-tokens', name: "Ongoing AI token costs", price: 15, included: false },
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
    includedFeatureIds: [
      'unlimited-users-in-org', 'unlimited-notification-texts', 'unlimited-calendars', 'invoicing', 'calendar', 'accounting-integration', 'calendar-integration', 'trade-calculators', 'feature-request', 'affiliate-commission', 'business-structure-map', 'web-inquiries', 'abn-verify', 'internal-comms',
      'tax-budgeting', 'financial-reports', 'weekly-reports', 'customer-link', 'customer-journey',
      'step-by-step-job', 'ai-red-flagging', 'price-rise-alerts', 'material-order-filter', 'receipt-upload-ai',
      'boundary-measure', 'accounting-replacement', 'instant-signings', 'popup-variations', 'weather-notifications',
      'new-number-forwarding', 'compliance-updates', 'personalized-automations', 'tag-drop-system', 'site-approval-requests',
      'admin-approval-requests', 'custom-quote-templates', 'payment-links', 'remittance-upload', 'instant-payment',
      'social-media-upload'
    ],
    addOns: [
      { id: 'adv-workflows-prem', name: "Advanced workflows", price: 20, included: true },
      { id: 'twilio-prem', name: "Additional Twilio numbers + call/text fees", price: 8, included: false },
      { id: 'ai-tokens-prem', name: "Ongoing AI token costs", price: 12, included: false },
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
    includedFeatureIds: [
      'orgs-1', 'users-3', 'invoicing', 'calendar', 'web-inquiries', 'abn-verify', 'internal-comms',
      'ai-red-flagging', 'price-rise-alerts', 'material-order-filter', 'receipt-upload-ai', 'boundary-measure', 'accounting-replacement',
      'white-label', 'training-videos', 'monetization', 'dedicated-developer'
    ],
    addOns: [
      { id: 'setup-sk', name: "Pricing based on conditional setup", price: 0, included: true },
      { id: 'ai-tokens-sk', name: "AI tokens only additional ongoing cost", price: 10, included: false },
      { id: 'twilio-sk', name: "Additional Twilio numbers + call/text fees", price: 5, included: false },
    ],
    affiliateEarnings: "Keep all money from your users",
    support: "Highest priority support system",
    cta: { text: "Contact Support" }
  }
];


// --- Main Page Component ---

export default function MyPlanPage() {
  const navigate = useNavigate();
  const [isManaging, setIsManaging] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(() => {
    // In a real app, this would come from user data.
    const currentPlanId = "premium"; 
    return allTiers.find(t => t.id === currentPlanId);
  });
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);

  if (!currentPlan) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <p>No active plan found.</p>
        <Button onClick={() => navigate('/settings/trade-ease-plan-details')} className="ml-4">
          Choose a Plan
        </Button>
      </div>
    );
  }

  const handleToggleAddOn = (addOnId: string) => {
    if (!isManaging) return;

    setSelectedAddOns(prev =>
      prev.includes(addOnId)
        ? prev.filter(id => id !== addOnId)
        : [...prev, addOnId]
    );
  };

  const calculateTotalPrice = () => {
    const basePrice = typeof currentPlan.price === 'number' ? currentPlan.price : 0;
    const addOnsPrice = currentPlan.addOns
      ?.filter(addOn => selectedAddOns.includes(addOn.id))
      .reduce((total, addOn) => total + addOn.price, 0) ?? 0;
    return basePrice + addOnsPrice;
  };

  const totalMonthlyPrice = calculateTotalPrice();
  
  const tier = currentPlan;

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
                  {isManaging && selectedAddOns.length > 0 ? (
                      <span className="text-5xl font-bold text-green-400">${totalMonthlyPrice}</span>
                  ) : (
                    typeof tier.price === 'number' ? (
                      <>
                        <span className="text-5xl font-bold text-white">${tier.price}</span>
                        <span className="text-lg text-gray-400">/{tier.interval}</span>
                      </>
                    ) : (
                      <span className="text-4xl font-bold text-blue-400">{tier.price}</span>
                    )
                  )}
                </div>
              </div>
              <CardDescription className="text-md text-gray-300">
                {isManaging && selectedAddOns.length > 0 ? (
                  `Including ${selectedAddOns.length} add-on(s) for an extra $${totalMonthlyPrice - (typeof tier.price === 'number' ? tier.price : 0)}/month.`
                ) : (
                  tier.description
                )}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col justify-between space-y-6 px-8">
                <div>
                    <Separator className="mb-6 border-gray-600" />
                    <h4 className="font-semibold text-lg mb-4 text-white">Plan Features & Add-ons</h4>
                    <ul className="space-y-3">
                    {allFeatures.map((feature) => {
                        const isIncluded = tier.includedFeatureIds.includes(feature.id);
                        const isSelected = selectedAddOns.includes(feature.id);

                        return (
                            <li 
                              key={feature.id} 
                              className={cn(
                                "text-md text-gray-300 flex items-center justify-between p-2 rounded-md",
                                isManaging && !isIncluded && "cursor-pointer hover:bg-gray-800",
                                isSelected && "bg-blue-900/50"
                              )}
                              onClick={() => !isIncluded && handleToggleAddOn(feature.id)}
                            >
                              <div className="flex items-center gap-3">
                                {isIncluded ? (
                                  <Check className="h-5 w-5 text-green-400" />
                                ) : (
                                  <span className={cn(
                                    "h-5 w-5 flex items-center justify-center rounded-sm text-lg",
                                    isManaging ? "text-blue-400" : "text-gray-500"
                                  )}>
                                    {isSelected ? <Check /> : '+'}
                                  </span>
                                )}
                                {feature.name}
                              </div>
                              <div className="flex items-center gap-2">
                                {isIncluded && feature.price > 0 && (
                                    <s className="text-red-400/70 text-sm">${feature.price}{feature.unit ? ` ${feature.unit}` : ''}</s>
                                )}
                                <span className={cn(
                                  "font-semibold",
                                  isIncluded ? "text-green-400" : "text-blue-400"
                                )}>
                                  {isIncluded ? 'Included' : `+$${feature.price}${feature.unit ? ` ${feature.unit}` : '/mo'}`}
                                </span>
                              </div>
                            </li>
                        );
                    })}
                    </ul>
                </div>

              {tier.addOns && tier.addOns.length > 0 && (
                <div>
                    <Separator className="mb-6 border-gray-600" />
                    <h4 className="font-semibold text-lg mb-4 text-white">Your Add-ons</h4>
                    <ul className="space-y-2">
                    {tier.addOns.map((addon) => (
                        <li 
                          key={addon.id} 
                          className={cn(
                            "text-md text-gray-300 flex items-center justify-between p-2 rounded-md",
                            isManaging && !addon.included && "cursor-pointer hover:bg-gray-800",
                            selectedAddOns.includes(addon.id) && "bg-blue-900/50"
                          )}
                          onClick={() => handleToggleAddOn(addon.id)}
                        >
                          <div className="flex items-center gap-2">
                            {addon.included ? (
                              <Check className="h-5 w-5 text-green-500" />
                            ) : (
                              <span className={cn(
                                "h-5 w-5 flex items-center justify-center rounded-sm text-lg",
                                isManaging ? "text-blue-400" : "text-gray-500"
                              )}>
                                {selectedAddOns.includes(addon.id) ? <Check /> : '+'}
                              </span>
                            )}
                            {addon.name}
                          </div>
                          <span className={cn(
                            "font-semibold",
                            addon.included ? "text-green-500" : "text-blue-400"
                          )}>
                            {addon.included ? 'Included' : `+$${addon.price}/mo`}
                          </span>
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
                onClick={() => setIsManaging(!isManaging)}
              >
                {isManaging ? 'Confirm & Update Plan' : 'Manage Subscription'}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
} 