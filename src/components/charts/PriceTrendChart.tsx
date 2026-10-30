import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import type { PricePoint } from '../../types';

interface PriceTrendChartProps {
  data: PricePoint[];
  height?: number;
  showGrid?: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: '8px',
        padding: '10px 14px',
        boxShadow: 'var(--shadow-md)',
        fontSize: '13px',
      }}>
        <div style={{ color: 'var(--color-text-muted)', marginBottom: '4px' }}>{label}</div>
        <div style={{ fontWeight: 700, color: 'var(--color-text)' }}>
          ₹{payload[0].value.toLocaleString('en-IN')}/sq.yd.
        </div>
      </div>
    );
  }
  return null;
};

export default function PriceTrendChart({ data, height = 200, showGrid = true }: PriceTrendChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#7B9E87" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#7B9E87" stopOpacity={0} />
          </linearGradient>
        </defs>
        {showGrid && (
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
        )}
        <XAxis
          dataKey="month"
          tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="price"
          stroke="#7B9E87"
          strokeWidth={2.5}
          fill="url(#priceGradient)"
          dot={false}
          activeDot={{ r: 5, fill: '#5a7d6a', strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
