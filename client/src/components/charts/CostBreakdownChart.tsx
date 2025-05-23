import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface CostBreakdownChartProps {
  data: {
    name: string;
    value: number;
    color: string;
  }[];
}

const CostBreakdownChart = ({ data }: CostBreakdownChartProps) => {
  const COLORS = data.map(item => item.color);
  
  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend
            layout="vertical"
            verticalAlign="middle"
            align="right"
            formatter={(value, entry, index) => {
              const percentage = Math.round(data[index].value);
              return `${value} (${percentage}%)`;
            }}
          />
          <Tooltip
            formatter={(value, name, props) => [`${value}%`, name]}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

// Default data if none provided
CostBreakdownChart.defaultProps = {
  data: [
    { name: "Duty", value: 40, color: "#3B82F6" },
    { name: "Freight", value: 25, color: "#38BDF8" },
    { name: "Taxes", value: 15, color: "#F59E0B" },
    { name: "Other", value: 20, color: "#10B981" },
  ],
};

export default CostBreakdownChart;

