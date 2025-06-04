import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import MarkupCalculator from '../index';
import { useCalculationHistory } from '@/hooks/use-calculation-history';

// Mock router hooks
vi.mock('react-router-dom', () => ({
  Link: ({ children, to }: { children: React.ReactNode, to: string }) => <a href={to}>{children}</a>,
  useNavigate: () => vi.fn(),
  useLocation: () => ({ pathname: '/' }),
}));

// Mock AppLayout component
vi.mock('@/components/ui/AppLayout', () => ({
  AppLayout: ({ children }: { children: React.ReactNode }) => <div data-testid="app-layout">{children}</div>,
}));

// Mock the calculation history hook
vi.mock('@/hooks/use-calculation-history');

// Create a test wrapper to provide any required context
const renderWithContext = (ui: React.ReactElement) => {
  return render(ui);
};

describe('MarkupCalculator', () => {
  beforeEach(() => {
    // Setup mock implementation
    vi.mocked(useCalculationHistory).mockReturnValue({
      calculations: [],
      addCalculation: vi.fn(),
      deleteCalculation: vi.fn(),
      clearHistory: vi.fn(),
    });
  });

  it('renders all input fields', () => {
    renderWithContext(<MarkupCalculator />);
    
    // Check for input fields by label text
    expect(screen.getByLabelText(/cost price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/markup percentage/i)).toBeInTheDocument();
  });

  it('calculates markup correctly', async () => {
    renderWithContext(<MarkupCalculator />);
    
    const costInput = screen.getByLabelText(/cost price/i);
    const markupInput = screen.getByLabelText(/markup percentage/i);
    
    fireEvent.change(costInput, { target: { value: '100' } });
    fireEvent.change(markupInput, { target: { value: '20' } });
    
    await waitFor(() => {
      expect(screen.getByText('$120.00')).toBeInTheDocument(); // Selling price
      expect(screen.getByText('$20.00')).toBeInTheDocument(); // Profit
      expect(screen.getByText('16.67%')).toBeInTheDocument(); // Margin
    });
  });

  it('validates negative inputs', async () => {
    renderWithContext(<MarkupCalculator />);
    
    const costInput = screen.getByLabelText(/cost price/i);
    const markupInput = screen.getByLabelText(/markup percentage/i);
    
    fireEvent.change(costInput, { target: { value: '-100' } });
    fireEvent.change(markupInput, { target: { value: '-20' } });
    
    // Check if the validation message appears
    // This test might need to be adjusted based on how validation is implemented
    await waitFor(() => {
      const errorText = screen.queryAllByText(/cannot be negative/i);
      expect(errorText.length).toBeGreaterThan(0);
    });
  });

  it('saves calculation to history', async () => {
    const mockAddCalculation = vi.fn();
    vi.mocked(useCalculationHistory).mockReturnValue({
      calculations: [],
      addCalculation: mockAddCalculation,
      deleteCalculation: vi.fn(),
      clearHistory: vi.fn(),
    });

    renderWithContext(<MarkupCalculator />);
    
    const costInput = screen.getByLabelText(/cost price/i);
    const markupInput = screen.getByLabelText(/markup percentage/i);
    
    fireEvent.change(costInput, { target: { value: '100' } });
    fireEvent.change(markupInput, { target: { value: '20' } });
    
    await waitFor(() => {
      expect(mockAddCalculation).toHaveBeenCalled();
    });
  });

  it('switches between markup and margin modes', async () => {
    renderWithContext(<MarkupCalculator />);
    
    // Find the tabs
    const marginTab = screen.getByRole('tab', { name: /margin/i });
    
    // Click on margin tab
    fireEvent.click(marginTab);
    
    // Check that margin input is now shown
    await waitFor(() => {
      expect(screen.getByLabelText(/margin percentage/i)).toBeInTheDocument();
    });
  });
}); 