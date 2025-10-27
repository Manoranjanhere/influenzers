import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface EngagementDistributionChartProps {
  data: Array<{ platform: string; likes: number; comments: number }>;
}

const EngagementDistributionChart: React.FC<EngagementDistributionChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="platform" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="likes" fill="#8b5cf6" />
        <Bar dataKey="comments" fill="#ec4899" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default EngagementDistributionChart;

