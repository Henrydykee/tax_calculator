import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { TaxBreakdown, formatCurrency } from '../utils/taxCalculator';

interface TaxChartProps {
  breakdown: TaxBreakdown[];
}

const COLORS = ['#d946ef', '#c026d3', '#a21caf', '#06b6d4', '#0891b2', '#22c55e', '#16a34a'];

export const TaxChart = ({ breakdown }: TaxChartProps) => {
  const chartData = breakdown
    .filter(item => item.tax > 0)
    .map(item => ({
      name: item.bracket,
      value: item.tax,
      rate: (item.rate * 100).toFixed(0) + '%',
    }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-xl border-2 border-primary-300 dark:border-primary-700">
          <p className="font-semibold">{payload[0].name}</p>
          <p className="text-sm text-accent-600 dark:text-accent-400 font-medium">
            Rate: {payload[0].payload.rate}
          </p>
          <p className="text-lg font-bold bg-gradient-to-r from-primary-600 to-success-600 bg-clip-text text-transparent">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.9, duration: 0.5 }}
      className="w-full"
    >
      <h3 className="text-xl font-bold mb-4 text-center bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">Tax Distribution by Bracket</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            animationBegin={0}
            animationDuration={800}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => <span className="text-sm">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
};
