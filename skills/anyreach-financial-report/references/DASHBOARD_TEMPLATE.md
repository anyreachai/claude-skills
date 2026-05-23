# JSX Dashboard Template (React/Recharts)

## Imports & Utilities

```jsx
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
  CartesianGrid, ReferenceLine, LabelList, Area, AreaChart } from "recharts";

const fmt = (v) => (v < 0 ? "-" : "") + "$" + Math.round(Math.abs(v) / 1000) + "K";
const fmtFull = (v) => "$" + Math.round(v).toLocaleString();

const COLORS = {
  blue: "#3266ad", lightBlue: "#85B7EB", green: "#1D9E75", red: "#E24B4A",
  amber: "#BA7517", purple: "#534AB7", coral: "#D85A30", pink: "#D4537E",
  sage: "#639922", peach: "#F0997B", lavender: "#AFA9EC", teal: "#5DCAA5",
  gray: "#888780", slate: "#5F5E5A"
};
```

## Reusable Components

```jsx
const KPI = ({ label, value, delta, deltaColor }) => (
  <div className="bg-gray-50 rounded-lg p-4 flex flex-col">
    <span className="text-xs text-gray-500 mb-1">{label}</span>
    <span className="text-2xl font-medium text-gray-900">{value}</span>
    {delta && <span className={`text-xs mt-0.5 ${deltaColor}`}>{delta}</span>}
  </div>
);

const Section = ({ title, children }) => (
  <div className="mt-8">
    <h3 className="text-base font-medium text-gray-900 mb-3">{title}</h3>
    {children}
  </div>
);

const Badge = ({ color, children }) => {
  const s = {
    green: "bg-green-100 text-green-800", red: "bg-red-100 text-red-800",
    blue: "bg-blue-100 text-blue-800", purple: "bg-purple-100 text-purple-800",
    gray: "bg-gray-200 text-gray-600"
  };
  return <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${s[color]}`}>{children}</span>;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm text-xs">
      <p className="font-medium text-gray-700 mb-1">{label}</p>
      {payload.filter(p => p.value !== 0 && p.value != null).map((p, i) => (
        <p key={i} style={{ color: p.color || p.fill || p.stroke }}>
          {p.name}: {fmtFull(p.value)}
        </p>
      ))}
    </div>
  );
};

// Bar label renderer for waterfall chart
const renderLabel = (props) => {
  const { x, y, width, value } = props;
  if (!value) return null;
  return (
    <text x={x + width / 2} y={value >= 0 ? y - 6 : y + 14}
      fill={value >= 0 ? COLORS.green : COLORS.red}
      textAnchor="middle" fontSize={9} fontWeight={500}>
      {(value >= 0 ? "+" : "") + fmt(value)}
    </text>
  );
};
```

## Chart Patterns

### MRR Trajectory (AreaChart with expense reference line)
```jsx
<AreaChart data={mrrForecast}>
  <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
  <YAxis tickFormatter={fmt} tick={{ fontSize: 11 }} />
  <Tooltip content={<CustomTooltip />} />
  <Area dataKey="actual" name="Actual MRR" stroke={COLORS.blue}
    fill={COLORS.blue} fillOpacity={0.1} strokeWidth={2.5}
    dot={{ r: 4 }} connectNulls={false} />
  <Area dataKey="forecast" name="Forecast MRR" stroke={COLORS.green}
    fill={COLORS.green} fillOpacity={0.08} strokeWidth={2.5}
    strokeDasharray="6 4" dot={{ r: 3 }} connectNulls={true} />
  <ReferenceLine y={bufferedExpenses} stroke={COLORS.red}
    strokeDasharray="4 4" strokeWidth={1.5}
    label={{ value: "Buffered $89K", position: "right", fontSize: 9, fill: COLORS.red }} />
</AreaChart>
```

### Net Cash Flow Waterfall (BarChart with value labels)
```jsx
<BarChart data={waterfallData} margin={{ top: 20 }}>
  <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
  <YAxis tickFormatter={fmt} tick={{ fontSize: 11 }} />
  <ReferenceLine y={0} stroke="#999" strokeWidth={1} />
  <Tooltip formatter={(v) => [fmtFull(v), "Net"]} />
  <Bar dataKey="net" name="Net" radius={[3,3,0,0]}>
    {waterfallData.map((d, i) => <Cell key={i} fill={d.fill} />)}
    <LabelList content={renderLabel} />
  </Bar>
</BarChart>
```

### Cash Balance (AreaChart)
```jsx
<AreaChart data={balData}>
  <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
  <YAxis tickFormatter={fmt} tick={{ fontSize: 11 }} domain={[400000, "auto"]} />
  <Tooltip formatter={(v) => [fmtFull(v), "Cash"]} />
  <Area dataKey="bal" name="Cash" stroke={COLORS.green}
    fill={COLORS.green} fillOpacity={0.1} strokeWidth={2.5} dot={{ r: 4 }} />
</AreaChart>
```

### Customer MRR (Horizontal Stacked Bar)
```jsx
<BarChart data={mrrCust} layout="vertical">
  <CartesianGrid strokeDasharray="3 3" stroke="#eee" horizontal={false} />
  <XAxis type="number" tickFormatter={fmt} tick={{ fontSize: 11 }} />
  <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 10 }} />
  <Tooltip content={<CustomTooltip />} />
  <Bar dataKey="current" name="Current" fill={COLORS.blue} stackId="a" />
  <Bar dataKey="forecast" name="Forecast" fill={COLORS.green} stackId="a"
    radius={[0, 3, 3, 0]} />
</BarChart>
```

### Team Pie Chart
```jsx
<PieChart>
  <Pie data={team} dataKey="pay" nameKey="name" cx="50%" cy="50%"
    innerRadius={55} outerRadius={105} paddingAngle={1}>
    {team.map((t, i) => <Cell key={i} fill={t.color} />)}
  </Pie>
  <Tooltip formatter={(v, name) => [fmtFull(v) + "/mo", name]} />
</PieChart>
```

## Customer Table Pattern

The customer table is the most important visual in the dashboard. It must include EVERY account grouped by status with running MRR totals:

```jsx
<table className="w-full text-xs">
  {/* Section headers with gray background */}
  <tr className="bg-gray-50">
    <td colSpan={5} className="py-1.5 font-medium text-gray-700">
      Active — $XX,XXX/mo (N accounts)
    </td>
  </tr>

  {/* Active rows: Badge color="green" */}
  {/* Churned rows: Badge color="red", line-through, bg-red-50/30 */}
  {/* Forecast rows: Badge color="purple" */}
  {/* Upgrade rows: Badge color="blue" */}
  {/* Removed rows: Badge color="gray", line-through */}

  {/* Running totals at bottom */}
  <tr className="border-t-2 border-gray-300 font-medium">
    <td>Active (today)</td><td>$XX,XXX</td><td colSpan={3}>N accounts</td>
  </tr>
  <tr className="font-medium bg-green-50">
    <td>+ All Forecast</td><td>$XXX,XXX</td><td colSpan={3}>$X.XM ARR</td>
  </tr>
</table>
```

## Scenarios Table Pattern

```jsx
const tagStyles = {
  green: "bg-green-100 text-green-800",
  amber: "bg-amber-100 text-amber-800",
  red: "bg-red-100 text-red-800"
};
```

## Output
Save to: `/mnt/user-data/outputs/anyreach_dashboard.jsx`
Present via `present_files`.
