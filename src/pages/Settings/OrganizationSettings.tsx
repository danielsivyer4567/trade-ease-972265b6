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
<<<<<<< HEAD
import { Building2, Users, Briefcase, Plus, Mail, Settings, ArrowLeft, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
=======
import { Building2, Users, Crown, Briefcase, Plus, Mail, Settings, Shield, CreditCard, Zap, Key, MessageSquare, Bot, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { PricingPlans } from "@/components/pricing/PricingPlans";
>>>>>>> 36fe2b8b6a4c5197b88aa6f671b0288a98028ae7

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
<<<<<<< HEAD
  
=======
  const [hasAccess, setHasAccess] = useState(false);
  const [maxUsers, setMaxUsers] = useState(0);

>>>>>>> 36fe2b8b6a4c5197b88aa6f671b0288a98028ae7
  const [isCreateOrgDialogOpen, setIsCreateOrgDialogOpen] = useState(false);
  const [newOrgName, setNewOrgName] = useState('');
  const [newOrgType, setNewOrgType] = useState('');

<<<<<<< HEAD
  const [orgSearchQuery, setOrgSearchQuery] = useState('');
  const [orgSearchResults, setOrgSearchResults] = useState<{ id: string; name: string; requested?: boolean }[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [joinRequestEmail, setJoinRequestEmail] = useState('');
=======
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
>>>>>>> 36fe2b8b6a4c5197b88aa6f671b0288a98028ae7

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

<<<<<<< HEAD
  const handleSearchOrganizations = async () => {
    if (!orgSearchQuery.trim()) {
      setOrgSearchResults([]);
      return;
    }
    setIsSearching(true);
    const { data, error } = await supabase
      .rpc('search_organizations', { p_search_term: orgSearchQuery });

    if (error) {
      toast({
        title: 'Search Failed',
        description: error.message,
        variant: 'destructive',
      });
      setOrgSearchResults([]);
    } else {
      setOrgSearchResults(data || []);
    }
    setIsSearching(false);
  };

  const handleRequestToJoin = async (organizationId: string) => {
    const { error } = await supabase
      .rpc('request_to_join_organization', { p_organization_id: organizationId });

    if (error) {
      toast({
        title: 'Request Failed',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Request Sent',
        description: 'Your request to join has been sent to the organization administrators.',
      });
      setOrgSearchResults(prev =>
        prev.map(org =>
          org.id === organizationId ? { ...org, requested: true } : org
        )
      );
    }
  };

  const handleSendEmailRequest = () => {
    if (!joinRequestEmail.trim()) {
      toast({
        title: 'Email Required',
        description: 'Please enter an email address.',
        variant: 'destructive',
      });
      return;
    }
    // Mock backend call
    console.log(`Sending join request to email: ${joinRequestEmail}`);
    toast({
      title: 'Request Sent',
      description: `A request to join has been sent to ${joinRequestEmail}.`,
    });
    setJoinRequestEmail('');
  };

=======
>>>>>>> 36fe2b8b6a4c5197b88aa6f671b0288a98028ae7
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

<<<<<<< HEAD
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
                <TabsList className="bg-slate-200">
                  <TabsTrigger value="organizations">Organizations</TabsTrigger>
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
              <Card className="mb-6 bg-slate-200">
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
                            className="mt-1 bg-white border-gray-300"
                          />
                        </div>
                        <div>
                          <Label className="text-gray-700">Business Type</Label>
                          <Input 
                            value={currentOrganization.business_type || 'Not specified'} 
                            disabled 
                            className="mt-1 bg-white border-gray-300"
                          />
                        </div>
                        <div>
                          <Label className="text-gray-700">ABN</Label>
                          <Input 
                            value={currentOrganization.abn || 'Not provided'} 
                            disabled 
                            className="mt-1 bg-white border-gray-300"
                          />
                        </div>
                        <div>
                          <Label className="text-gray-700">Email</Label>
                          <Input 
                            value={currentOrganization.email || 'Not provided'} 
                            disabled 
                            className="mt-1 bg-white border-gray-300"
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
                            <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-slate-100">
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
              <Card className="bg-slate-200">
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
                        className="flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-slate-100 hover:bg-white"
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
                              className="border-gray-300 text-gray-700 hover:bg-slate-50"
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

              {/* Join Another Organization Card */}
              <Card className="mt-6 bg-slate-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <Search className="h-5 w-5 text-gray-700" />
                    Join Another Organization
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Find and request to join other organizations on the platform.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-4">
                  {/* Search by Name */}
                  <div>
                    <Label htmlFor="org-search" className="text-gray-700 font-semibold">
                      Find an organization by name
                    </Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        id="org-search"
                        placeholder="Enter organization name..."
                        value={orgSearchQuery}
                        onChange={(e) => setOrgSearchQuery(e.target.value)}
                        className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                      />
                      <Button
                        onClick={handleSearchOrganizations}
                        disabled={isSearching}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {isSearching ? 'Searching...' : 'Search'}
                      </Button>
                    </div>
                    {orgSearchResults.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <h4 className="font-medium text-gray-800">Search Results</h4>
                        {orgSearchResults.map((org) => (
                          <div
                            key={org.id}
                            className="flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-slate-100"
                          >
                            <p className="font-medium text-gray-900">{org.name}</p>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRequestToJoin(org.id)}
                              disabled={org.requested}
                              className="border-gray-300 text-gray-700 hover:bg-slate-50 disabled:opacity-50"
                            >
                              {org.requested ? 'Requested' : 'Request to Join'}
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <Separator className="border-gray-300" />

                  {/* Request via Email */}
                  <div>
                    <Label htmlFor="org-invite-email" className="text-gray-700 font-semibold">
                      Request an invite via email
                    </Label>
                    <p className="text-sm text-gray-500 mt-1">
                      If you know an admin's email, you can send them a join request directly.
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Input
                        id="org-invite-email"
                        type="email"
                        placeholder="Enter admin's email address..."
                        value={joinRequestEmail}
                        onChange={(e) => setJoinRequestEmail(e.target.value)}
                        className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                      />
                      <Button
                        onClick={handleSendEmailRequest}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Send Request
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {subscriptionTier === 'skeleton_key' && (
            <TabsContent value="agency" className="mt-0 bg-gray-50">
              <div className="container mx-auto p-6 max-w-6xl">
                <Card className="bg-slate-200">
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
=======
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
>>>>>>> 36fe2b8b6a4c5197b88aa6f671b0288a98028ae7
      </Tabs>
    </div>
  );
} 