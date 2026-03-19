import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SummonerDTO, AccountInformation } from "@/types/LeagueOfLegends";
import Image from "next/image";


interface TopChampionsCardProps {
   mostPlayedChampions: {
      champion: string;
      games: number;
      winRate: number;
   }[];
}
export function TopChampionsCard({ mostPlayedChampions }: TopChampionsCardProps) {
   return (
      <Card className="bg-slate-900/50 ring-foreground/5">
         <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Top Champions</CardTitle>
         </CardHeader>
         <CardContent className="text-xs text-muted-foreground">
            {mostPlayedChampions.length === 0 ? (
               <p>No champion data available.</p>
            ) : (
               <ul className="space-y-2">
                  {mostPlayedChampions.map((championData, index) => (
                     <li key={index} className="flex items-center gap-2">
                        <Image
                           src={`https://ddragon.leagueoflegends.com/cdn/13.6.1/img/champion/${championData.champion}.png`}
                           alt={championData.champion}
                           width={32}
                           height={32}
                           className="rounded-full"
                        />
                        <div>
                           <p className="font-medium">{championData.champion}</p>
                           <p className="text-xs text-muted-foreground">
                              {championData.games} games, {championData.winRate.toFixed(1)}% win rate
                           </p>
                        </div>
                     </li>
                  ))}
               </ul>
            )}
         </CardContent>
      </Card>
   );
}


interface ProfileSummaryCardProps {
   summonerProfileData: SummonerDTO | null;
   accountData: AccountInformation | null;
   mostPlayedCHampion: string;
}
export function SummonerProfileBanner({ summonerProfileData: profileData, accountData, mostPlayedCHampion }: ProfileSummaryCardProps) {

   if (!profileData || !accountData) {
      return (
         <Card className="flex flex-row">
            <CardContent className="text-sm text-muted-foreground flex flex-col items-center">
               <p>Loading profile data...</p>
            </CardContent>
         </Card>
      );
   }

   return (
      <Card className="relative overflow-hidden">
         <div
            className="absolute inset-0 bg-cover"
            style={{
               backgroundImage: `url(https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${mostPlayedCHampion}_0.jpg)`,
               backgroundPosition: "center -50px",
            }}
         />
         <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/75 to-slate-950/40" />

         <div className="relative flex flex-row items-center gap-6 px-6 py-10">
            <CardContent className="text-sm text-muted-foreground flex flex-col items-center bg-transparent p-0">
               <div className="relative">
                  <Image
                     src={`https://ddragon.leagueoflegends.com/cdn/13.6.1/img/profileicon/${profileData.profileIconId}.png`}
                     alt="Profile Icon"
                     width={110}
                     height={110}
                     className="rounded-sm border-2 border-primary shadow-lg"
                  />
                  <p
                     className="absolute left-1/2 bottom-0 w-fit -translate-x-1/2 translate-y-1/2 rounded-sm border border-primary/80 bg-slate-900/90 px-2 py-0.5 text-xs text-white"
                  >
                     {profileData.summonerLevel || "N/A"}
                  </p>
               </div>
            </CardContent>

            <div className="flex flex-col gap-3 text-white">
               <CardTitle className="text-lg flex items-center gap-3">
                  <span className="text-4xl font-bold drop-shadow-md">{accountData.gameName}</span>
                  <span className="text-3xl rounded-sm border border-sky-500/50 bg-sky-500/25 px-2.5 py-1 text-sm font-semibold tracking-tight text-sky-50 drop-shadow">
                     #{accountData.tagLine}
                  </span>
               </CardTitle>
               <Button variant="default" className="w-fit px-10">
                  Update
               </Button>
            </div>
         </div>
      </Card>
   )
}


interface MatchHistoryOverviewCardProps {
   matchHistoryData: {
      championName: string;
      role: string;
      win: boolean;
      kills: number;
      deaths: number;
      assists: number;
   }[];
}
/**
 * Simple card component to display a brief overview of the player's recent match history, including champion played, role,
 *  and basic performance stats (KDA, win/loss, game duration, gold/min cs/min, kill participation).
 * @param param0 
 * @returns 
 */
export function MatchHistoryOverviewCard({ matchHistoryData }: MatchHistoryOverviewCardProps) {
   return (
      <Card className="bg-slate-900/50 ring-foreground/5">
         <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Match History</CardTitle>
         </CardHeader>
         <CardContent className="text-xs text-muted-foreground">
            {matchHistoryData.length === 0 ? (
               <p>No match history data available.</p>
            ) : (
               <ul className="space-y-2">
                  {matchHistoryData.map((match, index) => (
                     <li key={index} className="flex items-center gap-2">
                        <Image
                           src={`https://ddragon.leagueoflegends.com/cdn/13.6.1/img/champion/${match.championName}.png`}
                           alt={match.championName}
                           width={32}
                           height={32}
                           className="rounded-full"
                        />
                        <div>
                           <p className="font-medium">{match.championName} - {match.role}</p>
                           <p className="text-xs text-muted-foreground">
                              {match.win ? "Win" : "Loss"} - {match.kills}/{match.deaths}/{match.assists}
                           </p>
                        </div>
                     </li>
                  ))}
               </ul>
            )}
         </CardContent>
      </Card>
   );
}


