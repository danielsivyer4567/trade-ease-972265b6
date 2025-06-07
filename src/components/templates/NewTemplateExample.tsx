import React from 'react';
import { Card } from '@/components/ui/card';
import { useTemplateEditor } from '../../hooks/useTemplateEditor';
import TemplateEditor from './TemplateEditor';
import '../../styles/template-editor.css';

interface NewTemplateProps {
  title?: string;
  content?: string;
  // Add other props as needed
}

/**
 * Example of how to create a new template with automatic edit mode functionality
 * 
 * Steps to add edit mode to any new template:
 * 1. Import useTemplateEditor hook and TemplateEditor component
 * 2. Import the template-editor.css styles
 * 3. Use the hook to get all edit mode functionality
 * 4. Apply the utility functions for classes and props
 * 5. Render the TemplateEditor component
 */
const NewTemplateExample: React.FC<NewTemplateProps> = ({
  title = "New Template Example",
  content = "This is an example of how to create a template with automatic edit mode functionality."
}) => {
  // 1. Use the template editor hook
  const editor = useTemplateEditor({
    defaultComponents: [
      { id: 'header', type: 'header', title: '📋 Header Section', order: 0 },
      { id: 'content', type: 'content', title: '📄 Content Section', order: 1 },
      { id: 'footer', type: 'footer', title: '🔗 Footer Section', order: 2 }
    ]
  });

  return (
    // 2. Apply container classes using utility function
    <div className={editor.getContainerClasses('min-h-screen bg-background p-8')}>
      
      <div className="template-container max-w-4xl mx-auto" style={{ position: 'relative' }}>
        {/* 3. Add background overlay for background images */}
        {editor.backgroundImage && (
          <div style={editor.getBackgroundOverlayStyles()} />
        )}
        
        {/* 4. Render the editor controls */}
        <TemplateEditor {...editor} />

        {/* 5. Apply section classes and props using utility functions */}
        
        {/* Header Section */}
        <Card 
          className={editor.getSectionClasses('mb-6 p-6 border-2 border-blue-200', 'header')}
          {...editor.getSectionProps('header', 'header')}
        >
          <h1 className="text-3xl font-bold text-center">{title}</h1>
        </Card>

        {/* Content Section */}
        <Card 
          className={editor.getSectionClasses('mb-6 p-6', 'content')}
          {...editor.getSectionProps('content', 'content')}
        >
          <div className="prose max-w-none">
            <p>{content}</p>
            <p>This template automatically has:</p>
            <ul>
              <li>✏️ Edit Mode button</li>
              <li>⚙️ Customize sidebar</li>
              <li>📁 Background image upload & controls</li>
              <li>🎯 Section selection</li>
              <li>🎨 Property editing</li>
              <li>📱 Responsive design</li>
            </ul>
          </div>
        </Card>

        {/* Footer Section */}
        <Card 
          className={editor.getSectionClasses('p-6 bg-gray-50', 'footer')}
          {...editor.getSectionProps('footer', 'footer')}
        >
          <div className="text-center text-sm text-gray-600">
            <p>Footer content goes here</p>
            <p>Created with the reusable template editor system</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default NewTemplateExample;

/**
 * Quick Reference for New Templates:
 * 
 * 1. Required Imports:
 *    - import { useTemplateEditor } from '@/hooks/useTemplateEditor';
 *    - import TemplateEditor from './TemplateEditor';
 *    - import '@/styles/template-editor.css';
 * 
 * 2. Hook Usage:
 *    const editor = useTemplateEditor({
 *      defaultComponents: [
 *        { id: 'section-id', type: 'section-type', title: 'Display Name', order: 0 }
 *      ]
 *    });
 * 
 * 3. Container Setup:
 *    <div className={editor.getContainerClasses('your-base-classes')}>
 *      <div className="template-container" style={{ position: 'relative' }}>
 *        {editor.backgroundImage && <div style={editor.getBackgroundOverlayStyles()} />}
 * 
 * 4. Editor Controls:
 *    <TemplateEditor {...editor} />
 * 
 * 5. Editable Sections:
 *    <YourComponent 
 *      className={editor.getSectionClasses('base-classes', 'section-id')}
 *      {...editor.getSectionProps('section-id', 'section-type')}
 *    >
 * 
 * That's it! Your template now has full edit mode functionality.
 */ 