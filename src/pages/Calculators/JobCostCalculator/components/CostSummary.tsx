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
    <div style={{ 
      background: '#e2e8f0', 
      borderRadius: '20px', 
      padding: '25px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.2)', 
      backdropFilter: 'blur(10px)',
      border: '2px solid #94a3b8' 
    }}>
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '20px', 
        paddingBottom: '15px', 
        borderBottom: '2px solid #f0f0f0' 
      }}>
        <h3 style={{ fontSize: '1.4rem', color: '#333', marginBottom: '8px' }}>
          💰 Cost Summary
        </h3>
        <small style={{ color: '#6c757d' }}>Complete breakdown and analysis</small>
      </div>
      
      <div className="space-y-4">
        {/* Cost Breakdown */}
        <div style={{ 
          background: '#f8f9fa', 
          borderRadius: '10px', 
          padding: '15px', 
          border: '2px dashed #dee2e6' 
        }}>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2" style={{ borderBottom: '1px solid #e9ecef' }}>
              <span style={{ color: '#555', fontWeight: '600' }}>📦 Materials</span>
              <span style={{ color: '#333', fontWeight: '600' }}>${breakdown.materials.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center py-2" style={{ borderBottom: '1px solid #e9ecef' }}>
              <span style={{ color: '#555', fontWeight: '600' }}>👷 Labor</span>
              <span style={{ color: '#333', fontWeight: '600' }}>${breakdown.labor.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center py-2" style={{ borderBottom: '1px solid #e9ecef' }}>
              <span style={{ color: '#555', fontWeight: '600' }}>🚧 Equipment</span>
              <span style={{ color: '#333', fontWeight: '600' }}>${breakdown.equipment.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center py-2" style={{ borderBottom: '1px solid #e9ecef' }}>
              <span style={{ color: '#555', fontWeight: '600' }}>🤝 Subcontractors</span>
              <span style={{ color: '#333', fontWeight: '600' }}>${breakdown.subcontractors.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center py-2" style={{ borderBottom: '1px solid #e9ecef' }}>
              <span style={{ color: '#555', fontWeight: '600' }}>📊 Overhead</span>
              <span style={{ color: '#333', fontWeight: '600' }}>${breakdown.overhead.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center py-2" style={{ borderBottom: '1px solid #e9ecef' }}>
              <span style={{ color: '#555', fontWeight: '600' }}>🛡️ Contingency</span>
              <span style={{ color: '#333', fontWeight: '600' }}>${breakdown.contingency.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span style={{ color: '#555', fontWeight: '600' }}>💵 Profit</span>
              <span style={{ color: '#333', fontWeight: '600' }}>${breakdown.profit.toFixed(2)}</span>
            </div>
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
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '5px' }}>
            ${breakdown.total.toLocaleString('en-US', { 
              minimumFractionDigits: 2, 
              maximumFractionDigits: 2 
            })}
          </div>
          <div style={{ fontSize: '1rem', opacity: '0.9' }}>
            Total Project Cost
          </div>
          {breakdown.perSquareFoot && (
            <div style={{ fontSize: '0.9rem', opacity: '0.8', marginTop: '5px' }}>
              ${breakdown.perSquareFoot.toFixed(2)} per sq ft
            </div>
          )}
        </div>

        {/* Cost Distribution Chart */}
        <div style={{ 
          background: '#f8f9fa', 
          borderRadius: '10px', 
          padding: '15px', 
          border: '2px dashed #dee2e6' 
        }}>
          <h4 className="text-sm font-semibold mb-3" style={{ color: '#555' }}>📊 Cost Distribution</h4>
          <div className="space-y-2">
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
                <div style={{ 
                  width: '100%', 
                  height: '8px', 
                  background: '#e9ecef', 
                  borderRadius: '4px', 
                  overflow: 'hidden' 
                }}>
                  <div style={{ 
                    width: `${getCostPercentage(item.value)}%`, 
                    height: '100%', 
                    background: item.color,
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendations */}
        {recommendations.length > 0 && (
          <div style={{ 
            background: '#e3f2fd', 
            borderRadius: '10px', 
            padding: '15px', 
            border: '2px solid #90caf9' 
          }}>
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2" style={{ color: '#1976d2' }}>
              <TrendingUp className="h-4 w-4" />
              💡 Cost Optimization Tips
            </h4>
            <div className="space-y-2">
              {recommendations.slice(0, 3).map((rec, idx) => (
                <div key={idx} className="text-sm" style={{ color: '#1565c0' }}>
                  • {rec.suggestion}
                  {rec.potentialSaving > 0 && (
                    <span style={{ color: '#2e7d32', fontWeight: '600' }}>
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
            background: '#fff3cd', 
            borderRadius: '10px', 
            padding: '12px', 
            border: '2px solid #ffc107' 
          }}>
            <div className="flex items-center gap-2 text-sm" style={{ color: '#856404' }}>
              <AlertTriangle className="h-4 w-4" />
              <span>⚠️ Low contingency! Consider increasing to 5-10% for risk mitigation.</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={onExport}
            style={{
              flex: 1,
              background: 'white',
              color: '#333',
              border: '2px solid #e9ecef',
              padding: '15px',
              borderRadius: '10px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <Download className="h-4 w-4" />
            Export CSV 📊
          </button>
          <button
            onClick={onGenerateProposal}
            style={{
              flex: 1,
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '15px',
              borderRadius: '10px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <FileText className="h-4 w-4" />
            Generate Proposal 📄
          </button>
        </div>
      </div>
    </div>
  );
}; 