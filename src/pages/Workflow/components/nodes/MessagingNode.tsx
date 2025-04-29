import React from 'react';
import { MessageSquare, Mail, Phone } from 'lucide-react';
import { BaseNode } from './BaseNode';

export function MessagingNode({ data, id, selected }) {
  const getIcon = () => {
    switch (data.type) {
      case 'email':
        return <Mail className="h-4 w-4 text-blue-600" />;
      case 'sms':
        return <Phone className="h-4 w-4 text-green-600" />;
      case 'whatsapp':
        return <MessageSquare className="h-4 w-4 text-green-600" />;
      default:
        return <MessageSquare className="h-4 w-4 text-blue-600" />;
    }
  };

  const getColor = () => {
    switch (data.type) {
      case 'email':
        return '#3b82f6'; // blue
      case 'sms':
        return '#22c55e'; // green
      case 'whatsapp':
        return '#25D366'; // whatsapp green
      default:
        return '#3b82f6'; // blue
    }
  };

  return (
    <BaseNode
      data={data}
      id={id}
      selected={selected}
      type="messaging"
      color={getColor()}
      icon={getIcon()}
    />
  );
}
