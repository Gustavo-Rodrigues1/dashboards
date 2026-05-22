import { useState } from "react";
import { X } from "lucide-react";
import Header from "../components/Header";
import { useDriversData } from "../hooks/DriversData";
import { FLAG_URL } from "../constants/ConstantsF1";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

const StatBox = ({
  label,
  value,
  color,
}: {
  label: string;
  value: number | string;
  color?: string;
}) => (
  <div className="flex flex-col items-center gap-1 bg-background rounded-lg px-4 py-3 border border-font/10">
    <span className="text-xl font-semibold tabular-nums" style={{ color }}>
      {value}
    </span>
    <span className="text-[11px] text-font/40 uppercase tracking-widest">
      {label}
    </span>
  </div>
);

const Pilotos = () => {
  const { drivers, loading, error } = useDriversData();
  const [selected, setSelected] = useState<(typeof drivers)[0] | null>(null);
  const [compareA, setCompareA] = useState<(typeof drivers)[0] | null>(null);
  const [compareB, setCompareB] = useState<(typeof drivers)[0] | null>(null);
  const [compareMode, setCompareMode] = useState(false);

  const handleCompareSelect = (driver: (typeof drivers)[0]) => {
    if (!compareA) return setCompareA(driver);
    if (!compareB && driver.driverId !== compareA.driverId)
      return setCompareB(driver);
  };

  const resetCompare = () => {
    setCompareA(null);
    setCompareB(null);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <p className="text-font/40 text-sm">Carregando pilotos...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="p-6 flex flex-col gap-6">
        {/* Cabeçalho da página */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-font">Pilotos</h1>
            <p className="text-sm text-font/40 mt-0.5">
              Pilotos {new Date().getFullYear()} — {drivers.length} pilotos
            </p>
          </div>
          <button
            onClick={() => {
              setCompareMode(!compareMode);
              resetCompare();
            }}
            className={`px-4 py-1.5 rounded-md text-sm font-medium border transition-all duration-300 ease-in-out ${
              compareMode
                ? "bg-font text-background border-font"
                : "bg-card text-font/50 border-font/10 hover:text-font"
            }`}
          >
            {compareMode ? "Cancelar comparação" : "Comparar pilotos"}
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
              <span className="text-[11px] font-medium text-font/40 uppercase tracking-widest">
                Comparação
              </span>
            </div>
            <div className="grid grid-cols-2 divide-x divide-font/10">
              {[compareA, compareB].map((d) => (
                <div
                  key={d.driverId}
                  className="flex flex-col items-center px-6 py-6 gap-4"
                >
                  {d.photoUrl ? (
                    <img
                      src={d.photoUrl}
                      alt={d.name}
                      className="w-16 h-16 rounded-full object-cover border border-font/10"
                    />
                  ) : (
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-semibold border border-font/10"
                      style={{
                        backgroundColor: d.color + "22",
                        color: d.color,
                      }}
                    >
                      {d.initials}
                    </div>
                  )}
                  <div className="text-center">
                    <p className="font-semibold text-font">{d.name}</p>
                    <p className="text-xs text-font/40 mt-0.5">{d.team}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 w-full">
                    <StatBox label="Pts" value={d.pts} color={d.color} />
                    <StatBox label="Vitórias" value={d.wins} />
                    <StatBox label="Pódios" value={d.podiums} />
                    <StatBox label="Poles" value={d.poles} />
                    <StatBox label="DNFs" value={d.dnfs} />
                    <StatBox label="Nº" value={d.number} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lista de pilotos */}
        <div className="flex flex-col gap-2">
          {drivers.map((d, i) => (
            <div
              key={d.driverId}
              onClick={() =>
                compareMode ? handleCompareSelect(d) : setSelected(d)
              }
              className={`flex items-center gap-4 px-4 py-3 bg-card rounded-xl border transition-all duration-300 ease-in-out cursor-pointer ${
                compareMode &&
                (compareA?.driverId === d.driverId ||
                  compareB?.driverId === d.driverId)
                  ? "border-font/40 bg-card-hover"
                  : "border-font/10 hover:bg-card-hover hover:border-font/20"
              }`}
            >
              {/* Posição */}
              <span className="text-sm font-medium text-font/30 w-5 tabular-nums">
                {i + 1}
              </span>

              {/* Avatar */}
              {d?.photoUrl ? (
                <img
                  src={
                    d?.photoUrl ??
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(d.name)}&background=${d.color.slice(1)}22&color=${d.color.slice(1)}`
                  }
                  alt={d?.name}
                  className="w-16 h-16 rounded-full object-cover border border-font/10"
                />
              ) : (
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-semibold border border-font/10"
                  style={{
                    backgroundColor: d?.color + "22",
                    color: d?.color,
                  }}
                >
                  {d?.initials}
                </div>
              )}

              {/* Nome + equipe */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-font truncate">
                  {d.name}
                </p>
                <p className="text-xs text-font/40 truncate">{d.team}</p>
              </div>

              {/* Bandeira */}
              <img
                src={FLAG_URL(d.nationality)}
                alt={d.nationality}
                className="w-6 h-4 rounded-sm object-cover opacity-80"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />

              {/* Stats */}
              <div className="hidden md:flex items-center gap-6 text-sm">
                <div className="text-center">
                  <p className="font-semibold text-font tabular-nums">
                    {d.pts}
                  </p>
                  <p className="text-[10px] text-font/30 uppercase tracking-widest">
                    Pts
                  </p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-font tabular-nums">
                    {d.wins}
                  </p>
                  <p className="text-[10px] text-font/30 uppercase tracking-widest">
                    Vitórias
                  </p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-font tabular-nums">
                    {d.podiums}
                  </p>
                  <p className="text-[10px] text-font/30 uppercase tracking-widest">
                    Pódios
                  </p>
                </div>
              </div>

              {/* Cor da equipe */}
              <div
                className="w-1 h-8 rounded-full shrink-0"
                style={{ backgroundColor: d.color }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Modal de detalhe */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-card rounded-2xl border border-font/10 shadow-card w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header do modal */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-font/10">
              <div className="flex items-center gap-3">
                {selected.photoUrl ? (
                  <img
                    src={selected.photoUrl}
                    alt={selected.name}
                    className="w-16 h-16 rounded-full object-cover border border-font/10"
                  />
                ) : (
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-semibold border border-font/10"
                    style={{
                      backgroundColor: selected.color + "22",
                      color: selected.color,
                    }}
                  >
                    {selected.initials}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-font">{selected.name}</p>
                  <p className="text-xs text-font/40">{selected.team}</p>
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="w-7 h-7 flex items-center justify-center rounded-md border border-font/20 text-font/40 hover:text-font hover:bg-card-hover transition-all duration-300 ease-in-out"
              >
                <X size={14} />
              </button>
            </div>

            {/* Stats */}
            <div className="px-5 py-4 grid grid-cols-3 gap-2">
              <StatBox
                label="Pontos"
                value={selected.pts}
                color={selected.color}
              />
              <StatBox label="Vitórias" value={selected.wins} />
              <StatBox label="Pódios" value={selected.podiums} />
              <StatBox label="Poles" value={selected.poles} />
              <StatBox label="DNFs" value={selected.dnfs} />
              <StatBox label="Número" value={selected.number} />
            </div>

            {/* Gráfico de posições */}
            <div className="px-5 pb-5">
              <p className="text-[11px] font-medium text-font/40 uppercase tracking-widest mb-3">
                Posições por corrida
              </p>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart
                  data={selected.positions}
                  margin={{ top: 4, right: 8, left: -28, bottom: 0 }}
                >
                  <XAxis
                    dataKey="round"
                    tick={{
                      fontSize: 10,
                      fill: "var(--color-font)",
                      opacity: 0.4,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    reversed
                    domain={[1, 20]}
                    ticks={[1, 5, 10, 15, 20]}
                    tick={{
                      fontSize: 10,
                      fill: "var(--color-font)",
                      opacity: 0.4,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (!active || !payload?.length) return null;
                      return (
                        <div className="bg-card border border-font/10 rounded-lg px-3 py-2 shadow-card text-xs">
                          <p className="text-font/50 mb-1">{label}</p>
                          <p
                            style={{ color: selected.color }}
                            className="font-medium"
                          >
                            P{payload[0].value}
                          </p>
                        </div>
                      );
                    }}
                  />
                  <ReferenceLine
                    y={3}
                    stroke={selected.color}
                    strokeDasharray="3 3"
                    opacity={0.3}
                  />
                  <Line
                    type="monotone"
                    dataKey="position"
                    stroke={selected.color}
                    strokeWidth={2}
                    dot={{ r: 3, fill: selected.color, strokeWidth: 0 }}
                    activeDot={{ r: 5, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              <p className="text-[10px] text-font/30 text-center mt-1">
                Linha tracejada = pódio
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pilotos;
