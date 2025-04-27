import React from 'react';
import { AppLayout } from "@/components/ui/AppLayout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FileText, Plus, FileEdit, Calculator, HardHat, Bug, TestTube } from "lucide-react";
import NewQuote from './NewQuote';

const templatesMenu = [
  { icon: HardHat, label: 'Construction', path: '/templates' },
  { icon: FileText, label: 'Construction Quote', path: '/templates/construction-quote' },
  { icon: FileEdit, label: 'Minimalist Quote', path: '/templates/minimalist-quote' },
  { icon: Calculator, label: 'Construction Estimate', path: '/templates/construction-estimate' },
  { icon: TestTube, label: 'Template Previews', path: '/templates/test' },
  { icon: Bug, label: 'Debug Templates', path: '/templates/debug' },
];

const Quotes = () => {
  const navigate = useNavigate();

  const handleNewQuote = () => {
    navigate('/quotes/new');
  };

  return (
    <AppLayout>
      <div className="container p-6 max-w-7xl mx-auto">
        <div className="flex flex-col gap-8">
          {/* Templates Section */}
          <section>
            <h2 className="text-xl font-bold mb-4">Templates</h2>
            <div className="flex flex-col gap-4">
              {templatesMenu.map(({ icon: Icon, label, path }) => (
                <Button
                  key={label}
                  variant="ghost"
                  className="flex items-center gap-3 justify-start text-base font-medium text-white bg-[#25395a] hover:bg-[#31446a] px-4 py-3 rounded-lg shadow-none border-none w-full max-w-xs"
                  onClick={() => navigate(path)}
                >
                  <Icon className="h-6 w-6 text-white" />
                  <span>{label}</span>
                </Button>
              ))}
            </div>
          </section>

          {/* Quotes Content */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">Quotes</h1>
              <Button className="flex items-center gap-2" onClick={handleNewQuote}>
                <Plus className="h-4 w-4" />
                New Quote
              </Button>
            </div>
            <div className="flex justify-center items-center p-12 border-2 border-dashed rounded-lg">
              <div className="text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No quotes yet</p>
                <Button onClick={handleNewQuote}>Create Your First Quote</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export { Quotes as default, NewQuote };
