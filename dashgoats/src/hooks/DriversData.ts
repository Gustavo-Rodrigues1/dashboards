import { useEffect, useState } from "react";
import { TEAM_COLORS } from "../constants/ConstantsF1";
import type { DriverDetail } from "../types/F1Types";

export const useDriversData = () => {
  const [drivers, setDrivers] = useState<DriverDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [standingsRes, resultsRes, qualiRes, photoRes] =
          await Promise.all([
            fetch(
              "https://api.jolpi.ca/ergast/f1/current/driverStandings.json",
            ),
            fetch(
              "https://api.jolpi.ca/ergast/f1/current/results.json?limit=500",
            ),
            fetch(
              "https://api.jolpi.ca/ergast/f1/current/qualifying.json?limit=500",
            ),
            fetch("https://api.openf1.org/v1/drivers?session_key=latest"),
          ]);

        const standingsJson = await standingsRes.json();
        const resultsJson = await resultsRes.json();
        const qualiJson = await qualiRes.json();
        const photoJson = await photoRes.json();

        const standings =
          standingsJson.MRData.StandingsTable.StandingsLists[0].DriverStandings;
        const races = resultsJson.MRData.RaceTable.Races;
        const qualiRaces = qualiJson.MRData.RaceTable.Races;

        const photoMap: Record<string, string> = {};
        photoJson.forEach((d: any) => {
          if (d.headshot_url) {
            photoMap[d.full_name.toLowerCase()] = d.headshot_url;
          }
        });

        // Mapa de poles por driverId
        const polesMap: Record<string, number> = {};
        qualiRaces.forEach((race: any) => {
          const pole = race.QualifyingResults?.[0];
          if (pole) {
            const id = pole.Driver.driverId;
            polesMap[id] = (polesMap[id] ?? 0) + 1;
          }
        });

        // Mapa de stats por driverId
        const statsMap: Record<
          string,
          {
            podiums: number;
            dnfs: number;
            positions: { round: string; position: number }[];
          }
        > = {};

        races.forEach((race: any) => {
          race.Results.forEach((r: any) => {
            const id = r.Driver.driverId;
            if (!statsMap[id])
              statsMap[id] = { podiums: 0, dnfs: 0, positions: [] };

            const pos = parseInt(r.position);
            if (pos <= 3) statsMap[id].podiums += 1;
            if (r.status !== "Finished" && !r.status.startsWith("+"))
              statsMap[id].dnfs += 1;

            statsMap[id].positions.push({
              round: `R${race.round}`,
              position: pos,
            });
          });
        });

        setDrivers(
          standings.map((d: any) => {
            const fullName = `${d.Driver.givenName} ${d.Driver.familyName}`.toLowerCase();
            const id = d.Driver.driverId;
            const stats = statsMap[id] ?? {
              podiums: 0,
              dnfs: 0,
              positions: [],
            };
            return {
              name: `${d.Driver.givenName} ${d.Driver.familyName}`,
              team: d.Constructors[0].name,
              pts: Number(d.points),
              wins: Number(d.wins),
              photoUrl: photoMap[fullName] ?? null,
              podiums: stats.podiums,
              poles: polesMap[id] ?? 0,
              dnfs: stats.dnfs,
              nationality: d.Driver.nationality,
              initials: `${d.Driver.givenName[0]}${d.Driver.familyName[0]}`,
              color: TEAM_COLORS[d.Constructors[0].name] ?? "#888",
              driverId: id,
              number: d.Driver.permanentNumber ?? "",
              positions: stats.positions,
            };
          }),
        );
      } catch (err) {
        setError("Erro ao buscar dados dos pilotos.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { drivers, loading, error };
};
