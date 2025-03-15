
import { useState } from "react";
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Globe } from "lucide-react";
import { toast } from "sonner";

export function ApiAccessCard() {
  const [generatedApiKey, setGeneratedApiKey] = useState<string | null>(null);

  const generateApiKey = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const prefix = 'api_';
    let result = prefix;
    for (let i = 0; i < 32; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setGeneratedApiKey(result);
    toast.success("API key generated successfully");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("API key copied to clipboard");
  };

  return (
    <Card className="glass-card">
      <CardHeader className="bg-slate-200">
        <div className="flex items-center gap-2">
          <div className="bg-orange-100 p-2 rounded-full">
            <Globe className="h-5 w-5 text-orange-600" />
          </div>
          <CardTitle>API Access</CardTitle>
        </div>
        <CardDescription>
          Manage API keys and access
        </CardDescription>
      </CardHeader>
      <CardContent className="bg-slate-200">
        <p className="text-sm text-gray-600 mb-4">
          Generate and manage API keys to allow external services to access your data.
          View request logs and control permissions.
        </p>
        {generatedApiKey && <div className="mb-4 p-2 bg-slate-300 rounded flex items-center justify-between">
            <code className="text-xs overflow-hidden text-ellipsis">{generatedApiKey}</code>
            <Button variant="ghost" size="sm" onClick={() => copyToClipboard(generatedApiKey)} className="ml-2">
              <Copy className="h-4 w-4" />
            </Button>
          </div>}
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex-1 bg-slate-400 hover:bg-slate-300" onClick={generateApiKey}>Generate Key</Button>
          <Button variant="outline" className="flex-1 bg-slate-400 hover:bg-slate-300">View Logs</Button>
        </div>
      </CardContent>
    </Card>
  );
}
