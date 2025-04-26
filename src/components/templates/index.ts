import ConstructionQuote from './ConstructionQuote';
import MinimalistQuote from './MinimalistQuote';
import ConstructionEstimate from './ConstructionEstimate';

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
];

// Debug templates array
console.log('Templates array created with', templates.length, 'items');

export default templates; 