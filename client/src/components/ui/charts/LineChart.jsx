
import { ResponsiveContainer, LineChart as RechartsLineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';

const LineChart = ({
    data,
    lines = [],
    xAxisKey = 'name',
    height = 300,
    className = ''
}) => {
    const colors = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

    return (
        <div className={`w-full ${className}`} style={{ height }}>
            <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart
                    data={data}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis
                        dataKey={xAxisKey}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748b', fontSize: 12 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748b', fontSize: 12 }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#fff',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }}
                        itemStyle={{ fontSize: '12px', fontWeight: 500 }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    {lines.map((line, index) => (
                        <Line
                            key={line.key}
                            type="monotone"
                            dataKey={line.key}
                            name={line.name || line.key}
                            stroke={line.color || colors[index % colors.length]}
                            strokeWidth={2}
                            dot={{ r: 4, fill: '#fff', strokeWidth: 2 }}
                            activeDot={{ r: 6 }}
                        />
                    ))}
                </RechartsLineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default LineChart;
