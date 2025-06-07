import ConstructionQuote from './ConstructionQuote';
import MinimalistQuote from './MinimalistQuote';
import ConstructionEstimate from './ConstructionEstimate';
import ConstructionTemplate4 from './ConstructionTemplate4';
import ConstructionTemplate5 from './ConstructionTemplate5';
import ConstructionTemplate6 from './ConstructionTemplate6';
import ConstructionTemplate7 from './ConstructionTemplate7';

// Debug imports
console.log('ConstructionQuote loaded:', !!ConstructionQuote);
console.log('MinimalistQuote loaded:', !!MinimalistQuote);
console.log('ConstructionEstimate loaded:', !!ConstructionEstimate);

export interface Template {
  id: string;
  name: string;
  description: string;
  component: React.ComponentType;
}

export const templates: Template[] = [
  {
    id: 'construction-quote',
    name: 'Construction Quote',
    description: 'A professional quote template for construction projects',
    component: ConstructionQuote,
  },
  {
    id: 'minimalist-quote',
    name: 'Minimalist Quote',
    description: 'An elegant, minimalist quote template with a clean design',
    component: MinimalistQuote,
  },
  {
    id: 'construction-estimate',
    name: 'Construction Estimate',
    description: 'A detailed estimate template with line items and totals',
    component: ConstructionEstimate,
  },
  {
    id: 'construction-template-4',
    name: 'Construction Template 4',
    description: 'Professional quote with animations and shimmer effects',
    component: ConstructionTemplate4,
  },
  {
    id: 'construction-template-5',
    name: 'Construction Template 5',
    description: 'Clean construction quote with grid patterns and cards',
    component: ConstructionTemplate5,
  },
  {
    id: 'construction-template-6',
    name: 'Construction Template 6',
    description: 'Modern construction quote with dot patterns and badges',
    component: ConstructionTemplate6,
  },
  {
    id: 'construction-template-7',
    name: 'Construction Template 7',
    description: 'Professional quote with cards, badges, and hard hat theme',
    component: ConstructionTemplate7,
  },
];

// Debug templates array
console.log('Templates array created with', templates.length, 'items');

export default templates; 