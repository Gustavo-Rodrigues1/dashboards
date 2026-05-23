import { useEffect, useState } from "react";
import { TEAM_COLORS, TEAM_LOGO_URL } from "../constants/ConstantsF1";
import type { TeamDetail } from "../types/F1Types";

export const useTeamsData = () => {
  const [teams, setTeams] = useState<TeamDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teamsRes, resultsRes, photoRes] = await Promise.all([
          fetch("https://api.jolpi.ca/ergast/f1/current/constructorStandings.json"),
          fetch("https://api.jolpi.ca/ergast/f1/current/results.json?limit=500"),
          fetch("https://api.openf1.org/v1/drivers?session_key=latest"),
        ]);

        const teamsJson = await teamsRes.json();
        const resultsJson = await resultsRes.json();
        const photoJson = await photoRes.json();

        const constructorStandings = teamsJson.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;
        const races = resultsJson.MRData.RaceTable.Races;

        // Mapa de fotos
        const photoMap: Record<string, string> = {};
        photoJson.forEach((d: any) => {
          if (d.headshot_url && d.full_name) {
            photoMap[d.full_name.toLowerCase()] = d.headshot_url;
          }
        });

        // Pontos e posições por equipe
        const teamPtsMap: Record<string, number> = {};
        const teamPositionsMap: Record<string, { round: string; position: number }[]> = {};
        const driverPtsMap: Record<string, Record<string, number>> = {};

        races.forEach((race: any) => {

          race.Results.forEach((r: any) => {
            const constructorId = r.Constructor.constructorId;
            const driverName = `${r.Driver.givenName} ${r.Driver.familyName}`;
            const pts = Number(r.points);

            teamPtsMap[constructorId] = (teamPtsMap[constructorId] ?? 0) + pts;

            if (!driverPtsMap[constructorId]) driverPtsMap[constructorId] = {};
            driverPtsMap[constructorId][driverName] = (driverPtsMap[constructorId][driverName] ?? 0) + pts;
          });

          const sorted = Object.entries(teamPtsMap).sort((a, b) => b[1] - a[1]);
          sorted.forEach(([id], idx) => {
            if (!teamPositionsMap[id]) teamPositionsMap[id] = [];
            teamPositionsMap[id].push({ round: `R${race.round}`, position: idx + 1 });
          });
        });

        setTeams(
          constructorStandings.map((c: any) => {
            const id = c.Constructor.constructorId;
            const contribution = driverPtsMap[id] ?? {};

            const driverEntries = Object.entries(contribution).map(([name, pts]) => ({
              name,
              pts: pts as number,
              initials: name.split(" ").map((n: string) => n[0]).join(""),
              photoUrl: photoMap[name.toLowerCase()] ?? null,
            }));

            const driverContribution = driverEntries.map((d, i) => ({
              name: d.name.split(" ").slice(-1)[0], // só sobrenome
              pts: d.pts,
              color: i === 0
                ? TEAM_COLORS[c.Constructor.name] ?? "#888"
                : (TEAM_COLORS[c.Constructor.name] ?? "#888") + "99",
            }));

            return {
              name: c.Constructor.name,
              pts: Number(c.points),
              wins: Number(c.wins),
              nationality: c.Constructor.nationality,
              initials: c.Constructor.name.slice(0, 2).toUpperCase(),
              color: TEAM_COLORS[c.Constructor.name] ?? "#888",
              constructorId: id,
              photoUrl: TEAM_LOGO_URL[id] ?? null,
              drivers: driverEntries,
              driverContribution,
              positions: teamPositionsMap[id] ?? [],
            };
          })
        );
      } catch (err) {
        setError("Erro ao buscar dados das equipes.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { teams, loading, error };
};