import React from 'react';
import { 
  ReactFlow,
  ReactFlowProvider, 
  Controls, 
  Background,
  useNodesState,
  useEdgesState,
  addEdge
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: 'Test Node 1' } },
  { id: '2', position: { x: 100, y: 100 }, data: { label: 'Test Node 2' } },
];

const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

function MinimalFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = (params) => setEdges((eds) => addEdge(params, eds));

  return (
    <div style={{ width: '100%', height: '400px', border: '2px solid red' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}

export function MinimalFlowTest() {
  return (
    <div style={{ padding: '20px', background: 'white' }}>
      <h2>Minimal React Flow Test</h2>
      <p>If you can see and drag the nodes below, React Flow is working:</p>
      <ReactFlowProvider>
        <MinimalFlow />
      </ReactFlowProvider>
    </div>
  );
} 