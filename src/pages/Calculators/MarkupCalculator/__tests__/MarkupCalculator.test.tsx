import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MarkupCalculator } from '../index';
import { useCalculationHistory } from '@/hooks/use-calculation-history';

// Mock the calculation history hook
jest.mock('@/hooks/use-calculation-history');
const mockUseCalculationHistory = useCalculationHistory as jest.MockedFunction<typeof useCalculationHistory>;

describe('MarkupCalculator', () => {
  beforeEach(() => {
    // Setup mock implementation
    mockUseCalculationHistory.mockReturnValue({
      calculations: [],
      addCalculation: jest.fn(),
      deleteCalculation: jest.fn(),
      clearHistory: jest.fn(),
    });
  });

  it('renders all input fields', () => {
    render(<MarkupCalculator />);
    
    expect(screen.getByLabelText(/cost/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/markup/i)).toBeInTheDocument();
  });

  it('calculates markup correctly', async () => {
    render(<MarkupCalculator />);
    
    const costInput = screen.getByLabelText(/cost/i);
    const markupInput = screen.getByLabelText(/markup/i);
    
    fireEvent.change(costInput, { target: { value: '100' } });
    fireEvent.change(markupInput, { target: { value: '20' } });
    
    await waitFor(() => {
      expect(screen.getByText('$120.00')).toBeInTheDocument(); // Selling price
      expect(screen.getByText('$20.00')).toBeInTheDocument(); // Profit
      expect(screen.getByText('16.67%')).toBeInTheDocument(); // Margin
    });
  });

  it('validates negative inputs', async () => {
    render(<MarkupCalculator />);
    
    const costInput = screen.getByLabelText(/cost/i);
    const markupInput = screen.getByLabelText(/markup/i);
    
    fireEvent.change(costInput, { target: { value: '-100' } });
    fireEvent.change(markupInput, { target: { value: '-20' } });
    
    await waitFor(() => {
      expect(screen.getByText(/cannot be negative/i)).toBeInTheDocument();
    });
  });

  it('saves calculation to history', async () => {
    const mockAddCalculation = jest.fn();
    mockUseCalculationHistory.mockReturnValue({
      calculations: [],
      addCalculation: mockAddCalculation,
      deleteCalculation: jest.fn(),
      clearHistory: jest.fn(),
    });

    render(<MarkupCalculator />);
    
    const costInput = screen.getByLabelText(/cost/i);
    const markupInput = screen.getByLabelText(/markup/i);
    
    fireEvent.change(costInput, { target: { value: '100' } });
    fireEvent.change(markupInput, { target: { value: '20' } });
    
    await waitFor(() => {
      expect(mockAddCalculation).toHaveBeenCalledWith(
        'Markup Calculator',
        expect.objectContaining({
          cost: '100',
          markup: '20',
        }),
        expect.objectContaining({
          sellingPrice: 120,
          profit: 20,
          marginPercent: 16.67,
        })
      );
    });
  });

  it('switches between markup and margin modes', async () => {
    render(<MarkupCalculator />);
    
    const markupTab = screen.getByRole('tab', { name: /markup/i });
    const marginTab = screen.getByRole('tab', { name: /margin/i });
    
    fireEvent.click(marginTab);
    
    await waitFor(() => {
      expect(screen.getByLabelText(/margin/i)).toBeInTheDocument();
    });
    
    fireEvent.click(markupTab);
    
    await waitFor(() => {
      expect(screen.getByLabelText(/markup/i)).toBeInTheDocument();
    });
  });
}); 