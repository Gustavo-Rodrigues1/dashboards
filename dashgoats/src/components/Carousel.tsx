import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useF1Data } from "../hooks/HomeData";

type Tab = "drivers" | "teams";

const DriversPage = () => {
  const { drivers, teams, loading, error } = useF1Data();

  const [tab, setTab] = useState<Tab>("drivers");
  const [driverIdx, setDriverIdx] = useState(0);
  const [teamIdx, setTeamIdx] = useState(0);

  const isDrivers = tab === "drivers";
  const items = isDrivers ? drivers : teams;
  const current = isDrivers ? driverIdx : teamIdx;
  const setCurrent = isDrivers ? setDriverIdx : setTeamIdx;

  const prev = () => setCurrent((c) => (c - 1 + items.length) % items.length);
  const next = () => setCurrent((c) => (c + 1) % items.length);
  const item = items[current];

  if (loading) return <p className="text-font/50 p-6">Carregando...</p>;
  if (error) return <p className="text-red-500 p-6">{error}</p>;
  if (!item) return null;

  return (
    <div className="flex flex-col gap-4 p-6">

      {/* Botões de alternância */}
      <div className="flex gap-1 p-1 bg-card rounded-lg border border-font/10 w-fit">
        {(["drivers", "teams"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-300 ease-in-out ${
              tab === t
                ? "bg-background text-font shadow-card"
                : "text-font/50 hover:text-font"
            }`}
          >
            {t === "drivers" ? "Pilotos" : "Times"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">

        {/* Carrossel */}
        <div className="bg-card rounded-xl border border-font/10 overflow-hidden">
          <div className="px-4 py-3 border-b border-font/10">
            <span className="text-[11px] font-medium text-font/50 uppercase tracking-widest">
              {isDrivers ? "Pilotos 2025" : "Times 2025"}
            </span>
          </div>

          <div className="flex flex-col items-center px-6 py-8 transition-all duration-500 ease-in-out">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-2xl font-medium mb-4 border border-font/10 transition-colors duration-500 ease-in-out"
              style={{ backgroundColor: item.color + "22", color: item.color }}
            >
              {item.initials}
            </div>
            <p className="text-base font-medium text-font transition-all duration-500 ease-in-out">
              {item.name}
            </p>
            <p className="text-3xl font-medium text-font mt-4 transition-all duration-500 ease-in-out">
              {item.pts}
            </p>
            <p className="text-xs text-font/40 mt-1">pontos</p>
          </div>

          {/* Controles */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-font/10">
            <button
              onClick={prev}
              className="w-7 h-7 flex items-center justify-center rounded-md border border-font/20 text-font/50 hover:text-font hover:bg-card-hover transition-all duration-300 ease-in-out"
            >
              <ChevronLeft size={14} />
            </button>

            <div className="flex gap-1.5">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`rounded-full transition-all duration-300 ease-in-out ${
                    i === current
                      ? "w-2 h-2 bg-violet-500 scale-125"
                      : "w-1.5 h-1.5 bg-font/20"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-7 h-7 flex items-center justify-center rounded-md border border-font/20 text-font/50 hover:text-font hover:bg-card-hover transition-all duration-300 ease-in-out"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Tabela */}
        <div className="bg-card rounded-xl border border-font/10 overflow-hidden">
          <div className="px-4 py-3 border-b border-font/10">
            <span className="text-[11px] font-medium text-font/50 uppercase tracking-widest">
              Classificação
            </span>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-font/10">
                <th className="text-left px-4 py-2.5 text-[11px] font-medium text-font/40 uppercase tracking-widest w-8">#</th>
                <th className="text-left px-4 py-2.5 text-[11px] font-medium text-font/40 uppercase tracking-widest">
                  {isDrivers ? "Piloto" : "Time"}
                </th>
                <th className="text-right px-4 py-2.5 text-[11px] font-medium text-font/40 uppercase tracking-widest">Pts</th>
              </tr>
            </thead>
            <tbody>
              {items.map((d, i) => (
                <tr
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`border-b border-font/5 last:border-none cursor-pointer transition-colors duration-300 ease-in-out ${
                    i === current ? "bg-card-hover" : "hover:bg-card-hover"
                  }`}
                >
                  <td className="px-4 py-2.5 font-medium text-font/40">{i + 1}</td>
                  <td className="px-4 py-2.5 text-font">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: d.color }}
                      />
                      {d.name}
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-right font-medium text-font">{d.pts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DriversPage;