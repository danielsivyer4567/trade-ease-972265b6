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
import { Building2, Users, Crown, Briefcase, Plus, Mail, Settings, Shield, CreditCard, Zap, Key, MessageSquare, Bot, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { PricingPlans } from "@/path/to/your/PricingPlans"; // Update the import path as needed

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
    // In a real implementation, this would integrate with a payment provider
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
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Organization Settings</h1>
        <p className="text-muted-foreground">Manage your organizations and subscription</p>
      </div>

      <Tabs defaultValue="organizations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="organizations">Organizations</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          {subscriptionTier === 'skeleton_key' && (
            <TabsTrigger value="agency">Client Management</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="organizations" className="space-y-4">
          {/* Current Organization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Current Organization
              </CardTitle>
              <CardDescription>
                Manage your current organization settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentOrganization ? (
                <>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label>Organization Name</Label>
                      <Input 
                        value={currentOrganization.name} 
                        disabled 
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Business Type</Label>
                      <Input 
                        value={currentOrganization.business_type || 'Not specified'} 
                        disabled 
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>ABN</Label>
                      <Input 
                        value={currentOrganization.abn || 'Not provided'} 
                        disabled 
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input 
                        value={currentOrganization.email || 'Not provided'} 
                        disabled 
                        className="mt-1"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => navigate(`/settings/organization/${currentOrganization.id}/edit`)}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Edit Details
                    </Button>
                    <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline">
                          <Mail className="h-4 w-4 mr-2" />
                          Invite Members
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Invite to Organization</DialogTitle>
                          <DialogDescription>
                            Send an invitation to join {currentOrganization.name}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Email Address</Label>
                            <Input
                              type="email"
                              placeholder="colleague@example.com"
                              value={inviteEmail}
                              onChange={(e) => setInviteEmail(e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>Role</Label>
                            <Select value={inviteRole} onValueChange={setInviteRole}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
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
                                className="rounded"
                              />
                              <Label htmlFor="agency-invite">
                                Invite as agency client
                              </Label>
                            </div>
                          )}
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleInvite}>
                            Send Invitation
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground">No organization selected</p>
              )}
            </CardContent>
          </Card>

          {/* All Organizations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Your Organizations
                </span>
                {canCreateMoreOrganizations && (
                  <Dialog open={isCreateOrgDialogOpen} onOpenChange={setIsCreateOrgDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        New Organization
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Organization</DialogTitle>
                        <DialogDescription>
                          Set up a new organization for your business
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Organization Name</Label>
                          <Input
                            placeholder="My Business Name"
                            value={newOrgName}
                            onChange={(e) => setNewOrgName(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Business Type</Label>
                          <Input
                            placeholder="e.g., Construction, Plumbing, Electrical"
                            value={newOrgType}
                            onChange={(e) => setNewOrgType(e.target.value)}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateOrgDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleCreateOrganization}>
                          Create Organization
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </CardTitle>
              <CardDescription>
                Organizations you own or have access to
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {userOrganizations.map((org) => (
                  <div
                    key={org.organization_id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {org.access_type === 'agency' ? (
                        <Briefcase className="h-5 w-5 text-purple-500" />
                      ) : (
                        <Building2 className="h-5 w-5 text-blue-500" />
                      )}
                      <div>
                        <p className="font-medium">{org.organization_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {org.access_type === 'agency' ? 'Agency Access' : `Role: ${org.role}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {org.is_current && (
                        <Badge variant="secondary">Current</Badge>
                      )}
                      {!org.is_current && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.location.reload()}
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
        </TabsContent>

        <TabsContent value="subscription" className="space-y-4">
          <PricingPlans />
        </TabsContent>

        {subscriptionTier === 'skeleton_key' && (
          <TabsContent value="agency" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Agency Client Management</CardTitle>
                <CardDescription>
                  Manage your client organizations and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Agency management features coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
} 