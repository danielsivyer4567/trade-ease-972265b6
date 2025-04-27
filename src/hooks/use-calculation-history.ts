import { useState, useEffect } from 'react';
import { CalculationRecord } from '@/components/ui/CalculationHistory';

const STORAGE_KEY = 'calculator_history';
const MAX_HISTORY_ITEMS = 50;

export function useCalculationHistory() {
  const [calculations, setCalculations] = useState<CalculationRecord[]>([]);

  // Load calculations from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setCalculations(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading calculation history:', error);
      }
    }
  }, []);

  // Save calculations to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(calculations));
  }, [calculations]);

  const addCalculation = (calculatorType: string, inputs: Record<string, any>, results: Record<string, any>) => {
    const newCalculation: CalculationRecord = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      calculatorType,
      inputs,
      results,
    };

    setCalculations(prev => {
      const updated = [newCalculation, ...prev].slice(0, MAX_HISTORY_ITEMS);
      return updated;
    });
  };

  const deleteCalculation = (id: string) => {
    setCalculations(prev => prev.filter(calc => calc.id !== id));
  };

  const clearHistory = () => {
    setCalculations([]);
  };

  return {
    calculations,
    addCalculation,
    deleteCalculation,
    clearHistory,
  };
} 