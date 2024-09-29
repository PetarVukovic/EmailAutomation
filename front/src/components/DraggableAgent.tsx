// src/components/DraggableAgent.tsx

import React from 'react';
import { useDrag } from 'react-dnd';
import { Agent, ItemTypes } from '../types';

interface DraggableAgentProps {
  agent: Agent;
}

const DraggableAgent: React.FC<DraggableAgentProps> = ({ agent }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.AGENT,
    item: agent,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`p-2 bg-blue-500 text-white rounded cursor-pointer text-center ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
    >
      Drag {agent.name}
    </div>
  );
};

export default DraggableAgent;