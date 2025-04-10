
export interface IntegrationConfig {
  integration_name: string;
  status: string;
}

export interface Integration {
  title: string;
  icon: React.ElementType;
  description: string;
  path: string;
  category: string;
  apiKeyRequired?: boolean;
  devMode?: boolean;
}
