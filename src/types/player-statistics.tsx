export type CalculatedPlayerStats = {
   gamesPlayed: number;
   winRate: number;
   kda: string;
   csPerMin: string;
   goldPerMin: string;
   gameDuration: string;
   mostPlayedChampions: {
      champion: string;
      games: number;
      winRate: number;
      goldPerMin: string;
      csPerMin: string;
      kda: string;
   }[];
}
