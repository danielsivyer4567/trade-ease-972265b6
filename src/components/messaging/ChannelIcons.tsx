import React from 'react';

export interface ChannelIconProps {
  name: 'phone' | 'sms' | 'email' | 'whatsapp' | 'facebook' | 'instagram' | 'tiktok' | 'google' | 'linkedin' | 'twitter' | 'youtube';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ChannelIcon: React.FC<ChannelIconProps> = ({ 
  name, 
  size = 'md',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-7 h-7',
    lg: 'w-10 h-10'
  };

  const getIconPath = () => `/images/channel-icons/${name}.svg`;

  return (
    <div className={`relative ${sizeClasses[size]} ${className} flex items-center justify-center overflow-hidden`}>
      <img 
        src={getIconPath()} 
        alt={`${name} icon`} 
        className="w-full h-full object-contain filter drop-shadow-md"
      />
    </div>
  );
};

// Create a circle background for icons that need it
export const ChannelIconWithBg: React.FC<ChannelIconProps & {bgColor?: string}> = ({ 
  name, 
  size = 'md',
  className = '',
  bgColor = 'bg-white'
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6 p-1',
    md: 'w-8 h-8 p-1.5',
    lg: 'w-12 h-12 p-2'
  };

  return (
    <div className={`${sizeClasses[size]} rounded-full ${bgColor} shadow-sm flex items-center justify-center ${className}`}>
      <ChannelIcon name={name} size={size} />
    </div>
  );
};

// Social media brand colors for easy styling
export const BRAND_COLORS = {
  phone: 'bg-blue-600',
  sms: 'bg-blue-500',
  email: 'bg-orange-600',
  whatsapp: 'bg-green-500',
  facebook: 'bg-[#1877F2]',
  instagram: 'bg-gradient-to-tr from-[#FEDA75] via-[#FA7E1E] via-[#D62976] via-[#962FBF] to-[#4F5BD5]',
  tiktok: 'bg-black',
  google: 'bg-white border border-gray-200',
  linkedin: 'bg-[#0A66C2]',
  twitter: 'bg-[#1DA1F2]',
  youtube: 'bg-[#FF0000]'
}; 