import ConstructionQuote from './ConstructionQuote';
import MinimalistQuote from './MinimalistQuote';
import ConstructionEstimate from './ConstructionEstimate';

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

export default templates; 