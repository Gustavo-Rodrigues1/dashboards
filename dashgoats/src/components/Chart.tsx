import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell,
  BarChart, Bar,
} from "recharts";

import type { Driver, Team, RacePoint } from "../types/F1Types";

interface ChartsProps {
  drivers: Driver[];
  teams: Team[];
  races: RacePoint[];
}

const CustomTooltipLine = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-font/10 rounded-lg px-3 py-2 shadow-card text-xs">
      <p className="text-font/50 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }} className="font-medium">
          {p.name}: {p.value} pts
        </p>
      ))}
    </div>
  );
};

const Charts = ({ drivers, teams, races }: ChartsProps) => {
  const top5 = drivers.slice(0, 5);

  const winsData = teams
    .filter((t) => (t.wins ?? 0) > 0)
    .map((t) => ({ name: t.name, value: t.wins ?? 0, color: t.color }));

  const teamPtsData = teams.map((t) => ({
    name: t.name.split(" ")[0],
    pts: t.pts,
    color: t.color,
  }));

  return (
    <div className="flex flex-col gap-4">

      {/* Evolução de pontos — full width */}
      <div className="bg-card rounded-xl border border-font/10 overflow-hidden">
        <div className="px-4 py-3 border-b border-font/10">
          <span className="text-[11px] font-medium text-font/50 uppercase tracking-widest">
            Evolução de pontos por corrida
          </span>
        </div>
        <div className="p-4">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={races} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="round"
                tick={{ fontSize: 11, fill: "var(--color-font)", opacity: 0.4 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "var(--color-font)", opacity: 0.4 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltipLine />} />
              <Legend
                wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
                formatter={(value) => (
                  <span style={{ color: "var(--color-font)", opacity: 0.5 }}>{value}</span>
                )}
              />
              {top5.map((d) => (
                <Line
                  key={d.name}
                  type="monotone"
                  dataKey={d.name}
                  stroke={d.color}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 0 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Vitórias + Pontos por equipe — grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

        {/* Distribuição de vitórias */}
        <div className="bg-card rounded-xl border border-font/10 overflow-hidden">
          <div className="px-4 py-3 border-b border-font/10">
            <span className="text-[11px] font-medium text-font/50 uppercase tracking-widest">
              Vitórias por equipe
            </span>
          </div>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={winsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {winsData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload;
                    return (
                      <div className="bg-card border border-font/10 rounded-lg px-3 py-2 shadow-card text-xs">
                        <p style={{ color: d.color }} className="font-medium">{d.name}</p>
                        <p className="text-font/50">{d.value} vitória{d.value > 1 ? "s" : ""}</p>
                      </div>
                    );
                  }}
                />
                <Legend
                  formatter={(value) => (
                    <span style={{ color: "var(--color-font)", opacity: 0.5, fontSize: 12 }}>{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pontos por equipe */}
        <div className="bg-card rounded-xl border border-font/10 overflow-hidden">
          <div className="px-4 py-3 border-b border-font/10">
            <span className="text-[11px] font-medium text-font/50 uppercase tracking-widest">
              Pontos por equipe
            </span>
          </div>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={teamPtsData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "var(--color-font)", opacity: 0.4 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "var(--color-font)", opacity: 0.4 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    return (
                      <div className="bg-card border border-font/10 rounded-lg px-3 py-2 shadow-card text-xs">
                        <p className="text-font/50 mb-1">{label}</p>
                        <p className="font-medium text-font">{payload[0].value} pts</p>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="pts" radius={[4, 4, 0, 0]}>
                  {teamPtsData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Charts;