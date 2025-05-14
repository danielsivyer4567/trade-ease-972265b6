import React from 'react';
import { ChannelIcon } from './ChannelIcons';

export const IconTest: React.FC = () => {
  const icons = [
    'facebook',
    'instagram',
    'linkedin',
    'whatsapp',
    'tiktok',
    'google',
    'email',
    'phone',
    'sms',
    'twitter',
    'youtube'
  ];

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Icon Test</h2>
      <div className="grid grid-cols-6 gap-4">
        {icons.map(icon => (
          <div key={icon} className="flex flex-col items-center">
            <div className="bg-gray-100 p-3 rounded-lg mb-2">
              <ChannelIcon name={icon as any} size="md" />
            </div>
            <span className="text-xs">{icon}</span>
          </div>
        ))}
      </div>
    </div>
  );
}; 