export const TEAM_COLORS: Record<string, string> = {
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

export const NATIONALITY_TO_CODE: Record<string, string> = {
  British: "gb", Dutch: "nl", Monegasque: "mc", Spanish: "es",
  Australian: "au", Mexican: "mx", German: "de", Finnish: "fi",
  French: "fr", Canadian: "ca", Japanese: "jp", Thai: "th",
  Chinese: "cn", Danish: "dk", American: "us", Brazilian: "br",
  Argentine: "ar", Austrian: "at", Italian: "it", Polish: "pl",
};

export const FLAG_URL = (nationality: string) =>
  `https://flagcdn.com/24x18/${NATIONALITY_TO_CODE[nationality] ?? "un"}.png`;

export const TEAM_LOGO_URL = (constructorId: string) =>
  `https://media.formula1.com/content/dam/fom-website/teams/2025/${constructorId}-logo.png`;