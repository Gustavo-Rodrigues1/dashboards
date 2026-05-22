import { useEffect, useState } from "react";
import { TEAM_COLORS } from "../constants/ConstantsF1";
import { TEAM_LOGO_URL } from "../constants/ConstantsF1";
import type { Driver, Team, RacePoint } from "../types/F1Types";

export const useF1Data = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [races, setRaces] = useState<RacePoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Busca os dados de pilotos, times e corridas
        const [driversRes, teamsRes, racesRes, racePhotoRes] =
          await Promise.all([
            fetch(
              "https://api.jolpi.ca/ergast/f1/current/driverStandings.json",
            ),
            fetch(
              "https://api.jolpi.ca/ergast/f1/current/constructorStandings.json",
            ),
            fetch(
              "https://api.jolpi.ca/ergast/f1/current/results.json?limit=500",
            ),
            fetch("https://api.openf1.org/v1/drivers?session_key=latest"),
          ]);

        const driversJson = await driversRes.json();
        const teamsJson = await teamsRes.json();
        const racesJson = await racesRes.json();
        const racePhotoJson = await racePhotoRes.json();

        const driverStandings =
          driversJson.MRData.StandingsTable.StandingsLists[0].DriverStandings;
        const constructorStandings =
          teamsJson.MRData.StandingsTable.StandingsLists[0]
            .ConstructorStandings;
        const raceResults = racesJson.MRData.RaceTable.Races;

        // Mapa de fotos pelo nome
        const photoMap: Record<string, string> = {};
        racePhotoJson.forEach((d: any) => {
          if (d.headshot_url && d.full_name) {
            photoMap[d.full_name.toLowerCase()] = d.headshot_url;
          }
        });

        // Top 5 pilotos
        const top5Names = driverStandings
          .slice(0, 5)
          .map((d: any) => `${d.Driver.givenName} ${d.Driver.familyName}`);

        // Pontos acumulados do top 5
        const accumulated: Record<string, number> = {};
        top5Names.forEach((name: string) => (accumulated[name] = 0));

        const racePoints: RacePoint[] = raceResults.map((race: any) => {
          const entry: RacePoint = { round: `R${race.round}` };

          race.Results.forEach((result: any) => {
            const name = `${result.Driver.givenName} ${result.Driver.familyName}`;
            if (top5Names.includes(name)) {
              accumulated[name] =
                (accumulated[name] ?? 0) + Number(result.points);
            }
          });

          top5Names.forEach((name: string) => {
            entry[name] = accumulated[name];
          });

          return entry;
        });

        setDrivers(
          driverStandings.map((d: any) => {
            const fullName = `${d.Driver.givenName} ${d.Driver.familyName}`;
            return {
              name: fullName,
              team: d.Constructors[0].name,
              pts: Number(d.points),
              nationality: d.Driver.nationality,
              initials: `${d.Driver.givenName[0]}${d.Driver.familyName[0]}`,
              color: TEAM_COLORS[d.Constructors[0].name] ?? "#888",
              photoUrl: photoMap[fullName.toLowerCase()] ?? null,
            };
          }),
        );

        setTeams(
          constructorStandings.map((c: any) => ({
            name: c.Constructor.name,
            pts: Number(c.points),
            wins: Number(c.wins),
            nationality: c.Constructor.nationality,
            initials: c.Constructor.name.slice(0, 2).toUpperCase(),
            color: TEAM_COLORS[c.Constructor.name] ?? "#888",
            constructorId: c.Constructor.constructorId,
            logoUrl: TEAM_LOGO_URL(c.Constructor.constructorId),
          })),
        );

        setRaces(racePoints);
      } catch (err) {
        setError("Erro ao buscar dados da F1.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { drivers, teams, races, loading, error };
};
