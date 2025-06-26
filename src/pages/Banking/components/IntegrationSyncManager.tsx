import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  RefreshCw, 
  Download, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  Zap,
  Database,
  Building,
  CreditCard,
  Calculator
} from 'lucide-react';
import { aiAccountingService } from '@/services/AIAccountingService';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface IntegrationSyncManagerProps {
  accounts: Array<{
    id: string;
    name: string;
    bank: string;
  }>;
  selectedAccountId?: string;
  onTransactionsImported: (count: number) => void;
}

interface IntegrationStatus {
  name: string;
  icon: React.ComponentType<any>;
  connected: boolean;
  lastSync?: string;
  status: 'idle' | 'syncing' | 'completed' | 'error';
  progress?: number;
  error?: string;
  transactionsCount?: number;
}

interface SyncLog {
  id: string;
  integration_name: string;
  sync_type: string;
  status: string;
  records_processed: number;
  records_successful: number;
  records_failed: number;
  started_at: string;
  completed_at?: string;
  error_message?: string;
}

export default function IntegrationSyncManager({ 
  accounts, 
  selectedAccountId, 
  onTransactionsImported 
}: IntegrationSyncManagerProps) {
  const [integrations, setIntegrations] = useState<IntegrationStatus[]>([
    {
      name: 'Xero',
      icon: Calculator,
      connected: false,
      status: 'idle'
    },
    {
      name: 'QuickBooks',
      icon: Database,
      connected: false,
      status: 'idle'
    },
    {
      name: 'Stripe',
      icon: CreditCard,
      connected: false,
      status: 'idle'
    },
    {
      name: 'PayPal',
      icon: Building,
      connected: false,
      status: 'idle'
    }
  ]);

  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    checkIntegrationStatus();
    fetchSyncLogs();
  }, []);

  const checkIntegrationStatus = async () => {
    try {
      // Check which integrations are connected
      const { data: configs, error } = await supabase
        .from('integration_configs')
        .select('integration_name, status, updated_at');

      if (error) throw error;

      setIntegrations(prev => 
        prev.map(integration => {
          const config = configs?.find(c => c.integration_name === integration.name);
          return {
            ...integration,
            connected: config?.status === 'connected',
            lastSync: config?.updated_at
          };
        })
      );
    } catch (error) {
      console.error('Error checking integration status:', error);
    }
  };

  const fetchSyncLogs = async () => {
    try {
      const { data: logs, error } = await supabase
        .from('integration_sync_logs')
        .select('*')
        .order('started_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setSyncLogs(logs || []);
    } catch (error) {
      console.error('Error fetching sync logs:', error);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  const syncIntegration = async (integrationName: string) => {
    if (!selectedAccountId) {
      toast({
        title: "Select an account",
        description: "Please select a bank account before syncing.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Update UI to show syncing status
      setIntegrations(prev => 
        prev.map(integration => 
          integration.name === integrationName 
            ? { ...integration, status: 'syncing', progress: 0 }
            : integration
        )
      );

      // Create sync log entry
      const { data: syncLog, error: logError } = await supabase
        .from('integration_sync_logs')
        .insert([{
          integration_name: integrationName,
          sync_type: 'import',
          status: 'processing',
          user_id: (await supabase.auth.getUser()).data.user?.id
        }])
        .select()
        .single();

      if (logError) throw logError;

      // Simulate progress updates
      for (let progress = 25; progress <= 75; progress += 25) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIntegrations(prev => 
          prev.map(integration => 
            integration.name === integrationName 
              ? { ...integration, progress }
              : integration
          )
        );
      }

      // Import transactions using AI service
      const transactions = await aiAccountingService.importFromIntegration(
        integrationName, 
        selectedAccountId
      );

      // Update sync log with results
      const { error: updateError } = await supabase
        .from('integration_sync_logs')
        .update({
          status: 'completed',
          records_processed: transactions.length,
          records_successful: transactions.length,
          records_failed: 0,
          completed_at: new Date().toISOString()
        })
        .eq('id', syncLog.id);

      if (updateError) throw updateError;

      // Update UI with success
      setIntegrations(prev => 
        prev.map(integration => 
          integration.name === integrationName 
            ? { 
                ...integration, 
                status: 'completed', 
                progress: 100,
                transactionsCount: transactions.length,
                lastSync: new Date().toISOString()
              }
            : integration
        )
      );

      onTransactionsImported(transactions.length);

      toast({
        title: "Sync completed",
        description: `Imported ${transactions.length} transactions from ${integrationName}`,
      });

      // Refresh logs
      fetchSyncLogs();

      // Reset status after 3 seconds
      setTimeout(() => {
        setIntegrations(prev => 
          prev.map(integration => 
            integration.name === integrationName 
              ? { ...integration, status: 'idle', progress: undefined }
              : integration
          )
        );
      }, 3000);

    } catch (error) {
      console.error(`Error syncing ${integrationName}:`, error);
      
      setIntegrations(prev => 
        prev.map(integration => 
          integration.name === integrationName 
            ? { 
                ...integration, 
                status: 'error', 
                error: error instanceof Error ? error.message : 'Sync failed'
              }
            : integration
        )
      );

      toast({
        title: "Sync failed",
        description: `Failed to sync ${integrationName}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'syncing':
        return <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'syncing':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  const selectedAccount = accounts.find(a => a.id === selectedAccountId);

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-orange-500" />
          <CardTitle className="text-lg">Integration Sync Manager</CardTitle>
        </div>
        <CardDescription>
          Import and sync transactions from your connected accounting and payment platforms.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Account Selection Info */}
        {selectedAccount && (
          <Alert>
            <Building className="h-4 w-4" />
            <AlertDescription>
              Syncing to account: <strong>{selectedAccount.name}</strong> ({selectedAccount.bank})
            </AlertDescription>
          </Alert>
        )}

        {/* Integration Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {integrations.map((integration) => {
            const Icon = integration.icon;
            return (
              <Card key={integration.name} className="p-4">
                <div className="space-y-3">
                  {/* Integration Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{integration.name}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {getStatusIcon(integration.status)}
                      <Badge 
                        variant={integration.connected ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {integration.connected ? 'Connected' : 'Not Connected'}
                      </Badge>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {integration.status === 'syncing' && integration.progress !== undefined && (
                    <div className="space-y-1">
                      <Progress value={integration.progress} className="h-2" />
                      <p className="text-xs text-gray-500">
                        Importing transactions... {integration.progress}%
                      </p>
                    </div>
                  )}

                  {/* Last Sync Info */}
                  {integration.lastSync && (
                    <p className="text-xs text-gray-500">
                      Last sync: {new Date(integration.lastSync).toLocaleDateString()}
                    </p>
                  )}

                  {/* Transaction Count */}
                  {integration.transactionsCount !== undefined && (
                    <p className="text-xs text-green-600">
                      {integration.transactionsCount} transactions imported
                    </p>
                  )}

                  {/* Error Message */}
                  {integration.status === 'error' && integration.error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-xs">
                        {integration.error}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Sync Button */}
                  <Button
                    size="sm"
                    variant={integration.connected ? 'default' : 'outline'}
                    onClick={() => syncIntegration(integration.name)}
                    disabled={!integration.connected || integration.status === 'syncing' || !selectedAccountId}
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {integration.status === 'syncing' ? 'Syncing...' : 'Import Transactions'}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        <Separator />

        {/* Sync History */}
        <div className="space-y-3">
          <h4 className="font-medium">Recent Sync History</h4>
          
          {isLoadingLogs ? (
            <div className="text-center py-4">
              <RefreshCw className="h-6 w-6 animate-spin mx-auto text-gray-400" />
              <p className="text-sm text-gray-500 mt-2">Loading sync history...</p>
            </div>
          ) : syncLogs.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No sync history found. Import transactions to see sync logs here.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-2">
              {syncLogs.map((log) => (
                <Card key={log.id} className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(log.status)}`} />
                      <div>
                        <p className="font-medium text-sm">{log.integration_name}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(log.started_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <Badge 
                        variant={log.status === 'completed' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {log.status}
                      </Badge>
                      {log.records_successful > 0 && (
                        <p className="text-xs text-green-600 mt-1">
                          {log.records_successful} imported
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {log.error_message && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertDescription className="text-xs">
                        {log.error_message}
                      </AlertDescription>
                    </Alert>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}