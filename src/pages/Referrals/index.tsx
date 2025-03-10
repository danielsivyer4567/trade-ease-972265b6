
import { useState } from "react";
import { AppLayout } from "@/components/ui/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Copy, Check, Share, Gift, Users, UserPlus, Mail } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

export default function Referrals() {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [userName, setUserName] = useState("John"); // This would come from user profile in a real app
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("staff");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate the referral link with the username and 20% discount
  const referralLink = `https://tradeease.com/signup?ref=${userName}+20`;
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast({
      title: "Copied to clipboard!",
      description: "Your referral link has been copied. Share it with your friends!"
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail) {
      toast({
        title: "Email required",
        description: "Please enter an email address to send the invitation.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Get current user's organization
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("You must be logged in to invite team members");
      }

      const { data: userConfig } = await supabase
        .from('users_configuration')
        .select('organization_id')
        .eq('id', session.user.id)
        .single();

      if (!userConfig?.organization_id) {
        throw new Error("You must be part of an organization to invite members");
      }

      // Send the invitation using the edge function
      const response = await supabase.functions.invoke('organization-invite', {
        body: {
          organizationId: userConfig.organization_id,
          email: inviteEmail,
          role: inviteRole,
          inviterEmail: session.user.email
        }
      });

      if (response.error) throw new Error(response.error.message);
      
      const result = response.data;
      
      if (result.success) {
        toast({
          title: "Invitation sent!",
          description: `An invitation has been sent to ${inviteEmail}`
        });
        setInviteEmail("");
      } else {
        throw new Error(result.message || "Failed to send invitation");
      }
    } catch (error) {
      console.error("Error sending invitation:", error);
      toast({
        title: "Invitation failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return <AppLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Referrals</h1>
        <p className="text-gray-600 border border-slate-300 rounded-md p-3 inline-block">
          Share Trade Ease with your friends and colleagues, and earn rewards!
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-slate-200">
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
              <div className="flex items-center gap-2 bg-slate-300">
                <Input value={referralLink} readOnly className="bg-slate-100 flex-1" />
                <Button variant="outline" size="icon" onClick={copyToClipboard} className="border border-slate-300">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <Button className="w-full mt-2" onClick={copyToClipboard}>
                <span className="border border-slate-300 rounded px-2 py-1">
                  {copied ? "Copied!" : "Copy Referral Link"}
                </span>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-green-500" />
                Rewards
              </CardTitle>
              <CardDescription>
                What you and your friends get from referrals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 bg-slate-200">
              <div className="p-4 rounded-lg space-y-3 bg-slate-300">
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

        {/* Team Invitation Section */}
        <Card className="bg-slate-200 mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-purple-500" />
              Invite Team Members
            </CardTitle>
            <CardDescription>
              Add colleagues to your organization with specific roles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleInvite} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Email Address
                  </label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="colleague@example.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      className="bg-slate-100 flex-1"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="role" className="block text-sm font-medium mb-1">
                    Role
                  </label>
                  <Select
                    value={inviteRole}
                    onValueChange={setInviteRole}
                  >
                    <SelectTrigger id="role" className="bg-slate-100">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="staff">Staff</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="p-4 rounded-lg bg-slate-300">
                <h4 className="font-medium mb-2">Role Permissions:</h4>
                <ul className="text-sm space-y-1">
                  <li className="flex items-start gap-2">
                    <span className="font-semibold min-w-16">Staff:</span> 
                    <span>Can view and work with jobs, customers, and day-to-day operations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold min-w-16">Admin:</span> 
                    <span>Can manage team members, billing, company settings, and all staff permissions</span>
                  </li>
                </ul>
              </div>

              <Button 
                type="submit" 
                className="w-full md:w-auto"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Invitation"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>;
}
