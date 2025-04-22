import { ReactNode } from "react";

export interface SettingsPageTemplateProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export default function SettingsPageTemplate({
  title,
  description,
  children
}: SettingsPageTemplateProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}
