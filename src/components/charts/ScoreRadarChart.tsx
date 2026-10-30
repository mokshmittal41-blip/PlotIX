import {
  RadarChart as ReChartsRadar, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip,
} from 'recharts';

interface RadarDataPoint {
  subject: string;
  value: number;
  fullMark: number;
}

interface ScoreRadarChartProps {
  data: RadarDataPoint[];
  height?: number;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: '8px',
        padding: '8px 12px',
        boxShadow: 'var(--shadow-md)',
        fontSize: '12px',
      }}>
        <div style={{ fontWeight: 600 }}>{payload[0].payload.subject}: {payload[0].value}/100</div>
      </div>
    );
  }
  return null;
};

export default function ScoreRadarChart({ data, height = 240 }: ScoreRadarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ReChartsRadar data={data} cx="50%" cy="50%" outerRadius="70%">
        <PolarGrid stroke="var(--color-border)" />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Radar
          name="Score"
          dataKey="value"
          stroke="#7B9E87"
          fill="#7B9E87"
          fillOpacity={0.2}
          strokeWidth={2}
          dot={{ r: 4, fill: '#5a7d6a', strokeWidth: 0 }}
        />
      </ReChartsRadar>
    </ResponsiveContainer>
  );
}
