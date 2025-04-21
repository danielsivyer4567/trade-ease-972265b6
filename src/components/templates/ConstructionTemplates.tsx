import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { templates } from './index';

const ConstructionTemplates: React.FC = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Debug routing issue - confirm component is rendering
    console.log('ConstructionTemplates mounted');
    console.log('Current route:', window.location.pathname);
    
    // Debug data issue - check if templates array has content
    console.log('Available templates:', templates);
    console.log('Templates array length:', templates.length);
    
    // Debug styling issue - add visible test element
    setIsLoaded(true);
  }, []);

  const handleTemplateClick = (templateId: string) => {
    console.log('Template clicked:', templateId);
    navigate(`/templates/${templateId}`);
  };

  if (templates.length === 0) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded m-6">
        <p className="font-bold">No templates found!</p>
        <p>Templates array is empty. Check the imports in templates/index.ts</p>
      </div>
    );
  }

  return (
    <div className="construction-templates p-6" style={{ backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <h1 className="text-2xl font-bold mb-6">Construction Templates ({templates.length})</h1>
      
      {/* Test element to verify component rendering and styling */}
      {isLoaded && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          <p className="font-bold">Debug element:</p>
          <p>If you can see this, the component is rendering correctly.</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div
            key={template.id}
            className="template-card bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300"
            style={{ 
              minHeight: '200px', 
              display: 'flex', 
              flexDirection: 'column',
              border: '1px solid #e2e8f0'
            }}
            onClick={() => handleTemplateClick(template.id)}
          >
            <div className="p-6 flex-grow">
              <h2 className="text-xl font-semibold mb-2 text-gray-800">{template.name}</h2>
              <p className="text-gray-600">{template.description}</p>
            </div>
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
              <button 
                className="text-blue-600 hover:text-blue-800 font-medium"
                onClick={(e) => {
                  e.stopPropagation();
                  handleTemplateClick(template.id);
                }}
              >
                View Template →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConstructionTemplates; 