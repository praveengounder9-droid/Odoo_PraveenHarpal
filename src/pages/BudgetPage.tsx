import React, { useState, useEffect } from 'react';
import { AlertTriangle, PieChart, Sparkles } from 'lucide-react';
import { useTrips } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';
import { budgetService } from '../services/api/budgetService';
import type { ExpenseSummary } from '../types';
import { CategoryDonutChart } from '../components/budget/CategoryDonutChart';
import { DailyExpenseBarChart } from '../components/budget/DailyExpenseBarChart';
import { Budget3DChart } from '../components/3d/Budget3DChart';
import { EmptyState } from '../components/common/EmptyState';

interface BudgetPageProps {
  setActiveTab: (tab: string) => void;
}

export const BudgetPage: React.FC<BudgetPageProps> = ({ setActiveTab }) => {
  const { user } = useAuth();
  const { activeTrip } = useTrips();
  const [budgetData, setBudgetData] = useState<ExpenseSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const currencySymbol = user?.preferences?.currency === 'EUR' ? '€' : user?.preferences?.currency === 'GBP' ? '£' : user?.preferences?.currency === 'JPY' ? '¥' : '$';

  useEffect(() => {
    if (activeTrip) {
      setIsLoading(true);
      budgetService.getBudgetBreakdown(activeTrip.id).then(res => {
        setBudgetData(res);
        setIsLoading(false);
      });
    }
  }, [activeTrip]);

  if (!activeTrip) {
    return (
      <EmptyState
        icon={<PieChart size={30} />}
        title="No active trip selected"
        description="Select a trip to view its automated financial breakdown and spending analysis."
        action={
          <button onClick={() => setActiveTab('my-trips')} className="btn btn-primary">
            View My Trips
          </button>
        }
      />
    );
  }

  if (isLoading || !budgetData) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        Calculating financial breakdown...
      </div>
    );
  }

  const overBudgetDays = budgetData.dailyExpenses.filter(d => d.isOverBudget);
  const avgCostPerDay = budgetData.dailyExpenses.length > 0 
    ? Math.round(budgetData.totalActualCost / budgetData.dailyExpenses.length) 
    : 0;

  const budgetVariance = budgetData.totalEstimatedBudget - budgetData.totalActualCost;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      <div className="glass-panel" style={{ padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', background: 'var(--bg-card)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>
            <Sparkles size={14} /> Financial Dashboard
          </div>
          <h2 style={{ fontSize: '1.8rem', fontFamily: 'Playfair Display, Georgia, serif', color: 'var(--text-primary)' }}>{activeTrip.name} – Budget Overview</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={() => setActiveTab('builder')} className="btn btn-secondary">
            Edit Itinerary Costs
          </button>
        </div>
      </div>

      {overBudgetDays.length > 0 && (
        <div style={{
          padding: '1rem 1.25rem',
          background: 'rgba(201, 76, 76, 0.08)',
          border: '1px solid rgba(201, 76, 76, 0.25)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          color: 'var(--accent-rose)'
        }}>
          <AlertTriangle size={22} style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
              Budget Threshold Warning ({overBudgetDays.length} {overBudgetDays.length === 1 ? 'day' : 'days'} over target limit)
            </div>
            <div style={{ fontSize: '0.85rem', marginTop: '0.1rem', opacity: 0.9 }}>
              {overBudgetDays.map(d => `${d.dayLabel} (${d.cityName}: ${currencySymbol}${d.amount})`).join(', ')} exceed the daily target budget limit of {currencySymbol}{overBudgetDays[0]?.budgetLimit}.
            </div>
          </div>
        </div>
      )}

      {/* Metrics Bar with Data Integrity Badges */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div className="glass-card" style={{ padding: '1.2rem', background: 'var(--bg-card)' }}>
          <div style={{ fontSize: '0.785rem', color: 'var(--text-muted)' }}>
            Target Estimated Budget <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 700 }}>[User Entered]</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
            {currencySymbol}{budgetData.totalEstimatedBudget}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Entered by user</span>
        </div>

        <div className="glass-card" style={{ padding: '1.2rem', background: 'var(--bg-card)' }}>
          <div style={{ fontSize: '0.785rem', color: 'var(--text-muted)' }}>
            Total Calculated Expense <span style={{ fontSize: '0.7rem', color: 'var(--accent-teal)', fontWeight: 700 }}>[Calculated]</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: budgetData.totalActualCost > budgetData.totalEstimatedBudget ? 'var(--accent-rose)' : 'var(--accent-teal)', marginTop: '0.2rem' }}>
            {currencySymbol}{budgetData.totalActualCost}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Sum of stay & activity costs</span>
        </div>

        <div className="glass-card" style={{ padding: '1.2rem', background: 'var(--bg-card)' }}>
          <div style={{ fontSize: '0.785rem', color: 'var(--text-muted)' }}>
            Average Daily Cost <span style={{ fontSize: '0.7rem', color: 'var(--accent-champagne)', fontWeight: 700 }}>[Estimated]</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.2rem' }}>
            {currencySymbol}{avgCostPerDay}/day
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Across {budgetData.dailyExpenses.length} trip days</span>
        </div>

        <div className="glass-card" style={{ padding: '1.2rem', background: 'var(--bg-card)' }}>
          <div style={{ fontSize: '0.785rem', color: 'var(--text-muted)' }}>
            Budget Surplus / Deficit <span style={{ fontSize: '0.7rem', color: 'var(--accent-teal)', fontWeight: 700 }}>[Calculated]</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: budgetVariance >= 0 ? 'var(--accent-teal)' : 'var(--accent-rose)', marginTop: '0.2rem' }}>
            {budgetVariance >= 0 ? `+${currencySymbol}${budgetVariance}` : `-${currencySymbol}${Math.abs(budgetVariance)}`}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            {budgetVariance >= 0 ? 'Under target budget' : 'Exceeds total target'}
          </span>
        </div>
      </div>

      {/* 3D Financial Cylinder Chart Section */}
      <div className="glass-card" style={{ padding: '1.5rem', background: 'var(--bg-card)' }}>
        <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '0.5rem', fontFamily: 'Playfair Display, serif' }}>
          Interactive 3D Category Spending Visualizer
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          3D cylinders elevated proportionally to category expenses [Calculated / User Entered]
        </p>
        <Budget3DChart categories={budgetData.byCategory} height="300px" />
      </div>

      {/* Standard Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1.5rem' }} className="budget-charts-grid">
        <div className="glass-card" style={{ padding: '1.5rem', background: 'var(--bg-card)' }}>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
            Cost Breakdown by Category
          </h3>
          <CategoryDonutChart
            categories={budgetData.byCategory}
            totalActualCost={budgetData.totalActualCost}
          />
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', background: 'var(--bg-card)' }}>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
            Daily Spending vs Target Daily Limit
          </h3>
          <DailyExpenseBarChart
            dailyExpenses={budgetData.dailyExpenses}
          />
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .budget-charts-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};
