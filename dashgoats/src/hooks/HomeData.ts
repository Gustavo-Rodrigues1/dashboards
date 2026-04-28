import { useEffect, useState } from "react";

interface Driver {
  name: string;
  team: string;
  pts: number;
  nationality: string;
  initials: string;
  color: string;
}

interface Team {
  name: string;
  pts: number;
  nationality: string;
  initials: string;
  color: string;
}

const TEAM_COLORS: Record<string, string> = {
  "Red Bull": "#3671C6",
  "Ferrari": "#E8002D",
  "McLaren": "#FF8000",
  "Mercedes": "#27F4D2",
  "Aston Martin": "#358C75",
  "Williams": "#64C4FF",
  "RB F1 Team": "#6692FF",
  "Haas F1 Team": "#B6BABD",
  "Alpine F1 Team": "#FF87BC",
  "Kick Sauber": "#52E252",
};

export const useF1Data = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [driversRes, teamsRes] = await Promise.all([
          fetch("https://api.jolpi.ca/ergast/f1/current/driverStandings.json"),
          fetch("https://api.jolpi.ca/ergast/f1/current/constructorStandings.json"),
        ]);

        const driversJson = await driversRes.json();
        const teamsJson = await teamsRes.json();

        const driverStandings = driversJson.MRData.StandingsTable.StandingsLists[0].DriverStandings;
        const constructorStandings = teamsJson.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;

        setDrivers(
          driverStandings.map((d: any) => ({
            name: `${d.Driver.givenName} ${d.Driver.familyName}`,
            team: d.Constructors[0].name,
            pts: Number(d.points),
            nationality: d.Driver.nationality,
            initials: `${d.Driver.givenName[0]}${d.Driver.familyName[0]}`,
            color: TEAM_COLORS[d.Constructors[0].name] ?? "#888",
          }))
        );

        setTeams(
          constructorStandings.map((c: any) => ({
            name: c.Constructor.name,
            pts: Number(c.points),
            nationality: c.Constructor.nationality,
            initials: c.Constructor.name.slice(0, 2).toUpperCase(),
            color: TEAM_COLORS[c.Constructor.name] ?? "#888",
          }))
        );
      } catch (err) {
        setError("Erro ao buscar dados da F1.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { drivers, teams, loading, error };
};