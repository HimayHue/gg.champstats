import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SummonerDTO, AccountInformation, MatchDto } from "@/types/LeagueOfLegends";
import { MatchSummaryCard } from "@/components/match-history";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";


interface TopChampionsCardProps {
   mostPlayedChampions: {
      champion: string;
      games: number;
      winRate: number;
   }[];
}
/**
 * A card component that displays the most played champions for a summoner, including the champion icon, name, number of games played, and win rate. If no champion data is available, it shows a message indicating that.
 */
export function MostPlayedChampionsColumn({ mostPlayedChampions }: TopChampionsCardProps) {
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
/**
 * A profile summary card component that displays the summoner's profile icon, level, Riot name, and tag. It also includes a background image based on the most played champion. If the profile data is still loading, it shows a loading message.
 */
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


/**
 * A component that renders a list of match summary cards for a summoner's match history. It takes in the match history data and account information as props and maps over the match history data to create individual MatchSummaryCard components for each match. 
 * If there is no match history data, it will simply render nothing.
 */
export function MatchHistoryColumn({ matchHistoryData, accountData }: { matchHistoryData: MatchDto[]; accountData: AccountInformation }) {
   return (
      <>
         {matchHistoryData.map((match, index) => (
            <MatchSummaryCard key={match.metadata.matchId ?? index} match={match} puuid={accountData.puuid} />
         ))}
      </>

   );
}


/**
 * A performance summary card component that displays a summoner's match history performance, including their Riot name and tag, number of games played, win rate, average KDA, average CS per minute, and average game duration. 
 * If there is no match history data available, it shows a message indicating that.
 */
export function MatchHistoryPerformanceCard(
   { riotName, riotTag, gamesPlayed, winRate, avgKda, avgCsPerMin, avgGameDuration, playerTotals, recentGamesCount }:
      { riotName: string; riotTag: string; gamesPlayed: number; winRate: number; avgKda: string; avgCsPerMin: string; avgGameDuration: string; recentGamesCount?: number; playerTotals: { wins: number; kills: number; deaths: number; assists: number; cs: number } }) {
   const gamesShown = recentGamesCount ?? gamesPlayed;

   if (gamesPlayed === 0) {
      return (
         <Card className="bg-slate-900/50 ring-foreground/5">
            <CardHeader>
               <CardTitle className="text-sm text-muted-foreground">Match History</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
               <p>No match history data available.</p>
            </CardContent>
         </Card>
      );
   }

   return (
      <Card className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 ring-foreground/5">
         <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
               <CardTitle className="text-2xl font-bold text-white">
                  {riotName}
                  <span className="text-slate-400">#{riotTag}</span>
               </CardTitle>
               <div className="flex flex-wrap gap-2 pt-1">
                  <Badge variant="secondary">{gamesPlayed} games</Badge>
                  <Badge variant="secondary">{winRate}% win rate</Badge>
               </div>
            </div>
         </CardHeader>
         <CardContent className="grid gap-3 md:grid-cols-4">
            <StatTile label="Win rate" value={`${winRate}%`} hint={`${playerTotals.wins}W / ${gamesPlayed - playerTotals.wins}L`} />
            <StatTile label="Average KDA" value={`${avgKda}:1`} hint={`${playerTotals.kills}/${playerTotals.deaths}/${playerTotals.assists}`} />
            <StatTile label="CS per min" value={avgCsPerMin} hint={`${playerTotals.cs} total CS`} />
            <StatTile label="Avg game length" value={avgGameDuration} hint={`${gamesShown} recent games`} />
         </CardContent>
      </Card>
   );
}

function StatTile({ label, value, hint }: { label: string; value: string; hint?: string }) {
   return (
      <div className="rounded-xl bg-slate-900/40 px-4 py-3 ring-1 ring-white/5">
         <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
         <p className="text-xl font-semibold text-white">{value}</p>
         {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </div>
   );
}
