import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MatchHistoryColumn, SummonerProfileBanner, MostPlayedChampionsColumn, MatchHistoryPerformanceCard } from "./_components/profile-summary";
import AdTemplate from "@/components/ads/ads";

import { getAccountByRiotId } from "@/lib/api-providers/riot-service";
import { getMatchDetails, getMatchIds, getSummonerProfile } from "@/lib/api-providers/league-of-legends-service";

import { toTitleCase, formatMatchDuration } from "@/utils/formatters";
import { Metadata } from "next";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
   const { summoner } = await params;

   // Mirror the logic you have in your Page component
   const [rawRiotName, rawRiotTag] = summoner.split("-");
   const riotName = toTitleCase(decodeURIComponent(rawRiotName));
   const riotTag = rawRiotTag.toUpperCase();

   return {
      title: `${riotName} #${riotTag} - Summoner Stats - League of Legends`,
      description: `Check ${riotName}#${riotTag}'s real-time LoL stats, match history, and most played champions on ChampStats.`,
   };
}
interface PageProps {
   params: Promise<{
      region: string;
      summoner: string;
   }>;
}


export default async function Page({ params }: PageProps) {
   const { region, summoner } = await params;

   const [rawRiotName, rawRiotTag] = summoner.split("-");
   const riotName = toTitleCase(decodeURIComponent(rawRiotName));
   const riotTag = rawRiotTag.toUpperCase();


   // TODO: Implement loading more than 20 matches in the future. For now, we will limit to 20 due to Riot API rate limits and performance concerns.
   const matchIDsToFetch = 20;
   const matchesToDisplay = 10;
   const TOP_CHAMPS_DISPLAY_LIMIT = 3;


   // Fetch PUUID using the Riot ID (gameName and tagLine)
   const accountData = await getAccountByRiotId(rawRiotName, rawRiotTag).catch((error) => {
      console.error("Account Fetch Error:", error);
      return null;
   });
   if (!accountData?.puuid) {
      return (
         <main className="min-h-screen bg-slate-950 text-slate-50">
            <div className="mx-auto max-w-4xl px-4 py-10">
               <Card className="border border-red-500/30 bg-red-500/5">
                  <CardHeader>
                     <CardTitle className="text-xl font-semibold text-red-200">Player not found</CardTitle>
                     <CardDescription className="text-red-100">Check the summoner name and tag line, then try again.</CardDescription>
                  </CardHeader>
               </Card>
            </div>
         </main>
      );
   }

   // Fetch summoner profile data using the PUUID
   const summonerProfileData = await getSummonerProfile(accountData.puuid).catch((error) => {
      console.error("fetchSummonerProfileByPUUID", error);
      return null;
   });

   // Fetch match history ID's using the player's PUUID
   const matchHistoryIDs = await getMatchIds(accountData.puuid, matchesToDisplay);
   if (matchHistoryIDs.length === 0) {
      return (
         <main className="min-h-screen bg-slate-950 text-slate-50">
            <div className="mx-auto max-w-4xl px-4 py-10 space-y-4">
               <Card className="border border-amber-500/30 bg-amber-500/5">
                  <CardHeader>
                     <CardTitle className="text-xl font-semibold text-amber-100">No match history yet</CardTitle>
                     <CardDescription className="text-amber-100">We could not find any recent games for {riotName}#{riotTag}.</CardDescription>
                  </CardHeader>
               </Card>
            </div>
         </main>
      );
   }


   // Fetch match data for each match history ID
   const matchHistoryData = await Promise.all(
      matchHistoryIDs.map((id) => getMatchDetails(id))
   );
   if (matchHistoryData.length === 0) {
      return (
         <main className="min-h-screen bg-slate-950 text-slate-50">
            <div className="mx-auto max-w-4xl px-4 py-10 space-y-4">
               <Card className="border border-amber-500/30 bg-amber-500/5">
                  <CardHeader>
                     <CardTitle className="text-xl font-semibold text-amber-100">No match history yet</CardTitle>
                     <CardDescription className="text-amber-100">We could not find any recent games for {riotName}#{riotTag}.</CardDescription>
                  </CardHeader>
               </Card>
            </div>
         </main>
      );
   }


   // Aggregate player stats across all fetched matches
   const playerTotals = matchHistoryData.reduce((accumulator, match) => {
      try {
         const player = match.info.participants.find((p) => p.puuid === accountData.puuid);
         if (!player) return accumulator;
         accumulator.kills += player.kills;
         accumulator.deaths += player.deaths;
         accumulator.assists += player.assists;
         accumulator.cs += player.totalMinionsKilled + player.neutralMinionsKilled;
         accumulator.timePlayed += player.timePlayed ?? 0;
         accumulator.wins += player.win ? 1 : 0;
         return accumulator;
      }
      catch (error) {
         console.error("Error processing match data:", error);
         return accumulator;
      }


   }, { kills: 0, deaths: 0, assists: 0, cs: 0, timePlayed: 0, wins: 0 });

   // Calculate aggregate stats
   const gamesPlayed = matchHistoryData.length;
   const winRate = gamesPlayed ? Math.round((playerTotals.wins / gamesPlayed) * 100) : 0;
   const avgKda = gamesPlayed ? ((playerTotals.kills + playerTotals.assists) / Math.max(1, playerTotals.deaths)).toFixed(2) : "0.00";
   const avgCsPerMin = gamesPlayed ? (playerTotals.cs / Math.max(1, playerTotals.timePlayed / 60)).toFixed(1) : "0.0";
   const avgDuration = gamesPlayed ? formatMatchDuration(playerTotals.timePlayed / gamesPlayed) : "0m 00s";
   const avgGoldPerMin = gamesPlayed ? ((playerTotals.kills * 300 + playerTotals.assists * 150) / Math.max(1, playerTotals.timePlayed / 60)).toFixed(1) : "0.0";

   const mostPlayedChampions = Array.from(
      matchHistoryData.reduce((map, match) => {
         const player = match.info.participants.find((p) => p.puuid === accountData.puuid);
         if (!player) return map;

         const entry = map.get(player.championName) || { games: 0, wins: 0 };
         entry.games += 1;
         entry.wins += player.win ? 1 : 0;
         map.set(player.championName, entry);
         return map;
      }, new Map<string, { games: number; wins: number }>())
   ).map(([champion, record]) => ({
      champion,
      games: record.games,
      winRate: Math.round((record.wins / record.games) * 100),
   })).sort((a, b) => b.games - a.games).slice(0, TOP_CHAMPS_DISPLAY_LIMIT);




   return (
      <main className="min-h-screen bg-slate-950 text-slate-50 border">
         <div className="mx-auto grid w-full xl:max-w-[80%] border grid-cols-1 gap-3 px-4 py-10 lg:grid-cols-5">
            <AdTemplate />


            <div className="grid grid-cols-3 gap-3 lg:col-span-3">
               {/* Above spanning across */}
               <div className="col-span-3">
                  {summonerProfileData && (<SummonerProfileBanner summonerProfileData={summonerProfileData} accountData={accountData} mostPlayedCHampion={mostPlayedChampions[0].champion} />)}
               </div>



               <div className="flex flex-col col-span-1 gap-y-3">
                  <MostPlayedChampionsColumn mostPlayedChampions={mostPlayedChampions} />
               </div>

               <div className="flex flex-col col-span-2 gap-y-3">
                  <MatchHistoryPerformanceCard
                     riotName={riotName}
                     riotTag={riotTag}
                     gamesPlayed={gamesPlayed}
                     winRate={winRate}
                     avgKda={avgKda}
                     avgCsPerMin={avgCsPerMin}
                     avgDuration={avgDuration}
                     playerTotals={playerTotals}
                     recentGamesCount={matchHistoryData.length}
                  />
                  <MatchHistoryColumn matchHistoryData={matchHistoryData} accountData={accountData} />
               </div>
            </div>


            <AdTemplate />
         </div>
      </main>
   );
}
