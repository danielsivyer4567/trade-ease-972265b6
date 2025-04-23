import React, { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface SettingsTemplateProps {
  title: string;
  description?: string;
  children: ReactNode;
}

const SettingsTemplate: React.FC<SettingsTemplateProps> = ({ title, description, children }) => {
  return (
    <div className="container mx-auto py-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          {children}
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsTemplate; 