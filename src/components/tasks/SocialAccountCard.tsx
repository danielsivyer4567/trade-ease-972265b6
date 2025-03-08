import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Facebook, Instagram, Youtube, Store, Plus } from "lucide-react";
interface SocialAccount {
  id: string;
  platform: string;
  username: string;
  connected: boolean;
}
interface SocialAccountCardProps {
  accounts: SocialAccount[];
  onConnect: (accountId: string) => void;
}
export const getPlatformIcon = (platform: string) => {
  switch (platform) {
    case 'Facebook':
      return <Facebook className="h-5 w-5" />;
    case 'Instagram':
      return <Instagram className="h-5 w-5" />;
    case 'TikTok':
      return <Youtube className="h-5 w-5" />;
    case 'Google Business':
      return <Store className="h-5 w-5" />;
    default:
      return <Plus className="h-5 w-5" />;
  }
};
export function SocialAccountCard({
  accounts,
  onConnect
}: SocialAccountCardProps) {
  return <Card>
      <CardHeader>
        <CardTitle>Connected Accounts</CardTitle>
        <CardDescription>Link your social media accounts to post content</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {accounts.map(account => <div key={account.id} className="flex items-center justify-between p-3 border rounded-lg bg-slate-200">
            <div className="flex items-center gap-3">
              {getPlatformIcon(account.platform)}
              <div>
                <p className="font-medium">{account.platform}</p>
                {account.connected && <p className="text-sm text-gray-500">Connected</p>}
              </div>
            </div>
            <Button variant={account.connected ? "outline" : "default"} onClick={() => onConnect(account.id)}>
              {account.connected ? <span className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  Connected
                </span> : "Connect"}
            </Button>
          </div>)}
      </CardContent>
    </Card>;
}