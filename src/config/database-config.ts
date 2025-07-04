export const DATABASE_CONFIG = {
  // Environment detection
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  
  // Supabase configuration
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    serviceRoleKey: import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY,
  },
  
  // Migration strategies
  migrations: {
    // Auto-apply migrations in development
    autoApply: import.meta.env.DEV,
    
    // Manual migration in production
    manualOnly: import.meta.env.PROD,
    
    // Migration files location
    path: 'supabase/migrations',
  },
  
  // Feature flags for database operations
  features: {
    nccCodes: true,
    subscriptionFeatures: true,
    userSubscriptions: true,
    featureRequests: true,
  },
  
  // Table names
  tables: {
    nccCodes: 'ncc_codes',
    subscriptionFeatures: 'subscription_features',
    userSubscriptions: 'user_subscriptions',
    featureRequests: 'feature_requests',
  },
  
  // RLS (Row Level Security) policies
  rls: {
    enabled: true,
    policies: {
      nccCodes: 'Allow read access to NCC codes for authorized users',
      subscriptionFeatures: 'Allow read access to subscription features',
      userSubscriptions: 'Allow users to read their own subscriptions',
      featureRequests: 'Allow users to manage their own feature requests',
    }
  }
};

export const getTableName = (table: keyof typeof DATABASE_CONFIG.tables): string => {
  return DATABASE_CONFIG.tables[table];
};

export const isFeatureEnabled = (feature: keyof typeof DATABASE_CONFIG.features): boolean => {
  return DATABASE_CONFIG.features[feature];
}; 