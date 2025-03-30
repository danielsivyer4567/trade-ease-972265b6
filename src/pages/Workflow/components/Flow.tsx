
import React, { useCallback, useState, useEffect, useRef } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { CustomerNode } from './nodes/CustomerNode';
import { JobNode } from './nodes/JobNode';
import { TaskNode } from './nodes/TaskNode';
import { QuoteNode } from './nodes/QuoteNode';
import { CustomNode } from './nodes/CustomNode';
import { VisionNode } from './nodes/VisionNode';
import { AutomationNode } from './nodes/AutomationNode';
import { MessagingNode } from './nodes/MessagingNode';
import { toast } from 'sonner';
import { AutomationIntegrationService } from '@/services/AutomationIntegrationService';

// Define node data types for better type safety
interface BaseNodeData {
  label: string;
  [key: string]: any; // Allow additional properties
}

// Define node types
const nodeTypes = {
  customerNode: CustomerNode,
  jobNode: JobNode,
  taskNode: TaskNode,
  quoteNode: QuoteNode,
  customNode: CustomNode,
  visionNode: VisionNode,
  automationNode: AutomationNode,
  messagingNode: MessagingNode,
  emailNode: MessagingNode,
  whatsappNode: MessagingNode,
  socialNode: CustomNode,
};

export function Flow({ onInit }) {
  // Initial nodes and edges
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const reactFlowInstance = useRef(null);
  const [existingAutomationIds, setExistingAutomationIds] = useState(new Set());

  // Handle connections between nodes
  const onConnect = useCallback((params) => {
    // Special handling for vision nodes connecting to financial nodes
    const sourceNode = nodes.find(node => node.id === params.source);
    const targetNode = nodes.find(node => node.id === params.target);
    
    if (sourceNode?.type === 'visionNode' && targetNode?.type === 'quoteNode') {
      toast.info('Vision analysis will feed data to financial node');
      
      // Simulate processing - in a real app, this would trigger actual data processing
      setTimeout(() => {
        // Extract the financial data from the vision node
        const extractedData = {
          timestamp: new Date().toISOString(),
          amount: Math.floor(Math.random() * 5000) + 1000, // Simulated amount between $1000-$6000
          jobId: targetNode?.data?.jobId || null,
          sourceNodeId: sourceNode.id,
          targetNodeId: targetNode.id
        };
        
        // Store the extracted data in localStorage for use in the financials section
        const existingData = JSON.parse(localStorage.getItem('vision-financial-data') || '[]');
        localStorage.setItem('vision-financial-data', JSON.stringify([...existingData, extractedData]));
        
        toast.success('Financial data extracted and applied');
      }, 1500);
    }
    
    // Trigger automations when they are connected to other nodes
    if (sourceNode?.type === 'automationNode' || targetNode?.type === 'automationNode') {
      const automationNode = sourceNode?.type === 'automationNode' ? sourceNode : targetNode;
      const otherNode = sourceNode?.type === 'automationNode' ? targetNode : sourceNode;
      
      // Record the connection for the automation
      if (automationNode.data.automationId && otherNode?.data?.targetType) {
        AutomationIntegrationService.associateAutomation(
          automationNode.data.automationId,
          otherNode.data.targetType,
          otherNode.data.targetId || 'unknown'
        );
        
        toast.success(`Linked automation to ${otherNode.data.targetType}`);
      }
    }
    
    setEdges((eds) => addEdge({
      ...params,
      markerEnd: { type: MarkerType.ArrowClosed },
      animated: true
    }, eds));
  }, [nodes, setEdges]);

  // Handle node dropping from sidebar
  const onDrop = useCallback((event) => {
    event.preventDefault();
    const type = event.dataTransfer.getData('application/reactflow');
    
    if (!type || !reactFlowInstance.current) {
      return;
    }

    // Get drop position
    const position = reactFlowInstance.current.screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    // Create a new node
    const nodeId = `${type}-${Date.now()}`;
    let newNode = {
      id: nodeId,
      type,
      position,
      data: { label: `New ${type.replace('Node', '')}` } as BaseNodeData,
    };
    
    // Add special handling for specific node types
    if (type === 'visionNode') {
      newNode.data = {
        ...newNode.data,
        label: 'Extract Financial Data'
      };
    } else if (type === 'messagingNode') {
      newNode.data = {
        ...newNode.data,
        label: 'SMS Message',
        messageType: 'sms'
      };
    } else if (type === 'emailNode') {
      newNode.data = {
        ...newNode.data,
        label: 'Email Notification',
        messageType: 'email'
      };
    } else if (type === 'whatsappNode') {
      newNode.data = {
        ...newNode.data,
        label: 'WhatsApp Message',
        messageType: 'whatsapp'
      };
    } else if (type === 'socialNode') {
      newNode.data = {
        ...newNode.data,
        label: 'Social Media Post',
        icon: '📱',
        color: '#4267B2'  // Facebook blue
      };
    }

    setNodes((nds) => nds.concat(newNode));
  }, [setNodes]);

  // Handle drag over
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Track existing automation IDs to prevent duplicates
  useEffect(() => {
    const automationIds = new Set();
    nodes.forEach(node => {
      if (node.type === 'automationNode' && node.data?.automationId) {
        automationIds.add(node.data.automationId);
      }
    });
    setExistingAutomationIds(automationIds);
  }, [nodes]);

  // Set up flow on init
  const onInitFlow = useCallback((instance) => {
    reactFlowInstance.current = instance;
    onInit && onInit(instance);
    
    // Try to load saved workflow if any
    const savedFlow = localStorage.getItem('workflow-data');
    if (savedFlow) {
      try {
        const flow = JSON.parse(savedFlow);
        if (flow.nodes && flow.edges) {
          setNodes(flow.nodes);
          setEdges(flow.edges);
          toast.info('Loaded saved workflow');
        }
      } catch (error) {
        console.error('Error loading saved workflow:', error);
      }
    }
  }, [onInit, setNodes, setEdges]);

  // Handle custom node deletion
  useEffect(() => {
    const handleDeleteNode = (event) => {
      const { id } = event.detail;
      setNodes((nodes) => nodes.filter((node) => node.id !== id));
      setEdges((edges) => edges.filter((edge) => 
        edge.source !== id && edge.target !== id
      ));
    };

    const handleUpdateNode = (event) => {
      const { id, data } = event.detail;
      setNodes((nodes) => nodes.map((node) => 
        node.id === id ? { ...node, data: { ...node.data, ...data } } : node
      ));
    };

    const handleAddAutomation = (event) => {
      const { automationData } = event.detail;
      
      // Check if this automation already exists in the flow
      if (existingAutomationIds.has(automationData.automationId)) {
        toast.info(`Automation "${automationData.label}" already exists in this workflow`);
        return;
      }
      
      // Create a new automation node
      const newNode = {
        id: `automation-${Date.now()}`,
        type: 'automationNode',
        position: { x: 100, y: 100 },
        data: automationData
      };
      
      setNodes((nds) => nds.concat(newNode));
      toast.success(`Added "${automationData.label}" automation to workflow`);
    };

    document.addEventListener('delete-node', handleDeleteNode);
    document.addEventListener('update-node', handleUpdateNode);
    document.addEventListener('add-automation', handleAddAutomation);
    
    return () => {
      document.removeEventListener('delete-node', handleDeleteNode);
      document.removeEventListener('update-node', handleUpdateNode);
      document.removeEventListener('add-automation', handleAddAutomation);
    };
  }, [setNodes, setEdges, existingAutomationIds]);

  return (
    <ReactFlowProvider>
      <div style={{ width: '100%', height: '100%' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={onInitFlow}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background />
          <Controls />
          <Panel position="bottom-right">
            <div className="bg-white p-2 rounded shadow text-xs">
              Drag nodes from left sidebar • Connect nodes by dragging handles
            </div>
          </Panel>
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
}
