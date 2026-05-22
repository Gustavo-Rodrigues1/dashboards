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
  "Audi": "#000000",
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

export const TEAM_LOGO_URL: Record<string, string> = {
  "red_bull": "https://media.formula1.com/content/dam/fom-website/teams/2025/red-bull-racing-logo.png",
  "ferrari": "https://media.formula1.com/content/dam/fom-website/teams/2025/ferrari-logo.png",
  "mclaren": "https://media.formula1.com/content/dam/fom-website/teams/2025/mclaren-logo.png",
  "mercedes": "https://media.formula1.com/content/dam/fom-website/teams/2025/mercedes-logo.png",
  "aston_martin": "https://media.formula1.com/content/dam/fom-website/teams/2025/aston-martin-logo.png",
  "williams": "https://media.formula1.com/content/dam/fom-website/teams/2025/williams-logo.png",
  "rb": "https://media.formula1.com/content/dam/fom-website/teams/2025/racing-bulls-logo.png",
  "haas": "https://cdn.haasf1team.com/s3fs-public/styles/max_325x325/public/2026-01/tgrhf1_team_-_logo_rgb_full_vert_0.png?VersionId=gF8LncwOzSlcIr9Hw39mpzLcxzz4ZuD5",
  "alpine": "https://www.alpinecars.com/assets/images/logo-june-2024.png",
  "audi": "https://upload.wikimedia.org/wikipedia/commons/9/92/Audi-Logo_2016.svg",
   "cadillac": "https://logos-world.net/wp-content/uploads/2021/05/Cadillac-Logo.png",
};