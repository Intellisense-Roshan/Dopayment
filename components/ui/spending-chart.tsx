import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { SpendingInsight } from '@/types';

interface SpendingChartProps {
  data: SpendingInsight[];
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

export const SpendingChart: React.FC<SpendingChartProps> = ({ data }) => {
  const chartData = data.map((item, index) => ({
    ...item,
    color: COLORS[index % COLORS.length],
  }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={80}
            dataKey="amount"
            label={({ name, percentage }) => `${name}: ${percentage}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => [`₹${value}`, 'Amount']} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};