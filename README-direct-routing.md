# Direct Routing with Tab Breadcrumbs

This feature allows all buttons and links in the application to use direct routing while maintaining the tab breadcrumb feature.

## Components and Hooks

### 1. `useTabbedLink` Hook

This hook provides functions for direct navigation while maintaining tabs:

```tsx
import { useTabbedLink } from '@/hooks/useTabbedLink';

function MyComponent() {
  const { navigateWithTab, createClickHandler } = useTabbedLink();
  
  // Use directly in event handlers
  const handleButtonClick = () => {
    navigateWithTab('/path', 'Tab Title');
  };
  
  // Or create a click handler for links
  return (
    <a href="/path" onClick={createClickHandler('/path', 'Tab Title')}>
      Link Text
    </a>
  );
}
```

### 2. `TabLink` Component

A drop-in replacement for regular Link components:

```tsx
import { TabLink } from '@/components/ui/TabLink';

function MyComponent() {
  return (
    <TabLink to="/path" title="Tab Title">
      Link Text
    </TabLink>
  );
}
```

### 3. `TabButton` Component

A button variant that triggers navigation:

```tsx
import { TabButton } from '@/components/ui/TabLink';

function MyComponent() {
  return (
    <TabButton to="/path" title="Tab Title" className="p-2 bg-blue-500 text-white">
      Button Text
    </TabButton>
  );
}
```

### 4. `NavLink` Component

A specialized TabLink for sidebar/navigation items:

```tsx
import { NavLink } from '@/components/navigation/NavLink';
import { useActiveRoute } from '@/hooks/useActiveRoute';

function MyComponent() {
  const isActive = useActiveRoute('/path');
  
  return (
    <NavLink 
      to="/path" 
      title="Tab Title" 
      active={isActive}
      icon={<IconComponent />}
    >
      Navigation Item
    </NavLink>
  );
}
```

## Usage in Common Components

### 1. In QuickTabs:

The QuickTabs component has been updated to use `TabLink` instead of regular `Link` components.

### 2. In Sidebar:

The new Sidebar component uses the `NavLink` component for all navigation items.

### 3. In BaseLayout:

BaseLayout has been updated with a `useNewSidebar` prop that allows switching between the old and new sidebar implementations.

## Implementation Benefits

1. **Direct Navigation**: Users now navigate directly to the target page (no delay)
2. **Tab Breadcrumbs**: Navigation history is still maintained in tabs
3. **SEO Friendly**: Regular links are preserved for better SEO
4. **Accessibility**: Standard navigation patterns are maintained

## Implementing in Existing Components

To update existing components to use this feature:

1. Replace `Link` components with `TabLink`
2. Replace navigation links with `NavLink`
3. For custom buttons triggering navigation, use the `useTabbedLink` hook

Example conversion:

```tsx
// Before
import { Link } from 'react-router-dom';

<Link to="/products">Products</Link>

// After
import { TabLink } from '@/components/ui/TabLink';

<TabLink to="/products" title="Products">Products</TabLink>
```

## Customizing Tab Titles

By default, the tab title is taken from the provided `title` prop, but you can customize it:

```tsx
// Custom tab title
<TabLink to="/products/123" title="Product Details">View Product</TabLink>

// Custom tab ID for persistence
<TabLink to="/products/123" title="Product Details" tabId="product-123">View Product</TabLink>
``` 