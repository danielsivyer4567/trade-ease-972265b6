
import React from 'react';
import { NodeTypes } from '@xyflow/react';

// Import node types
import { AutomationNode } from '../nodes/AutomationNode';
import { CustomNode } from '../nodes/CustomNode';
import { CustomerNode } from '../nodes/CustomerNode';
import { JobNode } from '../nodes/JobNode';
import { QuoteNode } from '../nodes/QuoteNode';
import { TaskNode } from '../nodes/TaskNode';
import { MessagingNode } from '../nodes/MessagingNode';
import { VisionNode } from '../nodes/VisionNode';

// Define node types for registration
export const nodeTypes: NodeTypes = {
  automationNode: AutomationNode,
  customNode: CustomNode,
  customer: CustomerNode,
  job: JobNode,
  quote: QuoteNode,
  task: TaskNode,
  messagingNode: MessagingNode,
  visionNode: VisionNode,
};
