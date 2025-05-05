
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export type AssetAllocation = {
  name: string;
  value: number;
  color: string;
};

interface AssetAllocationChartProps {
  data: AssetAllocation[];
}

const AssetAllocationChart: React.FC<AssetAllocationChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => [`$${value.toLocaleString()}`, 'Value']}
          labelFormatter={(label: string) => `${label}`}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default AssetAllocationChart;
