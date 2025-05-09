import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Copy, CheckCircle, Building, Users, Scan, QrCode } from "lucide-react";
import { useUserConfig } from "@/components/messaging/hooks/useUserConfig";
import { Separator } from "@/components/ui/separator";
import BarcodeScanner from "./BarcodeScanner";
import QRCodeGenerator from "./QRCodeGenerator";

interface OrganizationSetupProps {
  initialInviteCode?: string | null;
}

export default function OrganizationSetup({ initialInviteCode = null }: OrganizationSetupProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const { updateUserOrganization } = useUserConfig();
  const [organizationName, setOrganizationName] = useState("");
  const [inviteCode, setInviteCode] = useState(initialInviteCode || "");
  const [inviteUrl, setInviteUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCreateOrganization = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organizationName.trim()) {
      toast({
        title: "Organization name required",
        description: "Please enter a name for your organization.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .insert([{ name: organizationName }])
        .select('id, name')
        .single();

      if (orgError) throw orgError;

      const { error: memberError } = await supabase
        .from('organization_members')
        .insert([{
          organization_id: orgData.id,
          user_id: user?.id,
          role: 'owner'
        }]);

      if (memberError) throw memberError;

      await updateUserOrganization(orgData.id);

      const inviteLink = `${window.location.origin}/auth?invite=${orgData.id}`;
      setInviteUrl(inviteLink);

      toast({
        title: "Organization created!",
        description: `${organizationName} has been successfully created.`
      });
    } catch (error: any) {
      toast({
        title: "Error creating organization",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleJoinOrganization = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim()) {
      toast({
        title: "Invite code required",
        description: "Please enter a valid organization invite code.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      let organizationId = inviteCode;
      if (inviteCode.includes('invite=')) {
        organizationId = inviteCode.split('invite=')[1].split('&')[0];
      }

      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .select('id, name')
        .eq('id', organizationId)
        .single();

      if (orgError) throw new Error("Invalid organization code");

      const { data: existingMember, error: memberCheckError } = await supabase
        .from('organization_members')
        .select('id')
        .eq('organization_id', organizationId)
        .eq('user_id', user?.id)
        .maybeSingle();

      if (existingMember) {
        toast({
          title: "Already a member",
          description: "You are already a member of this organization.",
          variant: "default"
        });
        return;
      }

      const { error: memberError } = await supabase
        .from('organization_members')
        .insert([{
          organization_id: organizationId,
          user_id: user?.id,
          role: 'member'
        }]);

      if (memberError) throw memberError;

      await updateUserOrganization(organizationId);

      toast({
        title: "Success!",
        description: `You've joined the organization: ${orgData.name}`
      });
    } catch (error: any) {
      toast({
        title: "Error joining organization",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied!",
      description: "Invite link copied to clipboard"
    });
  };

  const handleCodeScanned = (code: string) => {
    setInviteCode(code);
    toast({
      title: "QR Code Detected",
      description: `Organization code detected: ${code}`,
    });
  };

  return (
    <Tabs defaultValue={initialInviteCode ? "join" : "create"} className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger value="create">
          <Building className="mr-2 h-4 w-4" />
          Create New
        </TabsTrigger>
        <TabsTrigger value="join">
          <Users className="mr-2 h-4 w-4" />
          Join Existing
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="create">
        <form onSubmit={handleCreateOrganization} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="organization-name">Business Name</Label>
            <Input
              id="organization-name"
              placeholder="Enter your business name"
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
              required
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating..." : "Create Organization"}
          </Button>
          
          {inviteUrl && (
            <Card className="mt-4">
              <CardContent className="pt-4">
                <h3 className="font-medium mb-2">Invite Team Members</h3>
                
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  {/* QR Code */}
                  <div className="flex-shrink-0">
                    <QRCodeGenerator value={inviteUrl} />
                  </div>
                  
                  {/* Text Invite */}
                  <div className="flex-grow space-y-2">
                    <p className="text-sm text-gray-500 mb-2">Share this link with your team members:</p>
                    
                    <div className="flex items-center gap-2 bg-slate-100 p-2 rounded-md">
                      <Input 
                        value={inviteUrl} 
                        readOnly 
                        className="bg-transparent border-none" 
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        onClick={copyInviteLink}
                        className="flex-shrink-0"
                      >
                        {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    
                    <p className="text-xs text-gray-500">
                      Team members can scan the QR code or use the link to join your organization.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </form>
      </TabsContent>
      
      <TabsContent value="join">
        <form onSubmit={handleJoinOrganization} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="invite-code">Organization Invite Code</Label>
            <Input
              id="invite-code"
              placeholder="Enter the invitation code"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              required
            />
            <p className="text-xs text-gray-500">
              Enter the organization ID or full invite URL you received
            </p>
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-2">
            <Label className="block mb-2">Or scan QR code</Label>
            <BarcodeScanner onCodeDetected={handleCodeScanned} />
            <p className="text-xs text-gray-500 mt-1">
              Use your device's camera to scan the organization's QR code
            </p>
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Joining..." : "Join Organization"}
          </Button>
        </form>
      </TabsContent>
    </Tabs>
  );
}
