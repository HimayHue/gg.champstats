export function formatTimeAgo(date: Date): string {
   const now = new Date();
   const secondsAgo = Math.floor((now.getTime() - date.getTime()) / 1000);
   if (secondsAgo < 60) {
      return `${secondsAgo} seconds ago`;
   }
   const minutesAgo = Math.floor(secondsAgo / 60);
   if (minutesAgo < 60) {
      return `${minutesAgo} minutes ago`;
   }
   const hoursAgo = Math.floor(minutesAgo / 60);
   if (hoursAgo < 24) {
      return `${hoursAgo} hours ago`;
   }
   const daysAgo = Math.floor(hoursAgo / 24);
   return `${daysAgo} days ago`;
}



export function formatKDA(kills: number, deaths: number, assists: number): string {
   const kda = deaths === 0 ? kills + assists : ((kills + assists) / deaths).toFixed(2);
   return `${kills}/${deaths}/${assists} (KDA: ${kda})`;
}


export function formatWinRate(wins: number, losses: number): string {
   const totalGames = wins + losses;
   if (totalGames === 0) return "0%";
   const winRate = ((wins / totalGames) * 100).toFixed(2);
   return `${winRate}%`;
}



export function formatStatPerMinute(stat: number, durationSeconds: number): string {
   const minutes = durationSeconds / 60;
   if (minutes === 0) return "0";
   const statPerMinute = (stat / minutes).toFixed(2);
   return statPerMinute;
}


export function abbreviateNumber(value: number): string {
   if (value >= 1e9) return (value / 1e9).toFixed(2) + "B";
   if (value >= 1e6) return (value / 1e6).toFixed(2) + "M";
   if (value >= 1e3) return (value / 1e3).toFixed(2) + "K";
   return value.toString();
}


export function toTitleCase(value: string): string {
   return value
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
}


export const formatMatchDuration = (seconds: number): string => {
   const mins = Math.floor(seconds / 60);
   const secs = Math.max(0, seconds % 60);
   return `${mins}m ${secs.toString().padStart(2, "0")}s`;
};

/**
 * Formats a timestamp as a date string.
 * e.g., "Jan 1, 2023" for a timestamp corresponding to January 1st, 2023.
 * @param timestamp 
 * @returns 
 */
export const formatGameStartDate = (timestamp?: number): string => {
   if (!timestamp) return "";
   const date = new Date(timestamp);
   return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
};



/**
 * Normalizes a full game version (e.g., 14.5.612.9) to a 
 * Data Dragon compatible version (e.g., 14.5.1).
 */
export const getDDragonVersion = (gameVersion?: string): string => {
   if (!gameVersion) return "16.6.1"; // Updated to current 2026 season default

   const [major, minor] = gameVersion.split(".");

   // If we have at least Major and Minor, return the DDragon format
   if (major && minor) {
      return `${major}.${minor}.1`;
   }

   return gameVersion;
};