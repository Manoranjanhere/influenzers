import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface FollowerGrowthChartProps {
  data: Array<{ month: string; followers: number }>;
}

const FollowerGrowthChart: React.FC<FollowerGrowthChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip formatter={(value) => value.toLocaleString()} />
        <Legend />
        <Line type="monotone" dataKey="followers" stroke="#10b981" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default FollowerGrowthChart;

