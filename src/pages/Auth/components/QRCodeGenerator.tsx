import React from 'react';

interface QRCodeGeneratorProps {
  value: string;
  size?: number;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ value, size = 160 }) => {
  // In a real implementation, you would use a library like qrcode.react
  // For now, we'll create a mockup of what a QR code would look like
  
  const squares = [];
  // Create a grid pattern resembling a QR code
  for (let i = 0; i < 25; i++) {
    const isCornerSquare = 
      (i < 3) || // Top-left
      (i > 21) || // Bottom-left
      (i % 5 === 0 && i < 15) || // Top-right
      (Math.floor(i / 5) === 4 && i > 20); // Bottom-right
      
    const isDataSquare = Math.random() > 0.6;
    
    squares.push(
      <div 
        key={i}
        className={`${isCornerSquare ? 'bg-black' : isDataSquare ? 'bg-black' : 'bg-white'}`}
        style={{
          width: '20%',
          height: '20%',
          position: 'absolute',
          top: `${Math.floor(i / 5) * 20}%`,
          left: `${(i % 5) * 20}%`,
        }}
      >
        {isCornerSquare && (
          <div className="absolute inset-1 bg-white">
            <div className="absolute inset-1 bg-black"></div>
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center">
      <div 
        className="relative bg-white p-2 border border-gray-200 rounded-lg" 
        style={{ width: size, height: size }}
      >
        <div className="relative w-full h-full">
          {squares}
        </div>
      </div>
      <p className="text-xs text-center mt-2 text-gray-500">
        Scan this code with the Trade Ease app
      </p>
    </div>
  );
};

export default QRCodeGenerator; 