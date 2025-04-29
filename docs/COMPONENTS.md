# Component Documentation

## Core Components

### Button
A reusable button component with various styles and states.

```tsx
import { Button } from '@/components/ui/button';

// Usage
<Button variant="primary" size="md" onClick={() => {}}>
  Click me
</Button>
```

Props:
- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost'
- `size`: 'sm' | 'md' | 'lg'
- `disabled`: boolean
- `loading`: boolean
- `onClick`: () => void

### Input
A form input component with validation and error states.

```tsx
import { Input } from '@/components/ui/input';

// Usage
<Input
  type="text"
  placeholder="Enter text"
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

Props:
- `type`: string
- `placeholder`: string
- `value`: string
- `error`: string
- `onChange`: (e: ChangeEvent<HTMLInputElement>) => void

### Card
A container component for grouping related content.

```tsx
import { Card } from '@/components/ui/card';

// Usage
<Card>
  <CardHeader>Title</CardHeader>
  <CardContent>Content</CardContent>
  <CardFooter>Footer</CardFooter>
</Card>
```

## Layout Components

### Header
The main navigation header component.

```tsx
import { Header } from '@/components/layout/Header';

// Usage
<Header />
```

### Sidebar
Navigation sidebar component.

```tsx
import { Sidebar } from '@/components/layout/Sidebar';

// Usage
<Sidebar />
```

## Form Components

### Form
A form wrapper component with validation.

```tsx
import { Form } from '@/components/form/Form';

// Usage
<Form onSubmit={handleSubmit}>
  {/* form fields */}
</Form>
```

## Best Practices

1. Always use TypeScript for component props
2. Implement proper error handling
3. Use proper accessibility attributes
4. Follow the component composition pattern
5. Keep components focused and single-responsibility
6. Use proper naming conventions
7. Document complex logic with comments 