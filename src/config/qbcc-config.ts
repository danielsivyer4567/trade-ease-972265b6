export const QBCC_CONFIG = {
  // External URLs for QBCC resources
  urls: {
    officialQBCC: 'https://www.qbcc.qld.gov.au',
    formsPortal: 'https://www.qbcc.qld.gov.au/forms',
    licensingPortal: 'https://www.qbcc.qld.gov.au/licensing',
    complaintsPortal: 'https://www.qbcc.qld.gov.au/complaints',
    insurancePortal: 'https://www.qbcc.qld.gov.au/insurance',
    trainingPortal: 'https://www.qbcc.qld.gov.au/training',
  },
  
  // Categories and their official references
  categories: {
    'Licensing': {
      description: 'Licence applications and renewals for contractors, companies, and individuals',
      url: 'https://www.qbcc.qld.gov.au/licensing',
      subcategories: ['Contractor', 'Company', 'Partnership', 'Trust', 'Nominee', 'Renewal', 'Variation']
    },
    'Notifications': {
      description: 'Building work notifications and approvals',
      url: 'https://www.qbcc.qld.gov.au/notifications',
      subcategories: ['Residential', 'Commercial', 'Building', 'Development']
    },
    'Building': {
      description: 'Building approvals and development permits',
      url: 'https://www.qbcc.qld.gov.au/building',
      subcategories: ['Approval', 'Development', 'Permit']
    },
    'Complaints': {
      description: 'Complaint forms and dispute resolution',
      url: 'https://www.qbcc.qld.gov.au/complaints',
      subcategories: ['General', 'Dispute', 'Resolution']
    },
    'Insurance': {
      description: 'Insurance certificates and claims',
      url: 'https://www.qbcc.qld.gov.au/insurance',
      subcategories: ['Certificate', 'Claims']
    },
    'Financial': {
      description: 'Financial information and audit reports',
      url: 'https://www.qbcc.qld.gov.au/financial',
      subcategories: ['Information', 'Audit', 'Report']
    },
    'Training': {
      description: 'Training course approvals and assessments',
      url: 'https://www.qbcc.qld.gov.au/training',
      subcategories: ['Course', 'Assessment']
    }
  },
  
  // Search configuration
  search: {
    maxResults: 50,
    defaultLimit: 20,
    relevanceThreshold: 0.1,
    voiceRecognitionLang: 'en-AU',
  },
  
  // Feature flags
  features: {
    voiceSearch: true,
    categoryFilter: true,
    externalLinks: true,
    documentReferences: true,
    complianceCheck: false, // Future feature
  }
};

/**
 * Get category information by category name
 */
export function getQBCCCategoryInfo(category: string) {
  return QBCC_CONFIG.categories[category as keyof typeof QBCC_CONFIG.categories] || null;
}

/**
 * Open external QBCC resources
 */
export function openExternalQBCC(resource: keyof typeof QBCC_CONFIG.urls) {
  const url = QBCC_CONFIG.urls[resource];
  if (url) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

/**
 * Get all available categories
 */
export function getQBCCCategories(): string[] {
  return Object.keys(QBCC_CONFIG.categories);
}

/**
 * Get subcategories for a specific category
 */
export function getQBCCSubcategories(category: string): string[] {
  const categoryInfo = getQBCCCategoryInfo(category);
  return categoryInfo?.subcategories || [];
} 