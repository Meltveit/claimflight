import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ComparisonChartProps {
  claimAmount: number;
}

const ComparisonChart: React.FC<ComparisonChartProps> = ({ claimAmount }) => {
  const competitorFee = Math.round(claimAmount * 0.35); // 35% fee
  const userKeepsCompetitor = claimAmount - competitorFee;
  
  const claimJetFee = 3; // Approx 2.99 USD/EUR converted for simplicity

  const data = [
    {
      name: 'Competitors',
      payout: userKeepsCompetitor,
      fee: competitorFee,
      fill: '#94a3b8', // slate-400
    },
    {
      name: 'ClaimJet',
      payout: claimAmount, // We don't take a cut from the payout
      fee: 0, // Fee is upfront
      fill: '#0ea5e9', // aviation-500
    },
  ];

  return (
    <div className="w-full h-64 bg-white rounded-xl shadow-sm border border-slate-100 p-4">
      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4 text-center">
        Money In Your Pocket (€)
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} />
          <YAxis tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} unit="€"/>
          <Tooltip 
            cursor={{fill: 'transparent'}}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Bar dataKey="payout" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-2 text-center text-xs text-slate-500">
        *Competitors typically take 35% + VAT. You pay us flat €2.99.
      </div>
    </div>
  );
};

export default ComparisonChart;