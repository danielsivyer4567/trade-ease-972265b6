# Template Editor System - Automatic Edit Mode for All Templates

This system provides automatic edit mode functionality that can be applied to any template with minimal code. Every new template will automatically get professional editing capabilities.

## ✨ Features

- **🎯 Section Selection**: Click any section to select and edit it
- **⚙️ Right Sidebar**: Comprehensive customization panel
- **🎨 Real-time Editing**: Change colors, borders, spacing, and more
- **📁 Background Images**: Upload, position, and customize background images
- **🎛️ Image Controls**: Size, opacity, position, and fit mode controls
- **📱 Responsive Design**: Works on all screen sizes
- **🔄 Easy Integration**: Just 5 lines to add full functionality

## 🚀 Quick Start

### 1. Required Files

The system consists of these files:
- `src/hooks/useTemplateEditor.ts` - Main hook with all logic
- `src/components/templates/TemplateEditor.tsx` - Reusable UI component
- `src/styles/template-editor.css` - CSS styles for edit mode
- `src/components/templates/NewTemplateExample.tsx` - Example implementation

### 2. Basic Implementation

```tsx
import React from 'react';
import { useTemplateEditor } from '../../hooks/useTemplateEditor';
import TemplateEditor from './TemplateEditor';
import '../../styles/template-editor.css';

const YourNewTemplate = () => {
  // 1. Initialize the editor
  const editor = useTemplateEditor({
    defaultComponents: [
      { id: 'header', type: 'header', title: '📋 Header', order: 0 },
      { id: 'content', type: 'content', title: '📄 Content', order: 1 },
    ]
  });

  return (
    // 2. Apply container classes (will include 'dark' when active)
    <div className={editor.getContainerClasses('min-h-screen p-8')}>
      <div className="template-container max-w-4xl mx-auto" style={{ position: 'relative' }}>
        
        {/* 3. Add background overlay for background images */}
        {editor.backgroundImage && (
          <div style={editor.getBackgroundOverlayStyles()} />
        )}
        
        {/* 4. Add editor controls */}
        <TemplateEditor {...editor} />

        {/* 5. Make sections editable */}
        <div 
          className={editor.getSectionClasses('mb-6 p-6', 'header')}
          {...editor.getSectionProps('header', 'header')}
        >
          <h1>Your Header Content</h1>
        </div>

        <div 
          className={editor.getSectionClasses('p-6', 'content')}
          {...editor.getSectionProps('content', 'content')}
        >
          <p>Your content here</p>
        </div>
      </div>
    </div>
  );
};
```

## 🛠️ API Reference

### useTemplateEditor Hook

```tsx
const editor = useTemplateEditor({
  defaultComponents: TemplateComponent[]
});
```

#### Parameters
- `defaultComponents` (optional): Array of component definitions

#### Returns
All state values, functions, and utilities needed for edit mode.

### TemplateEditor Component

```tsx
<TemplateEditor {...editor} />
```

Renders the edit mode controls and sidebar. Just spread all hook values.

### Utility Functions

```tsx
// Apply edit mode classes to container
editor.getContainerClasses('your-base-classes')

// Apply section classes with selection state
editor.getSectionClasses('base-classes', 'section-id')

// Get data attributes and click handlers
editor.getSectionProps('section-id', 'section-type')
```

## 📋 Component Configuration

Define your template sections:

```tsx
const defaultComponents = [
  { 
    id: 'unique-section-id',        // Unique identifier
    type: 'section-type',           // Type for grouping
    title: '📋 Display Name',       // Shown in sidebar
    order: 0                        // Display order
  },
  // Add more sections...
];
```

## 🎨 Available Edit Features

### Dark Mode
- **Toggle Button**: Sun/moon icon to switch between light and dark modes
- **Automatic Styling**: Applies `.dark` class to the container, enabling `dark:` variants in TailwindCSS.

### Section Selection
- **Hover Effect**: Blue border and highlight
- **Selection**: Red border with "SELECTED" indicator
- **Click to Edit**: Click any section in edit mode

### Background Image Controls (Always Available)
- **Image Upload**: Upload any image file as background
- **Opacity Control**: Adjust background transparency (0-100%)
- **Size Control**: Scale image from 10% to 200%
- **Position Controls**: Horizontal and vertical positioning
- **Fit Modes**: Cover, Contain, Fill, Original Size, Repeat
- **Reset Function**: One-click reset to default position
- **Remove Image**: Clear background image entirely

### Sidebar Properties (Section-Specific)
- **General**: Section titles and basic settings
- **Colors**: Background and text color pickers
- **Borders**: Style, width, and radius controls
- **Spacing**: Padding and margin sliders

### Edit Mode Controls
- **Red Button**: Toggle edit mode on/off
- **Blue Button**: Open/close customization sidebar
- **Edit Indicator**: Top banner when in edit mode

## 🌟 Examples in Codebase

All current templates now use this system:
- `ConstructionTemplate4.tsx` - Animation template with orange theme
- `ConstructionTemplate5.tsx` - Grid pattern template with blue theme
- `ConstructionTemplate6.tsx` - Dot pattern template with orange borders
- `ConstructionTemplate7.tsx` - Hard hat template with color-coded sections
- `ConstructionTemplate8.tsx` - Phased construction quote
- `ConstructionTemplate9.tsx` - Hard hat theme with dark mode support

## 🔧 Advanced Customization

### Custom Component Types

Add new component types to the hook:

```tsx
const componentTypes = [
  { id: 'custom-type', label: '🆕 Custom Section', icon: YourIcon },
  // ... existing types
];
```

### Custom Styles

Override default styles in your template:

```css
.your-template .edit-mode .form-section {
  /* Custom edit mode styles */
}

.your-template.dark .your-element {
  /* Custom dark mode styles */
}
```

### Dynamic Components

Update components at runtime:

```tsx
const editor = useTemplateEditor();

// Add new component
const addComponent = () => {
  editor.setComponents(prev => [...prev, newComponent]);
};
```

## ✅ Checklist for New Templates

- [ ] Import required modules
- [ ] Initialize `useTemplateEditor` hook
- [ ] Add `<TemplateEditor {...editor} />` 
- [ ] Apply `getContainerClasses()` to main container
- [ ] Add `template-container` class to content wrapper with `position: relative`
- [ ] Add background image overlay: `{editor.backgroundImage && <div style={editor.getBackgroundOverlayStyles()} />}`
- [ ] Use `getSectionClasses()` and `getSectionProps()` on each section
- [ ] Import `template-editor.css` styles
- [ ] Test edit mode functionality
- [ ] Test background image upload and controls
- [ ] Test dark mode toggling

## 🎯 Best Practices

1. **Consistent Section IDs**: Use descriptive, unique IDs
2. **Meaningful Types**: Group related sections with same type
3. **Proper Ordering**: Set logical order values
4. **Responsive Classes**: Include responsive classes in base styles
5. **Template Container**: Always wrap content in `template-container`
6. **Dark Mode**: Built-in, themeable dark mode support

## 🐛 Troubleshooting

### Edit Mode Not Working
- Check if `template-editor.css` is imported
- Verify `template-container` class is present
- Ensure sections have `form-section` class via `getSectionClasses()`

### Sections Not Selectable
- Check `data-section-id` and `data-section-type` attributes
- Verify click handler via `getSectionProps()`
- Ensure edit mode is enabled

### Sidebar Not Showing
- Check if `TemplateEditor` component is rendered
- Verify all hook values are spread: `{...editor}`

## 📈 Benefits

✅ **Automatic**: Every new template gets edit mode for free
✅ **Consistent**: Same editing experience across all templates  
✅ **Professional**: Advanced editing capabilities out of the box
✅ **Background Images**: Upload and customize backgrounds with full control
✅ **Maintainable**: Centralized logic, easy to update all templates
✅ **Flexible**: Customize for specific template needs
✅ **Responsive**: Works on desktop, tablet, and mobile
✅ **Dark Mode**: Built-in, themeable dark mode support

---

**Need Help?** Check `NewTemplateExample.tsx` for a complete working example! 