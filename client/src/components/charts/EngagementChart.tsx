import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface EngagementChartProps {
  data: Array<{ date: string; engagement: number }>;
}

const EngagementChart: React.FC<EngagementChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="engagement" stroke="#4a54e8" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default EngagementChart;

