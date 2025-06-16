import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { JobsMain } from './JobsMain';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Job } from '@/types/job';

// Mock the dependencies
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      update: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: null }))
      }))
    }))
  }
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

describe('JobsMain', () => {
  const mockJobs: Job[] = [
    {
      id: '1',
      customer: 'Test Customer',
      type: 'Plumbing',
      status: 'in-progress',
      date: '2024-03-20',
      jobNumber: '7400',
      title: 'Test Job 1'
    },
    {
      id: '2',
      customer: 'Another Customer',
      type: 'Electrical',
      status: 'ready',
      date: '2024-03-21',
      jobNumber: '7401',
      title: 'Test Job 2'
    }
  ];

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
  });

  it('should move job to completed tab when marked as completed', async () => {
    render(<JobsMain />);

    // Initially, both jobs should be in the active jobs tab
    expect(screen.getByText('Test Job 1')).toBeInTheDocument();
    expect(screen.getByText('Test Job 2')).toBeInTheDocument();

    // Click the complete button for the first job
    const completeButton = screen.getByRole('button', { name: /complete job 1/i });
    fireEvent.click(completeButton);

    // Wait for the status update to complete
    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('jobs');
      expect(toast.success).toHaveBeenCalledWith('Job status updated successfully');
    });

    // Switch to completed jobs tab
    const completedTab = screen.getByRole('tab', { name: /completed jobs/i });
    fireEvent.click(completedTab);

    // Verify the completed job appears in the completed tab
    expect(screen.getByText('Test Job 1')).toBeInTheDocument();
    expect(screen.queryByText('Test Job 2')).not.toBeInTheDocument();
  });

  it('should handle errors when updating job status', async () => {
    // Mock an error response from Supabase
    (supabase.from as any).mockImplementationOnce(() => ({
      update: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: new Error('Update failed') }))
      }))
    }));

    render(<JobsMain />);

    // Click the complete button
    const completeButton = screen.getByRole('button', { name: /complete job 1/i });
    fireEvent.click(completeButton);

    // Verify error handling
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to update job status');
    });
  });
}); 