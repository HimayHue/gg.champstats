import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MatchSummaryCard } from "@/components/match-history";
import { MatchDto } from "@/types/LeagueOfLegends";
import { toTitleCase } from "@/utils/format";
import { fetchAccountByRiotID, fetchMatchByMatchID, fetchMatchIdsByPUUID } from "@/utils/formatApiData/fetchLeagueOfLegendsData";

interface PageProps {
   params: Promise<{
      region: string;
      summoner: string;
   }>;
}

const formatDuration = (seconds: number) => {
   const mins = Math.floor(seconds / 60);
   const secs = Math.max(0, Math.round(seconds % 60));
   return `${mins}m ${secs.toString().padStart(2, "0")}s`;
};

const shortVersion = (gameVersion?: string) => {
   if (!gameVersion) return "14.5.1";
   const parts = gameVersion.split(".");
   return parts.length >= 2 ? `${parts[0]}.${parts[1]}.1` : gameVersion;
};

export default async function Page({ params }: PageProps) {
   const { region, summoner } = await params;

   const [rawRiotName, rawRiotTag] = summoner.split("-");
   const riotName = toTitleCase(decodeURIComponent(rawRiotName));
   const riotTag = rawRiotTag.toUpperCase();

   const matchesToDisplay = 10;

   const account = await fetchAccountByRiotID(rawRiotName, rawRiotTag).catch((error) => {
      console.error("Account Fetch Error:", error);
      return null;
   });

   if (!account?.puuid) {
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

   const matchHistoryIDs = await fetchMatchIdsByPUUID(account.puuid, matchesToDisplay);
   const matchHistoryData = await Promise.all(
      matchHistoryIDs.map((id) => fetchMatchByMatchID(id))
   );

   const matches = matchHistoryData.filter(Boolean) as MatchDto[];

   if (matches.length === 0) {
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

   const playerMatches = matches
      .map((match) => match.info.participants.find((p) => p.puuid === account.puuid))
      .filter(Boolean);

   if (matches.length === 0 || playerMatches.length === 0) {
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

   const totals = playerMatches.reduce(
      (acc, p) => {
         acc.kills += p.kills;
         acc.deaths += p.deaths;
         acc.assists += p.assists;
         acc.cs += p.totalMinionsKilled + p.neutralMinionsKilled;
         acc.duration += p.timePlayed ?? 0;
         acc.wins += p.win ? 1 : 0;
         return acc;
      },
      { kills: 0, deaths: 0, assists: 0, cs: 0, duration: 0, wins: 0 }
   );

   const games = playerMatches.length;
   const winRate = games ? Math.round((totals.wins / games) * 100) : 0;
   const avgKda = games ? ((totals.kills + totals.assists) / Math.max(1, totals.deaths)).toFixed(2) : "0.00";
   const avgCsPerMin = games ? (totals.cs / Math.max(1, totals.duration / 60)).toFixed(1) : "0.0";
   const avgDuration = games ? formatDuration(totals.duration / games) : "0m 00s";

   const topChampions = Array.from(
      playerMatches.reduce((map, p) => {
         const entry = map.get(p.championName) || { games: 0, wins: 0 };
         entry.games += 1;
         entry.wins += p.win ? 1 : 0;
         map.set(p.championName, entry);
         return map;
      }, new Map<string, { games: number; wins: number }>())
   )
      .map(([champion, record]) => ({
         champion,
         games: record.games,
         winRate: Math.round((record.wins / record.games) * 100),
      }))
      .sort((a, b) => b.games - a.games)
      .slice(0, 3);

   const recentForm = playerMatches
      .slice(0, 5)
      .map((p) => (p.win ? "W" : "L"));

   const version = shortVersion(matches[0]?.info.gameVersion);

   return (
      <main className="min-h-screen bg-slate-950 text-slate-50">
         <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10">
            <Card className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 ring-foreground/5">
               <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-1">
                     <CardTitle className="text-2xl font-bold text-white">
                        {riotName}
                        <span className="text-slate-400">#{riotTag}</span>
                     </CardTitle>
                     <CardDescription className="text-slate-200">
                        Region {region.toUpperCase()} • PUUID {account.puuid}
                     </CardDescription>
                     <div className="flex flex-wrap gap-2 pt-1">
                        <Badge variant="secondary">{games} games</Badge>
                        <Badge variant="secondary">{winRate}% win rate</Badge>
                        <Badge variant="secondary">Recent: {recentForm.join(" ") || "—"}</Badge>
                     </div>
                  </div>
                  <div className="flex items-center gap-2">
                     <Button size="sm" variant="secondary" disabled>
                        Refresh
                     </Button>
                     <Button size="sm" variant="outline" disabled>
                        Share
                     </Button>
                  </div>
               </CardHeader>
               <CardContent className="grid gap-3 md:grid-cols-4">
                  <StatTile label="Win rate" value={`${winRate}%`} hint={`${totals.wins}W / ${games - totals.wins}L`} />
                  <StatTile label="Average KDA" value={`${avgKda}:1`} hint={`${totals.kills}/${totals.deaths}/${totals.assists}`} />
                  <StatTile label="CS per min" value={avgCsPerMin} hint={`${totals.cs} total CS`} />
                  <StatTile label="Avg game length" value={avgDuration} hint={`${matches.length} recent games`} />
               </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-3">
               <Card className="md:col-span-2">
                  <CardHeader className="flex flex-row items-center justify-between">
                     <div>
                        <CardTitle>Top champions</CardTitle>
                        <CardDescription>Your most played picks over the last {games} games.</CardDescription>
                     </div>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-3">
                     {topChampions.length === 0 && <p className="text-sm text-muted-foreground">No champion data yet.</p>}
                     {topChampions.map((c) => (
                        <div key={c.champion} className="flex items-center justify-between rounded-xl bg-slate-900/40 px-4 py-3 ring-1 ring-white/5">
                           <div className="flex items-center gap-3">
                              <div className="h-9 w-9 overflow-hidden rounded-full ring-1 ring-white/10">
                                 <img
                                    src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${c.champion}.png`}
                                    alt={c.champion}
                                    className="h-full w-full object-cover"
                                 />
                              </div>
                              <div>
                                 <p className="text-sm font-semibold text-white">{c.champion}</p>
                                 <p className="text-xs text-muted-foreground">{c.games} games</p>
                              </div>
                           </div>
                           <Badge variant="secondary">{c.winRate}% WR</Badge>
                        </div>
                     ))}
                  </CardContent>
               </Card>

               <Card>
                  <CardHeader>
                     <CardTitle>Profile</CardTitle>
                     <CardDescription>Riot account quick facts</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                     <div className="flex justify-between">
                        <span>Region</span>
                        <span className="text-white">{region.toUpperCase()}</span>
                     </div>
                     <div className="flex justify-between">
                        <span>PUUID</span>
                        <span className="text-white truncate max-w-[180px] text-right">{account.puuid}</span>
                     </div>
                     <div className="flex justify-between">
                        <span>Games analyzed</span>
                        <span className="text-white">{games}</span>
                     </div>
                  </CardContent>
               </Card>
            </div>

            <Card>
               <CardHeader>
                  <CardTitle className="text-xl font-semibold">Recent matches</CardTitle>
                  <CardDescription>Last {matches.length} games pulled from Riot.</CardDescription>
               </CardHeader>
               <CardContent className="space-y-3">
                  {matches.map((match, index) => (
                     <MatchSummaryCard key={match.metadata.matchId ?? index} match={match} puuid={account.puuid} />
                  ))}
               </CardContent>
            </Card>
         </div>
      </main>
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