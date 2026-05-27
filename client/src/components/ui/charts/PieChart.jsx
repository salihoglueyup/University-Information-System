
import { ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const PieChart = ({
    data,
    dataKey = 'value',
    nameKey = 'name',
    height = 300,
    innerRadius = 60,
    outerRadius = 80,
    className = ''
}) => {
    const colors = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1'];

    return (
        <div className={`w-full ${className}`} style={{ height }}>
            <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={innerRadius}
                        outerRadius={outerRadius}
                        paddingAngle={5}
                        dataKey={dataKey}
                        nameKey={nameKey}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color || colors[index % colors.length]} strokeWidth={0} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#fff',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }}
                        itemStyle={{ fontSize: '12px', fontWeight: 500 }}
                    />
                    <Legend
                        layout="vertical"
                        verticalAlign="middle"
                        align="right"
                        wrapperStyle={{ fontSize: '12px' }}
                    />
                </RechartsPieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PieChart;
