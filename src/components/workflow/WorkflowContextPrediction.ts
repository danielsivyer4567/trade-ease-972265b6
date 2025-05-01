import { z } from 'zod';

// Define strict workflow context categories
export const WorkflowContextCategories = {
  BUSINESS: 'business',
  PROJECT: 'project',
  PERSONAL: 'personal',
  TEAM: 'team',
  DOCUMENT: 'document',
  PROCESS: 'process'
} as const;

// Define context labels with their categories
export const WorkflowContextLabels = {
  [WorkflowContextCategories.BUSINESS]: [
    { id: 'invoice', label: 'Invoice Processing', description: 'Handle invoice workflows' },
    { id: 'quote', label: 'Quote Management', description: 'Manage quotation processes' },
    { id: 'client', label: 'Client Management', description: 'Client-related workflows' },
    { id: 'payment', label: 'Payment Processing', description: 'Payment handling workflows' },
  ],
  [WorkflowContextCategories.PROJECT]: [
    { id: 'construction', label: 'Construction Project', description: 'Construction project workflows' },
    { id: 'renovation', label: 'Renovation Project', description: 'Renovation project workflows' },
    { id: 'maintenance', label: 'Maintenance Project', description: 'Maintenance project workflows' },
    { id: 'inspection', label: 'Inspection Project', description: 'Inspection project workflows' },
  ],
  [WorkflowContextCategories.PERSONAL]: [
    { id: 'task', label: 'Personal Tasks', description: 'Personal task management' },
    { id: 'schedule', label: 'Schedule Management', description: 'Personal schedule workflows' },
    { id: 'reminder', label: 'Reminders', description: 'Personal reminder workflows' },
  ],
  [WorkflowContextCategories.TEAM]: [
    { id: 'assignment', label: 'Team Assignment', description: 'Team task assignment workflows' },
    { id: 'collaboration', label: 'Team Collaboration', description: 'Team collaboration processes' },
    { id: 'review', label: 'Team Review', description: 'Team review workflows' },
  ],
  [WorkflowContextCategories.DOCUMENT]: [
    { id: 'contract', label: 'Contract Management', description: 'Contract handling workflows' },
    { id: 'proposal', label: 'Proposal Management', description: 'Proposal handling workflows' },
    { id: 'report', label: 'Report Generation', description: 'Report creation workflows' },
  ],
  [WorkflowContextCategories.PROCESS]: [
    { id: 'approval', label: 'Approval Process', description: 'Approval workflow processes' },
    { id: 'review', label: 'Review Process', description: 'Review workflow processes' },
    { id: 'verification', label: 'Verification Process', description: 'Verification workflows' },
  ],
} as const;

// Validation schema for context labels
export const contextLabelSchema = z.object({
  id: z.string(),
  label: z.string(),
  description: z.string(),
  category: z.enum(Object.values(WorkflowContextCategories) as [string, ...string[]]),
});

export type ContextLabel = z.infer<typeof contextLabelSchema>;

export class WorkflowContextPredictor {
  private static instance: WorkflowContextPredictor;
  private recentlyUsed: Map<string, { label: ContextLabel; count: number }>;
  private readonly MAX_RECENT = 10;

  private constructor() {
    this.recentlyUsed = new Map();
  }

  static getInstance(): WorkflowContextPredictor {
    if (!WorkflowContextPredictor.instance) {
      WorkflowContextPredictor.instance = new WorkflowContextPredictor();
    }
    return WorkflowContextPredictor.instance;
  }

  // Get context suggestions based on input
  getSuggestions(input: string, userId: string): ContextLabel[] {
    const normalizedInput = input.toLowerCase().trim();
    
    if (!normalizedInput) {
      return this.getRecentlyUsed(userId);
    }

    const suggestions: Array<{ label: ContextLabel; score: number }> = [];

    // Search through all categories and labels
    Object.entries(WorkflowContextLabels).forEach(([category, labels]) => {
      labels.forEach(label => {
        const score = this.calculateRelevanceScore(normalizedInput, {
          ...label,
          category: category as keyof typeof WorkflowContextCategories
        });

        if (score > 0) {
          suggestions.push({
            label: {
              ...label,
              category: category as keyof typeof WorkflowContextCategories
            },
            score
          });
        }
      });
    });

    // Sort by score and get top 5
    return suggestions
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(s => s.label);
  }

  // Calculate relevance score for a label
  private calculateRelevanceScore(input: string, label: ContextLabel): number {
    let score = 0;
    const inputWords = input.toLowerCase().split(/\s+/);
    const labelWords = label.label.toLowerCase().split(/\s+/);
    const descWords = label.description.toLowerCase().split(/\s+/);

    // Check for exact matches
    if (label.label.toLowerCase() === input) score += 10;
    if (label.id.toLowerCase() === input) score += 8;
    if (label.description.toLowerCase() === input) score += 6;

    // Check for partial matches in label
    inputWords.forEach(word => {
      if (word.length < 3) return; // Skip very short words
      if (label.label.toLowerCase().includes(word)) score += 3;
      if (label.id.toLowerCase().includes(word)) score += 2;
      if (label.description.toLowerCase().includes(word)) score += 1;
    });

    // Check for word overlap
    const labelWordSet = new Set(labelWords);
    const descWordSet = new Set(descWords);
    inputWords.forEach(word => {
      if (word.length < 3) return;
      if (labelWordSet.has(word)) score += 2;
      if (descWordSet.has(word)) score += 1;
    });

    // Add weight for recently used items
    const recentUsage = this.recentlyUsed.get(`${label.id}-${label.category}`);
    if (recentUsage) {
      score += Math.min(recentUsage.count * 0.5, 3); // Increased max bonus to 3 points
    }

    // Add category-specific bonus
    if (input.toLowerCase().includes(label.category.toLowerCase())) {
      score += 2;
    }

    return score;
  }

  // Record usage of a context label
  recordUsage(label: ContextLabel, userId: string) {
    const key = `${label.id}-${label.category}`;
    const current = this.recentlyUsed.get(key);

    if (current) {
      this.recentlyUsed.set(key, {
        label,
        count: current.count + 1
      });
    } else {
      this.recentlyUsed.set(key, { label, count: 1 });
    }

    // Maintain max size
    if (this.recentlyUsed.size > this.MAX_RECENT) {
      const oldest = Array.from(this.recentlyUsed.entries())
        .sort(([, a], [, b]) => a.count - b.count)[0][0];
      this.recentlyUsed.delete(oldest);
    }
  }

  // Get recently used labels
  private getRecentlyUsed(userId: string): ContextLabel[] {
    return Array.from(this.recentlyUsed.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map(item => item.label);
  }

  // Validate a context label
  validateLabel(label: string): boolean {
    return Object.values(WorkflowContextLabels).some(
      categoryLabels => categoryLabels.some(l => l.id === label || l.label === label)
    );
  }

  // Get full label information
  getLabelInfo(labelId: string): ContextLabel | null {
    for (const [category, labels] of Object.entries(WorkflowContextLabels)) {
      const found = labels.find(l => l.id === labelId);
      if (found) {
        return {
          ...found,
          category: category as keyof typeof WorkflowContextCategories
        };
      }
    }
    return null;
  }
} 