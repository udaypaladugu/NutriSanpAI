import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { NutritionData } from '../types';

interface NutritionChartsProps {
  data: NutritionData;
}

const NutritionCharts: React.FC<NutritionChartsProps> = ({ data }) => {
  const chartData = [
    { name: 'Protein', value: data.protein, color: '#10b981' }, // emerald-500
    { name: 'Carbs', value: data.carbs, color: '#3b82f6' },    // blue-500
    { name: 'Fat', value: data.fat, color: '#f59e0b' },       // amber-500
  ];

  const total = data.protein + data.carbs + data.fat;
  
  // Guard against division by zero if all macros are 0
  if (total === 0) return null;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-slate-200 rounded-lg shadow-sm text-xs">
          <p className="font-semibold text-slate-700">{`${payload[0].name}: ${payload[0].value}g`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-64 relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="circle"
            formatter={(value, entry: any) => (
              <span className="text-slate-600 text-sm font-medium ml-1">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
      
      {/* Center Text */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[60%] text-center pointer-events-none">
        <div className="text-2xl font-bold text-slate-800">{data.calories}</div>
        <div className="text-xs text-slate-400 font-medium uppercase tracking-wide">Kcal</div>
      </div>
    </div>
  );
};

export default NutritionCharts;