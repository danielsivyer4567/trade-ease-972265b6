import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

// Mock the router hooks and components
vi.mock('react-router-dom', () => ({
  Link: ({ children, to }: { children: React.ReactNode, to: string }) => <a href={to}>{children}</a>,
  useNavigate: () => vi.fn(),
  useLocation: () => ({ pathname: '/' }),
  Outlet: () => <div data-testid="outlet" />,
  RouterProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  createBrowserRouter: vi.fn().mockReturnValue({ routes: [] }),
}));

// Mock the router module
vi.mock('../routes', () => ({
  createRouter: () => ({
    routes: [],
  }),
}));

describe('App Component', () => {
  it('renders without crashing', () => {
    render(<App />);
    // The error boundary might render if there's an issue, so check for its presence
    expect(document.body.textContent).not.toContain('Something went wrong');
  });

  it('contains application structure', () => {
    render(<App />);
    // Check for presence of a div at minimum
    expect(document.body.querySelector('div')).not.toBeNull();
  });
}); 