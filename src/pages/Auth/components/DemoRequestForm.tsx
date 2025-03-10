
import React from 'react';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DemoRequestFormProps {
  demoRequestName: string;
  setDemoRequestName: (name: string) => void;
  demoRequestEmail: string;
  setDemoRequestEmail: (email: string) => void;
  demoRequestCompany: string;
  setDemoRequestCompany: (company: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const DemoRequestForm: React.FC<DemoRequestFormProps> = ({
  demoRequestName,
  setDemoRequestName,
  demoRequestEmail,
  setDemoRequestEmail,
  demoRequestCompany,
  setDemoRequestCompany,
  loading,
  setLoading
}) => {
  const handleDemoRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log('Demo request:', { demoRequestName, demoRequestEmail, demoRequestCompany });
      
      toast.success('Demo request submitted successfully! Our team will contact you shortly.');
      
      setDemoRequestName('');
      setDemoRequestEmail('');
      setDemoRequestCompany('');
    } catch (error) {
      console.error('Error requesting demo:', error);
      toast.error('Failed to submit demo request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleDemoRequest} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="demo-name">Full Name</Label>
        <Input 
          id="demo-name" 
          type="text" 
          placeholder="John Doe" 
          value={demoRequestName}
          onChange={(e) => setDemoRequestName(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="demo-email">Email</Label>
        <Input 
          id="demo-email" 
          type="email" 
          placeholder="you@example.com" 
          value={demoRequestEmail}
          onChange={(e) => setDemoRequestEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="demo-company">Company Name</Label>
        <Input 
          id="demo-company" 
          type="text" 
          placeholder="Your Company" 
          value={demoRequestCompany}
          onChange={(e) => setDemoRequestCompany(e.target.value)}
          required
        />
      </div>
      <Button 
        type="submit" 
        className="w-full bg-slate-700 hover:bg-slate-800"
        disabled={loading}
      >
        {loading ? 'Submitting...' : 'Request Demo'}
      </Button>
    </form>
  );
};

export default DemoRequestForm;
