import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend,
  ResponsiveContainer, CartesianGrid, Label
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

export interface ActualsPoint {
  startTime: string;
  generation: number;
}
export interface ForecastPoint {
  startTime: string;
  publishTime: string;
  horizon: number;
  generation: number;
}
interface Props {
  actuals: ActualsPoint[];
  forecasts: ForecastPoint[];
  loading?: boolean;
  error?: string;
}

// Professional X-axis tick: always show time, add professional short month if new day
const CustomXAxisTick = ({ x, y, payload, index, data }: any) => {
  const value: string = payload.value;
  const date = new Date(value);
  const timeStr = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
  const dateStr = date.toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', timeZone: 'UTC'
  });

  const prevValue = data?.[index - 1]?.startTime;
  const showDate = !prevValue || new Date(prevValue).getDate() !== date.getDate();

  // Format: 01 Jan\n09:30 if new day; else just 09:30
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={showDate ? 8 : 20} textAnchor="middle" style={{ fontSize: 11, fill: '#64748b', fontWeight: 500 }}>
        {showDate ? `${dateStr}` : ''}
      </text>
      <text x={0} y={0} dy={showDate ? 20 : 14} textAnchor="middle" style={{ fontSize: 11, fill: '#64748b' }}>
        {timeStr}
      </text>
    </g>
  );
};


export default function ForecastChart({ actuals, forecasts, loading, error }: Props) {
  const merged = actuals.map((actual) => {
    const forecast = forecasts.find((f) => f.startTime === actual.startTime);
    return {
      startTime: actual.startTime,
      actual: actual.generation,
      forecast: forecast ? forecast.generation : null,
    };
  });

  const yFormatter = (v: number) => `${(v / 1000).toFixed(0)}k`;

  return (
    <Card className="w-full bg-white shadow-sm border border-zinc-200 rounded-xl">
      <CardHeader className="pb-2 pt-5 px-6">
        <CardTitle className="text-lg font-semibold text-zinc-900 tracking-tight">
          National Historical Forecast
        </CardTitle>
        <div className="mt-1 h-px bg-zinc-100 w-full" />
      </CardHeader>

      <CardContent className="px-4 pb-6">
        {loading && (
          <div className="py-8 text-center text-zinc-400">Loading...</div>
        )}
        {error && (
          <div className="py-8 text-center text-red-500">{error}</div>
        )}
        {!loading && !error && merged.length === 0 && (
          <div className="py-8 text-center text-zinc-400">
            No data available for the selected period.
          </div>
        )}
        {!loading && !error && merged.length > 0 && (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={merged}
              margin={{ top: 10, right: 24, left: 10, bottom: 52 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e2e8f0"
                vertical={true}
                horizontal={true}
              />

               <XAxis
                 dataKey="startTime"
                 tickLine={false}
                 axisLine={false}
                 tickMargin={2}
                 minTickGap={40}
                 interval="preserveStartEnd"
                 tick={(props) => (
                   <CustomXAxisTick {...props} data={merged} />
                 )}
                 height={48}
               >
                 <Label
                   value="Target Time End (UTC)"
                   offset={16}
                   position="bottom"
                   style={{ fontSize: 12, fill: "#64748b", fontWeight: 500 }}
                 />
               </XAxis>

              <YAxis
                tickFormatter={yFormatter}
                tick={{ fontSize: 12, fill: "#64748b" }}
                tickLine={false}
                axisLine={false}
                width={48}
              >
                <Label
                  value="Power (MW)"
                  angle={-90}
                  position="insideLeft"
                  offset={10}
                  style={{ textAnchor: "middle", fontSize: 12, fill: "#64748b" }}
                />
              </YAxis>

              <Tooltip
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 8,
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}
                labelFormatter={(label) => {
                  const d = new Date(label);
                  return d.toLocaleString("en-GB", {
                    timeZone: "UTC",
                    day: "2-digit", month: "2-digit", year: "2-digit",
                    hour: "2-digit", minute: "2-digit",
                  });
                }}
                 formatter={(
                   value: any,
                   name?: any,
                   ...rest: any[]
                 ) => {
                   if (typeof value === "number") {
                     return [`${value.toLocaleString(undefined, { maximumFractionDigits: 0 })} MW`, name ?? ""];
                   }
                   return ["", name ?? ""];
                 }}
              />

              <Legend
                verticalAlign="top"
                align="right"
                iconType="plainline"
                wrapperStyle={{ fontSize: 12, paddingBottom: 8 }}
              />

              <Line
                type="monotone"
                dataKey="actual"
                name="Actual"
                stroke="#2563eb"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="forecast"
                name="Forecast"
                stroke="#16a34a"
                strokeWidth={2}
                dot={false}
                connectNulls
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}