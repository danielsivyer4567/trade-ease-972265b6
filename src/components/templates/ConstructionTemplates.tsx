import React from 'react';
import { useNavigate } from 'react-router-dom';
import { templates } from './index';

const ConstructionTemplates: React.FC = () => {
  const navigate = useNavigate();

  const handleTemplateClick = (templateId: string) => {
    navigate(`/templates/${templateId}`);
  };

  return (
    <div className="construction-templates p-6">
      <h1 className="text-2xl font-bold mb-6">Construction Templates</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div
            key={template.id}
            className="template-card bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300"
            onClick={() => handleTemplateClick(template.id)}
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">{template.name}</h2>
              <p className="text-gray-600">{template.description}</p>
            </div>
            <div className="bg-gray-50 px-6 py-3">
              <button 
                className="text-blue-600 hover:text-blue-800 font-medium"
                onClick={() => handleTemplateClick(template.id)}
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