export const NCC_CONFIG = {
  // Official NCC and ABCB URLs
  urls: {
    officialNCC: 'https://ncc.abcb.gov.au/',
    abcBWebsite: 'https://www.abcb.gov.au/',
    nccHandbook: 'https://ncc.abcb.gov.au/ncc-online/NCC',
    nccVolume1: 'https://ncc.abcb.gov.au/ncc-online/NCC/Volume-One',
    nccVolume2: 'https://ncc.abcb.gov.au/ncc-online/NCC/Volume-Two',
    nccVolume3: 'https://ncc.abcb.gov.au/ncc-online/NCC/Volume-Three',
    abcBContact: 'https://www.abcb.gov.au/contact-us',
    nccUpdates: 'https://www.abcb.gov.au/ncc/ncc-updates',
    nccGuidance: 'https://www.abcb.gov.au/ncc/ncc-guidance',
  },
  
  // Document references
  documents: {
    businessPlan: '2024-25-ABCB-Business-Plan-overview.pdf',
    nccHandbook: 'NCC-2022-Handbook.pdf',
    complianceGuide: 'NCC-Compliance-Guide.pdf',
  },
  
  // Categories and their official references
  categories: {
    'Structure': {
      volume: 'Volume 1',
      url: 'https://ncc.abcb.gov.au/ncc-online/NCC/Volume-One',
      description: 'General structural requirements for buildings and structures'
    },
    'Fire': {
      volume: 'Volume 1',
      url: 'https://ncc.abcb.gov.au/ncc-online/NCC/Volume-One',
      description: 'Fire safety and resistance requirements'
    },
    'Access': {
      volume: 'Volume 1',
      url: 'https://ncc.abcb.gov.au/ncc-online/NCC/Volume-One',
      description: 'Access and egress requirements'
    },
    'Services and Equipment': {
      volume: 'Volume 1',
      url: 'https://ncc.abcb.gov.au/ncc-online/NCC/Volume-One',
      description: 'Services and equipment requirements'
    },
    'Health and Amenity': {
      volume: 'Volume 1',
      url: 'https://ncc.abcb.gov.au/ncc-online/NCC/Volume-One',
      description: 'Health and amenity requirements'
    },
    'Energy Efficiency': {
      volume: 'Volume 1',
      url: 'https://ncc.abcb.gov.au/ncc-online/NCC/Volume-One',
      description: 'Energy efficiency requirements'
    },
    'Ancillary Provisions': {
      volume: 'Volume 1',
      url: 'https://ncc.abcb.gov.au/ncc-online/NCC/Volume-One',
      description: 'Ancillary provisions and requirements'
    },
    'General': {
      volume: 'Volume 1',
      url: 'https://ncc.abcb.gov.au/ncc-online/NCC/Volume-One',
      description: 'General provisions and interpretation'
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

export const getNCCUrl = (type: keyof typeof NCC_CONFIG.urls): string => {
  return NCC_CONFIG.urls[type];
};

export const getCategoryInfo = (category: string) => {
  return NCC_CONFIG.categories[category as keyof typeof NCC_CONFIG.categories] || null;
};

export const openExternalNCC = (urlType: keyof typeof NCC_CONFIG.urls) => {
  const url = getNCCUrl(urlType);
  window.open(url, '_blank', 'noopener,noreferrer');
}; 