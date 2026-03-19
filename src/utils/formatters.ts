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


export function formatMatchDuration(seconds: number): string {
   const minutes = Math.floor(seconds / 60);
   const remainingSeconds = seconds % 60;
   return `${minutes}m ${remainingSeconds}s`;
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