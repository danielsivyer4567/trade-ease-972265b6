export const TIMBER_QUEENSLAND_CONFIG = {
  // External URLs for Timber Queensland resources
  urls: {
    officialTimberQueensland: 'https://www.timberqueensland.com.au',
    technicalData: 'https://www.timberqueensland.com.au/technical-data',
    specifications: 'https://www.timberqueensland.com.au/specifications',
    spanTables: 'https://www.timberqueensland.com.au/span-tables',
    gradeGuide: 'https://www.timberqueensland.com.au/grade-guide',
    treatmentGuide: 'https://www.timberqueensland.com.au/treatment-guide',
  },
  
  // Categories and their official references
  categories: {
    'Structural Timber': {
      description: 'Structural timber grades and specifications for construction',
      url: 'https://www.timberqueensland.com.au/structural-timber',
      subcategories: ['Pine', 'Hardwood'],
      grades: ['MGP10', 'MGP12', 'F7', 'F8']
    },
    'Treated Timber': {
      description: 'Chemically treated timber for durability and protection',
      url: 'https://www.timberqueensland.com.au/treated-timber',
      subcategories: ['Pine'],
      grades: ['H3', 'H4', 'H5', 'H6']
    },
    'Decking': {
      description: 'Timber decking products and specifications',
      url: 'https://www.timberqueensland.com.au/decking',
      subcategories: ['Hardwood', 'Pine'],
      grades: ['Select Grade', 'Standard Grade', 'Premium Grade']
    },
    'Plywood': {
      description: 'Plywood products for various applications',
      url: 'https://www.timberqueensland.com.au/plywood',
      subcategories: ['Structural', 'Marine', 'Interior', 'Exterior'],
      grades: ['F8', 'F11', 'Marine', 'Standard']
    },
    'Panel Products': {
      description: 'Engineered wood panel products',
      url: 'https://www.timberqueensland.com.au/panel-products',
      subcategories: ['MDF', 'Particleboard', 'OSB'],
      grades: ['Standard', 'Moisture Resistant', 'Fire Rated']
    },
    'Engineered Timber': {
      description: 'Engineered timber products for advanced applications',
      url: 'https://www.timberqueensland.com.au/engineered-timber',
      subcategories: ['LVL', 'Glulam', 'I-Joist', 'CLT'],
      grades: ['F8', 'F11', 'Custom']
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
    spanCalculator: true,
    loadCalculator: true,
  }
};

/**
 * Get category information by category name
 */
export function getTimberQueenslandCategoryInfo(category: string) {
  return TIMBER_QUEENSLAND_CONFIG.categories[category as keyof typeof TIMBER_QUEENSLAND_CONFIG.categories] || null;
}

/**
 * Open external Timber Queensland resources
 */
export function openExternalTimberQueensland(resource: keyof typeof TIMBER_QUEENSLAND_CONFIG.urls) {
  const url = TIMBER_QUEENSLAND_CONFIG.urls[resource];
  if (url) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

/**
 * Get all available categories
 */
export function getTimberQueenslandCategories(): string[] {
  return Object.keys(TIMBER_QUEENSLAND_CONFIG.categories);
}

/**
 * Get subcategories for a specific category
 */
export function getTimberQueenslandSubcategories(category: string): string[] {
  const categoryInfo = getTimberQueenslandCategoryInfo(category);
  return categoryInfo?.subcategories || [];
}

/**
 * Get grades for a specific category
 */
export function getTimberQueenslandGrades(category: string): string[] {
  const categoryInfo = getTimberQueenslandCategoryInfo(category);
  return categoryInfo?.grades || [];
} 