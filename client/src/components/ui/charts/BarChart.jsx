
import { ResponsiveContainer, BarChart as RechartsBarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts';

const BarChart = ({
    data,
    bars = [],
    xAxisKey = 'name',
    height = 300,
    layout = 'horizontal', // 'horizontal' | 'vertical'
    className = ''
}) => {
    const colors = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

    return (
        <div className={`w-full ${className}`} style={{ height }}>
            <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                    layout={layout}
                    data={data}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />

                    {layout === 'horizontal' ? (
                        <>
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
                        </>
                    ) : (
                        <>
                            <XAxis
                                type="number"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748b', fontSize: 12 }}
                            />
                            <YAxis
                                dataKey={xAxisKey}
                                type="category"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748b', fontSize: 12 }}
                                width={100}
                            />
                        </>
                    )}

                    <Tooltip
                        cursor={{ fill: '#f1f5f9' }}
                        contentStyle={{
                            backgroundColor: '#fff',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }}
                        itemStyle={{ fontSize: '12px', fontWeight: 500 }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    {bars.map((bar, index) => (
                        <Bar
                            key={bar.key}
                            dataKey={bar.key}
                            name={bar.name || bar.key}
                            fill={bar.color || colors[index % colors.length]}
                            radius={[4, 4, 0, 0]}
                            barSize={layout === 'vertical' ? 20 : undefined}
                        />
                    ))}
                </RechartsBarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default BarChart;
