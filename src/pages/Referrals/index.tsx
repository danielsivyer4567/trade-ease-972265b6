
import { useState } from "react";
import { AppLayout } from "@/components/ui/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Copy, Check, Share, Gift, Users } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function Referrals() {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [userName, setUserName] = useState("John"); // This would come from user profile in a real app
  
  // Generate the referral link with the username and 20% discount
  const referralLink = `https://tradeease.com/signup?ref=${userName}+20`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast({
      title: "Copied to clipboard!",
      description: "Your referral link has been copied. Share it with your friends!",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Referrals</h1>
        <p className="text-gray-600">Share Trade Ease with your friends and colleagues, and earn rewards!</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share className="h-5 w-5 text-blue-500" />
                Your Referral Link
              </CardTitle>
              <CardDescription>
                Share this link to give new users 20% off their first subscription
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Input 
                  value={referralLink} 
                  readOnly 
                  className="bg-slate-100 flex-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={copyToClipboard}
                  className="border border-slate-300"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <Button 
                className="w-full mt-2"
                onClick={copyToClipboard}
              >
                {copied ? "Copied!" : "Copy Referral Link"}
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-green-500" />
                Rewards
              </CardTitle>
              <CardDescription>
                What you and your friends get from referrals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-slate-100 rounded-lg space-y-3">
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-blue-500 mt-1" />
                  <div>
                    <h3 className="font-medium">New Users Get:</h3>
                    <p className="text-slate-700">20% off their first subscription</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Gift className="h-5 w-5 text-green-500 mt-1" />
                  <div>
                    <h3 className="font-medium">You Get:</h3>
                    <p className="text-slate-700">2 months free for each successful referral</p>
                  </div>
                </div>
              </div>
              
              <div className="text-sm text-slate-600 border-t pt-3">
                <p>Terms & Conditions apply. Rewards are credited after the referred user completes their first payment.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
