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

## Configurable Direct Navigation

The application now includes a configurable direct navigation system that allows users to choose between:

1. **Direct Navigation Mode (ON)**: Clicking on a tab/link immediately navigates to the target page
2. **Confirmation Mode (OFF)**: Clicking on a tab/link sets the target but requires confirmation before navigation

### How to Use

A toggle button is displayed in the top-right corner of the application allowing users to switch between modes:

- When direct navigation is ON (green button), tabs behave as before with immediate navigation
- When direct navigation is OFF (amber button), clicking a tab shows a confirmation panel

### Components

#### 1. `useDirectTabNavigation` Hook

This hook extends the original `useTabbedLink` with toggle functionality:

```tsx
import { useDirectTabNavigation } from '@/hooks/useDirectTabNavigation';

function MyComponent() {
  const { 
    navigateWithTab, 
    createClickHandler,
    directNavigationEnabled,
    toggleDirectNavigation,
    targetPath,
    executeNavigation,
    clearTabTarget
  } = useDirectTabNavigation();
  
  // The hook handles navigation based on current mode
  return (
    <a href="/path" onClick={createClickHandler('/path', 'Tab Title')}>
      Link Text
    </a>
  );
}
```

#### 2. `TabNavigator` Component

A floating UI component that shows the navigation toggle and confirmation panel:

```tsx
import { TabNavigator } from '@/components/ui/TabNavigator';

function AppLayout() {
  return (
    <div>
      {/* Your app content */}
      <TabNavigator />
    </div>
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
5. **User Preference**: Users can now choose their navigation style

## Implementing in Existing Components

To update existing components to use this feature:

1. Replace `Link` components with `TabLink`
2. Replace navigation links with `NavLink`
3. For custom buttons triggering navigation, use the `useDirectTabNavigation` hook

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