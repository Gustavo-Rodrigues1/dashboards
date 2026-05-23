import { useState } from "react";
import { X } from "lucide-react";
import Header from "../components/Header";
import { useTeamsData } from "../hooks/TeamsData";
import type { TeamDetail } from "../types/F1Types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from "recharts";

const StatBox = ({ label, value, color }: { label: string; value: number | string; color?: string }) => (
  <div className="flex flex-col items-center gap-1 bg-background rounded-lg px-4 py-3 border border-font/10">
    <span className="text-xl font-semibold tabular-nums" style={{ color }}>{value}</span>
    <span className="text-[11px] text-font/40 uppercase tracking-widest">{label}</span>
  </div>
);

const Construtores = () => {
  const { teams, loading, error } = useTeamsData();
  const [selected, setSelected] = useState<TeamDetail | null>(null);
  const [compareA, setCompareA] = useState<TeamDetail | null>(null);
  const [compareB, setCompareB] = useState<TeamDetail | null>(null);
  const [compareMode, setCompareMode] = useState(false);

  const handleCompareSelect = (team: TeamDetail) => {
    if (!compareA) return setCompareA(team);
    if (!compareB && team.constructorId !== compareA.constructorId) return setCompareB(team);
  };

  const resetCompare = () => { setCompareA(null); setCompareB(null); };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <p className="text-font/40 text-sm">Carregando equipes...</p>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <p className="text-red-500 text-sm">{error}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="p-6 flex flex-col gap-6">

        {/* Cabeçalho */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-font">Equipes</h1>
            <p className="text-sm text-font/40 mt-0.5">
              Temporada {new Date().getFullYear()} — {teams.length} equipes
            </p>
          </div>
          <button
            onClick={() => { setCompareMode(!compareMode); resetCompare(); }}
            className={`px-4 py-1.5 rounded-md text-sm font-medium border transition-all duration-300 ease-in-out ${
              compareMode
                ? "bg-font text-background border-font"
                : "bg-card text-font/50 border-font/10 hover:text-font"
            }`}
          >
            {compareMode ? "Cancelar comparação" : "Comparar equipes"}
          </button>
        </div>

        {/* Banner de comparação */}
        {compareMode && (
          <div className="bg-card rounded-xl border border-font/10 px-4 py-3 flex items-center gap-3 text-sm text-font/50">
            {compareA?.photoUrl ? (
              <img
                src={compareA.photoUrl}
                alt={compareA.name}
                className="w-16 h-16 rounded-full object-cover border border-font/10"
              />
            ) : (
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-semibold border border-font/10"
                style={{
                  backgroundColor: compareA?.color + "22",
                  color: compareA?.color,
                }}
              >
                {compareA?.initials}
              </div>
            )}
            <span className="text-font/30">vs</span>
            {compareB?.photoUrl ? (
              <img
                src={compareB.photoUrl}
                alt={compareB?.name}
                className="w-16 h-16 rounded-full object-cover border border-font/10"
              />
            ) : (
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-semibold border border-font/10"
                style={{
                  backgroundColor: compareB?.color + "22",
                  color: compareB?.color,
                }}
              >
                {compareB?.initials}
              </div>
            )}
            <span className="ml-1">
              {!compareA
                ? "Selecione o primeiro piloto"
                : !compareB
                  ? "Selecione o segundo piloto"
                  : `${compareA.name} vs ${compareB.name}`}
            </span>
            {compareA && compareB && (
              <button
                onClick={resetCompare}
                className="ml-auto text-font/40 hover:text-font transition-colors duration-300"
              >
                Limpar
              </button>
            )}
          </div>
        )}

        {/* Comparador lado a lado */}
        {compareMode && compareA && compareB && (
          <div className="bg-card rounded-xl border border-font/10 overflow-hidden">
            <div className="px-4 py-3 border-b border-font/10">
              <span className="text-[11px] font-medium text-font/40 uppercase tracking-widest">Comparação</span>
            </div>
            <div className="grid grid-cols-2 divide-x divide-font/10">
              {[compareA, compareB].map((t) => (
                <div key={t.constructorId} className="flex flex-col items-center px-6 py-6 gap-4">
                  {t.photoUrl ? (
                    <div className="flex items-center justify-center w-40 h-16 rounded-xl border border-font/10 p-3"
                      style={{ backgroundColor: t.color + "12" }}>
                      <img src={t.photoUrl} alt={t.name} className="max-w-full max-h-full object-contain"
                        onError={(e) => (e.currentTarget.style.display = "none")} />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-semibold border border-font/10"
                      style={{ backgroundColor: t.color + "22", color: t.color }}>
                      {t.initials}
                    </div>
                  )}
                  <div className="text-center">
                    <p className="font-semibold text-font">{t.name}</p>
                    <p className="text-xs text-font/40 mt-0.5">{t.nationality}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 w-full">
                    <StatBox label="Pts" value={t.pts} color={t.color} />
                    <StatBox label="Vitórias" value={t.wins} />
                    {t.drivers.map((d) => (
                      <StatBox key={d.name} label={d.name.split(" ").slice(-1)[0]} value={d.pts} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Grid de cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {teams.map((t, i) => (
            <div
              key={t.constructorId}
              onClick={() => compareMode ? handleCompareSelect(t) : setSelected(t)}
              className={`bg-card rounded-xl border overflow-hidden cursor-pointer transition-all duration-300 ease-in-out ${
                compareMode && (compareA?.constructorId === t.constructorId || compareB?.constructorId === t.constructorId)
                  ? "border-font/40 scale-[1.02]"
                  : "border-font/10 hover:border-font/20 hover:scale-[1.01]"
              }`}
            >
              {/* Barra de cor no topo */}
              <div className="h-1 w-full" style={{ backgroundColor: t.color }} />

              <div className="p-4 flex flex-col gap-3">
                {/* Logo + posição */}
                <div className="flex items-start justify-between">
                  {t.photoUrl ? (
                    <div className="flex items-center justify-center w-28 h-10 rounded-lg p-2"
                      style={{ backgroundColor: t.color + "12" }}>
                      <img src={t.photoUrl} alt={t.name} className="max-w-full max-h-full object-contain"
                        onError={(e) => (e.currentTarget.style.display = "none")} />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold border border-font/10"
                      style={{ backgroundColor: t.color + "22", color: t.color }}>
                      {t.initials}
                    </div>
                  )}
                  <span className="text-2xl font-semibold text-font/20 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* Nome */}
                <div>
                  <p className="font-semibold text-font text-sm">{t.name}</p>
                  <p className="text-xs text-font/40 mt-0.5">{t.nationality}</p>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between pt-2 border-t border-font/10">
                  <div>
                    <p className="text-xl font-semibold text-font tabular-nums">{t.pts}</p>
                    <p className="text-[10px] text-font/30 uppercase tracking-widest">pontos</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-semibold text-font tabular-nums">{t.wins}</p>
                    <p className="text-[10px] text-font/30 uppercase tracking-widest">vitórias</p>
                  </div>
                </div>

                {/* Pilotos */}
                <div className="flex items-center gap-2">
                  {t.drivers.map((d) => (
                    <div key={d.name} className="flex items-center gap-1.5">
                      {d.photoUrl ? (
                        <img src={d.photoUrl} alt={d.name}
                          className="w-6 h-6 rounded-full object-cover border border-font/10" />
                      ) : (
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold border border-font/10"
                          style={{ backgroundColor: t.color + "22", color: t.color }}>
                          {d.initials}
                        </div>
                      )}
                      <span className="text-xs text-font/50">{d.name.split(" ").slice(-1)[0]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Painel lateral */}
      <div
        className={`fixed top-0 right-0 h-screen w-full max-w-md bg-card border-l border-font/10 z-50 flex flex-col shadow-card transition-transform duration-500 ease-in-out ${
          selected ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {selected && (
          <>
            {/* Header do painel */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-font/10">
              <div className="flex items-center gap-3">
                {selected.photoUrl ? (
                  <div className="flex items-center justify-center w-24 h-10 rounded-lg p-2"
                    style={{ backgroundColor: selected.color + "12" }}>
                    <img src={selected.photoUrl} alt={selected.name}
                      className="max-w-full max-h-full object-contain" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold border border-font/10"
                    style={{ backgroundColor: selected.color + "22", color: selected.color }}>
                    {selected.initials}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-font">{selected.name}</p>
                  <p className="text-xs text-font/40">{selected.nationality}</p>
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="w-7 h-7 flex items-center justify-center rounded-md border border-font/20 text-font/40 hover:text-font hover:bg-card-hover transition-all duration-300 ease-in-out"
              >
                <X size={14} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 flex flex-col gap-5 px-5 py-4">

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2">
                <StatBox label="Pontos" value={selected.pts} color={selected.color} />
                <StatBox label="Vitórias" value={selected.wins} />
                <StatBox label="Pilotos" value={selected.drivers.length} />
              </div>

              {/* Pilotos */}
              <div>
                <p className="text-[11px] font-medium text-font/40 uppercase tracking-widest mb-3">Pilotos</p>
                <div className="flex flex-col gap-2">
                  {selected.drivers.map((d) => (
                    <div key={d.name} className="flex items-center gap-3 bg-background rounded-lg px-3 py-2.5 border border-font/10">
                      {d.photoUrl ? (
                        <img src={d.photoUrl} alt={d.name}
                          className="w-9 h-9 rounded-full object-cover border border-font/10" />
                      ) : (
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold border border-font/10"
                          style={{ backgroundColor: selected.color + "22", color: selected.color }}>
                          {d.initials}
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-font">{d.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-font tabular-nums">{d.pts}</p>
                        <p className="text-[10px] text-font/30 uppercase tracking-widest">pts</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contribuição dos pilotos */}
              <div>
                <p className="text-[11px] font-medium text-font/40 uppercase tracking-widest mb-3">
                  Contribuição por piloto
                </p>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={selected.driverContribution} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--color-font)", opacity: 0.4 }}
                      axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "var(--color-font)", opacity: 0.4 }}
                      axisLine={false} tickLine={false} />
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
                      {selected.driverContribution.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Evolução no campeonato */}
              <div>
                <p className="text-[11px] font-medium text-font/40 uppercase tracking-widest mb-3">
                  Posição no campeonato
                </p>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={selected.positions} margin={{ top: 4, right: 8, left: -28, bottom: 0 }}>
                    <XAxis dataKey="round" tick={{ fontSize: 10, fill: "var(--color-font)", opacity: 0.4 }}
                      axisLine={false} tickLine={false} />
                    <YAxis reversed domain={[1, 10]} ticks={[1, 3, 5, 7, 10]}
                      tick={{ fontSize: 10, fill: "var(--color-font)", opacity: 0.4 }}
                      axisLine={false} tickLine={false} />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (!active || !payload?.length) return null;
                        return (
                          <div className="bg-card border border-font/10 rounded-lg px-3 py-2 shadow-card text-xs">
                            <p className="text-font/50 mb-1">{label}</p>
                            <p style={{ color: selected.color }} className="font-medium">
                              P{payload[0].value}
                            </p>
                          </div>
                        );
                      }}
                    />
                    <Line type="monotone" dataKey="position" stroke={selected.color}
                      strokeWidth={2} dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Overlay */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/30 z-40 transition-opacity duration-500 ease-in-out"
          onClick={() => setSelected(null)}
        />
      )}
    </div>
  );
};

export default Construtores;