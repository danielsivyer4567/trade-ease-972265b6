import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Calculator, 
  TrendingUp, 
  DollarSign, 
  PieChart,
  Download,
  FileText,
  AlertTriangle
} from 'lucide-react';
import { CostBreakdown, AIRecommendation } from '../types';

interface CostSummaryProps {
  breakdown: CostBreakdown;
  recommendations: AIRecommendation[];
  onExport: () => void;
  onGenerateProposal: () => void;
}

export const CostSummary: React.FC<CostSummaryProps> = ({ 
  breakdown, 
  recommendations,
  onExport,
  onGenerateProposal
}) => {
  const getCostPercentage = (value: number) => {
    return breakdown.total > 0 ? (value / breakdown.total) * 100 : 0;
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  const costItems = [
    { label: 'Materials', value: breakdown.materials, color: 'bg-blue-500' },
    { label: 'Labor', value: breakdown.labor, color: 'bg-green-500' },
    { label: 'Equipment', value: breakdown.equipment, color: 'bg-yellow-500' },
    { label: 'Subcontractors', value: breakdown.subcontractors, color: 'bg-purple-500' },
    { label: 'Overhead', value: breakdown.overhead, color: 'bg-orange-500' },
    { label: 'Contingency', value: breakdown.contingency, color: 'bg-red-500' },
    { label: 'Profit', value: breakdown.profit, color: 'bg-indigo-500' }
  ];

  const subtotal = breakdown.materials + breakdown.labor + breakdown.equipment + breakdown.subcontractors;

  return (
    <Card style={{ 
      background: '#e2e8f0', 
      borderRadius: '20px', 
      boxShadow: '0 10px 30px rgba(0,0,0,0.2)', 
      border: '2px solid #94a3b8' 
    }}>
      <CardHeader style={{ borderBottom: '2px solid #dee2e6' }}>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2" style={{ color: '#333' }}>
            <Calculator className="h-5 w-5" style={{ color: '#6c757d' }} />
            Cost Summary
          </div>
          <div className="text-sm font-normal" style={{ color: '#6c757d' }}>
            {new Date().toLocaleDateString()}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        {/* Cost Breakdown */}
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2" style={{ borderBottom: '1px solid #dee2e6' }}>
            <span style={{ color: '#555' }}>Materials</span>
            <span className="font-semibold" style={{ color: '#333' }}>${breakdown.materials.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center py-2" style={{ borderBottom: '1px solid #dee2e6' }}>
            <span style={{ color: '#555' }}>Labor</span>
            <span className="font-semibold" style={{ color: '#333' }}>${breakdown.labor.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center py-2" style={{ borderBottom: '1px solid #dee2e6' }}>
            <span style={{ color: '#555' }}>Equipment</span>
            <span className="font-semibold" style={{ color: '#333' }}>${breakdown.equipment.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center py-2" style={{ borderBottom: '1px solid #dee2e6' }}>
            <span style={{ color: '#555' }}>Subcontractors</span>
            <span className="font-semibold" style={{ color: '#333' }}>${breakdown.subcontractors.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center py-2" style={{ borderBottom: '1px solid #dee2e6' }}>
            <span style={{ color: '#555' }}>Overhead</span>
            <span className="font-semibold" style={{ color: '#333' }}>${breakdown.overhead.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center py-2" style={{ borderBottom: '1px solid #dee2e6' }}>
            <span style={{ color: '#555' }}>Contingency</span>
            <span className="font-semibold" style={{ color: '#333' }}>${breakdown.contingency.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center py-2" style={{ borderBottom: '1px solid #dee2e6' }}>
            <span style={{ color: '#555' }}>Profit</span>
            <span className="font-semibold" style={{ color: '#333' }}>${breakdown.profit.toFixed(2)}</span>
          </div>
        </div>

        {/* Total */}
        <div style={{
          background: '#6c757d',
          color: 'white',
          padding: '20px',
          borderRadius: '15px',
          textAlign: 'center',
          marginTop: '15px'
        }}>
          <div style={{ fontSize: '0.9rem', opacity: '0.9', marginBottom: '5px' }}>
            TOTAL ESTIMATE
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
            ${breakdown.total.toLocaleString('en-US', { 
              minimumFractionDigits: 2, 
              maximumFractionDigits: 2 
            })}
          </div>
          {breakdown.perSquareFoot && (
            <div style={{ fontSize: '0.9rem', opacity: '0.9', marginTop: '5px' }}>
              ${breakdown.perSquareFoot.toFixed(2)} per sq ft
            </div>
          )}
        </div>

        {/* Cost Distribution Chart */}
        <div className="space-y-2 mt-4">
          <h4 className="text-sm font-semibold" style={{ color: '#555' }}>Cost Distribution</h4>
          {[
            { label: 'Materials', value: breakdown.materials, color: '#3b82f6' },
            { label: 'Labor', value: breakdown.labor, color: '#10b981' },
            { label: 'Equipment', value: breakdown.equipment, color: '#f59e0b' },
            { label: 'Subcontractors', value: breakdown.subcontractors, color: '#8b5cf6' },
            { label: 'Other', value: breakdown.overhead + breakdown.contingency + breakdown.profit, color: '#6c757d' }
          ].map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span style={{ color: '#555' }}>{item.label}</span>
                <span style={{ color: '#555' }}>{getCostPercentage(item.value)}%</span>
              </div>
              <Progress 
                value={getCostPercentage(item.value)} 
                className="h-2"
                style={{
                  background: '#dee2e6',
                  '--progress-background': item.color
                } as any}
              />
            </div>
          ))}
        </div>

        {/* AI Recommendations */}
        {recommendations.length > 0 && (
          <div style={{ 
            background: '#f8f9fa', 
            borderRadius: '10px', 
            padding: '15px', 
            border: '2px dashed #dee2e6' 
          }}>
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2" style={{ color: '#555' }}>
              <TrendingUp className="h-4 w-4" style={{ color: '#3b82f6' }} />
              Cost Optimization Tips
            </h4>
            <div className="space-y-2">
              {recommendations.slice(0, 3).map((rec, idx) => (
                <div key={idx} className="text-xs" style={{ color: '#6c757d' }}>
                  • {rec.suggestion}
                  {rec.potentialSaving > 0 && (
                    <span style={{ color: '#10b981', fontWeight: '600' }}>
                      {' '}(Save ~${rec.potentialSaving.toFixed(0)})
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Risk Alert */}
        {breakdown.contingency / breakdown.total < 0.05 && (
          <div style={{ 
            background: '#fef3c7', 
            borderRadius: '10px', 
            padding: '12px', 
            border: '2px solid #fbbf24' 
          }}>
            <div className="flex items-center gap-2 text-sm" style={{ color: '#92400e' }}>
              <AlertTriangle className="h-4 w-4" />
              <span>Low contingency! Consider increasing to 5-10% for risk mitigation.</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          <Button 
            onClick={onExport} 
            className="flex-1"
            style={{
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '12px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '0.95rem',
              transition: 'all 0.3s ease'
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button 
            onClick={onGenerateProposal} 
            className="flex-1"
            style={{
              background: 'white',
              color: '#333',
              border: '2px solid #dee2e6',
              padding: '12px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '0.95rem',
              transition: 'all 0.3s ease'
            }}
          >
            <FileText className="h-4 w-4 mr-2" />
            Proposal
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}; 