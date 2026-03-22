"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MatchDto } from "@/types/LeagueOfLegends";
import Image from "next/image";
import { LOL_RUNES, LolRuneId } from "@/lib/constants/league-of-legends/runes";

interface MatchSummaryCardProps {
   match: MatchDto;
   puuid: string;
}

const formatDuration = (seconds: number): string => {
   const mins = Math.floor(seconds / 60);
   const secs = Math.max(0, seconds % 60);
   return `${mins}m ${secs.toString().padStart(2, "0")}s`;
};

const formatDate = (timestamp?: number): string => {
   if (!timestamp) return "";
   const date = new Date(timestamp);
   return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

const itemIdsFromParticipant = (p: MatchDto["info"]["participants"][number]) => [
   p.item0,
   p.item1,
   p.item2,
   p.item3,
   p.item4,
   p.item5,
   p.item6,
];

const SUMMONER_SPELL_MAP: Record<number, string> = {
   1: "SummonerBoost",
   3: "SummonerExhaust",
   4: "SummonerFlash",
   6: "SummonerHaste",
   7: "SummonerHeal",
   11: "SummonerSmite",
   12: "SummonerTeleport",
   13: "SummonerMana",
   14: "SummonerDot",
   21: "SummonerBarrier",
   30: "SummonerPoroRecall",
   31: "SummonerPoroThrow",
   32: "SummonerSnowball",
};

const SUMMONER_SPELL_LABELS: Record<number, string> = {
   1: "Cleanse",
   3: "Exhaust",
   4: "Flash",
   6: "Ghost",
   7: "Heal",
   11: "Smite",
   12: "Teleport",
   13: "Clarity",
   14: "Ignite",
   21: "Barrier",
   30: "To the King!",
   31: "Poro Toss",
   32: "Snowball",
};


const getRuneIcon = (perkId?: number): string => {
   if (!perkId) return "";

   // Convert the number to a string to match the Object keys
   // and cast it to LolRuneId so TypeScript knows it's a valid key
   const rune = LOL_RUNES[perkId.toString() as LolRuneId];

   if (!rune) return "";

   const RUNE_BASE_URL = `https://ddragon.leagueoflegends.com/cdn/img/`;
   return `${RUNE_BASE_URL}${rune.icon}`;
};

const shortVersion = (gameVersion?: string) => {
   if (!gameVersion) return "14.5.1";
   const parts = gameVersion.split(".");
   return parts.length >= 2 ? `${parts[0]}.${parts[1]}.1` : gameVersion;
};

const spellIcon = (spellId?: number, version?: string) => {
   if (!spellId) return "";
   const key = SUMMONER_SPELL_MAP[spellId];
   if (!key) return "";
   const v = version || "14.5.1";
   return `https://ddragon.leagueoflegends.com/cdn/${v}/img/spell/${key}.png`;
};

const spellLabel = (spellId?: number) => {
   if (!spellId) return "";
   return SUMMONER_SPELL_LABELS[spellId] || `Spell ${spellId}`;
};

type Participant = MatchDto["info"]["participants"][number];

interface SpellRuneIconsProps {
   spellD?: string;
   spellF?: string;
   spellDLabel?: string;
   spellFLabel?: string;
   keystoneId?: number;
   secondaryStyleId?: number;
}

const SpellsAndRunesIcons = ({ spellD, spellF, spellDLabel, spellFLabel, keystoneId, secondaryStyleId }: SpellRuneIconsProps) => (
   <div className="flex items-center gap-1 mt-1">
      {spellD && (
         <Image src={spellD} alt={spellDLabel || "Spell D"} title={spellDLabel} width={20} height={20} className="rounded" />
      )}
      {spellF && (
         <Image src={spellF} alt={spellFLabel || "Spell F"} title={spellFLabel} width={20} height={20} className="rounded" />
      )}
      {keystoneId && (
         <Image src={getRuneIcon(keystoneId)} alt={`Keystone ${keystoneId}`} title={`Keystone ${keystoneId}`} width={20} height={20} className="rounded-full" />
      )}
      {secondaryStyleId && (
         <Image src={getRuneIcon(secondaryStyleId)} alt={`Secondary ${secondaryStyleId}`} title={`Secondary ${secondaryStyleId}`} width={20} height={20} className="rounded-full" />
      )}
   </div>
);

interface ItemGridProps {
   itemIds: number[];
   itemNames: Record<number, string>;
   version: string;
}

const ItemGrid = ({ itemIds, itemNames, version }: ItemGridProps) => (
   <div className="grid grid-cols-4 gap-1 justify-end">
      {itemIds.map((id, idx) => (
         <div
            key={`${id}-${idx}`}
            className="h-8 w-8 rounded-[6px] overflow-hidden bg-black/10 ring-1 ring-black/10"
            title={id > 0 ? (itemNames[id] || `Item ${id}`) : "Empty slot"}
         >
            {id > 0 ? (
               <Image
                  src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${id}.png`}
                  alt={itemNames[id] || `Item ${id}`}
                  width={32}
                  height={32}
                  className="object-cover"
               />
            ) : null}
         </div>
      ))}
   </div>
);

interface RosterColumnProps {
   title: string;
   participants: Participant[];
   version: string;
   maxDamage: number;
   barColorClass: string;
}

const RosterColumn = ({ title, participants, version, maxDamage, barColorClass }: RosterColumnProps) => (
   <div className="flex flex-col gap-1">
      <span className="text-[11px] font-semibold uppercase text-muted-foreground">{title}</span>
      <div className="flex flex-col gap-1">
         {participants.map((p) => {
            const keystone = p.perks?.styles?.[0]?.selections?.[0]?.perk;
            const spellD = spellIcon(p.summoner1Id, version);
            const spellF = spellIcon(p.summoner2Id, version);
            const spellDLabel = spellLabel(p.summoner1Id);
            const spellFLabel = spellLabel(p.summoner2Id);
            const dmg = p.totalDamageDealtToChampions || 0;
            const width = `${Math.round((dmg / maxDamage) * 100)}%`;

            return (
               <div key={p.puuid} className="flex flex-col gap-1 px-2 py-2 rounded-md bg-black/5 text-[11px]">
                  <div className="flex items-center gap-2">
                     <div className="relative h-6 w-6 overflow-hidden rounded ring-1 ring-black/10">
                        <Image
                           src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${p.championName}.png`}
                           alt={p.championName}
                           fill
                           className="object-cover"
                        />
                     </div>
                     <span className="font-semibold leading-none">{p.championName}</span>
                     <span className="text-muted-foreground text-[10px] leading-none">{p.riotIdGameName || p.summonerName}</span>
                     <span className="text-muted-foreground text-[10px] leading-none ml-auto">{p.kills}/{p.deaths}/{p.assists}</span>
                  </div>
                  <div className="flex items-center gap-2">
                     {spellD && <Image src={spellD} alt={spellDLabel} title={spellDLabel} width={18} height={18} className="rounded" />}
                     {spellF && <Image src={spellF} alt={spellFLabel} title={spellFLabel} width={18} height={18} className="rounded" />}
                     {/* TODO get the rune itself */}
                     {keystone && <Image src={getRuneIcon(keystone)} alt={`Rune ${keystone}`} title={`Rune ${keystone}`} width={18} height={18} className="rounded-full" />}
                     <div className="flex-1 h-2 bg-black/10 rounded overflow-hidden">
                        <div className={`h-full ${barColorClass}`} style={{ width }} />
                     </div>
                     <span className="text-[10px] text-muted-foreground whitespace-nowrap">{dmg.toLocaleString()}</span>
                  </div>
               </div>
            );
         })}
      </div>
   </div>
);

interface CompactLobbyProps {
   blueSide: Participant[];
   redSide: Participant[];
   version: string;
   highlightPuuid: string;
}

const CompactLobby = ({ blueSide, redSide, version, highlightPuuid }: CompactLobbyProps) => {
   const renderChip = (p: Participant, isSelf: boolean) => (
      <div
         key={p.puuid}
         className={`flex items-center gap-1 px-1 py-[2px] rounded bg-black/5 ${isSelf ? "ring-1 ring-blue-400/70" : ""}`}
         title={p.riotIdGameName || p.summonerName}
      >
         <div className={`relative h-5 w-5 overflow-hidden rounded ${isSelf ? "ring-2 ring-blue-400/70" : "ring-1 ring-black/10"}`}>
            <Image
               src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${p.championName}.png`}
               alt={p.championName}
               fill
               className="object-cover"
            />
         </div>
         <span className="max-w-[80px] truncate text-[10px] text-muted-foreground leading-none">{p.riotIdGameName || p.summonerName}</span>
      </div>
   );

   return (
      <div className="rounded-md border border-black/5 overflow-hidden text-[11px]">
         <div className="flex">
            <div className="flex-1 bg-blue-500/5 px-2 py-1 flex items-center gap-2 flex-wrap">
               <span className="text-[10px] font-semibold uppercase text-blue-600">Blue side</span>
               {blueSide.map((p) => renderChip(p, p.puuid === highlightPuuid))}
            </div>
            <div className="w-px bg-black/10" />
            <div className="flex-1 bg-red-500/5 px-2 py-1 flex items-center gap-2 flex-wrap justify-end">
               {redSide.map((p) => renderChip(p, p.puuid === highlightPuuid))}
               <span className="text-[10px] font-semibold uppercase text-red-600">Red side</span>
            </div>
         </div>
      </div>
   );
};

export function MatchSummaryCard({ match, puuid }: MatchSummaryCardProps) {
   const [expanded, setExpanded] = useState(false);
   const [itemNames, setItemNames] = useState<Record<number, string>>({});
   const participant = match.info.participants.find((p) => p.puuid === puuid) || match.info.participants[0];

   if (!participant) return null;

   const isWin = Boolean(participant.win);
   const championName = participant.championName;
   const kills = participant.kills;
   const deaths = participant.deaths;
   const assists = participant.assists;
   const kda = `${kills} / ${deaths} / ${assists}`;
   const ratio = ((kills + assists) / Math.max(1, deaths)).toFixed(2);

   const durationSeconds = match.info.gameDuration ?? participant.timePlayed ?? 0;
   const duration = formatDuration(durationSeconds);
   const endedAt = formatDate(match.info.gameEndTimestamp);

   const totalCs = participant.totalMinionsKilled + participant.neutralMinionsKilled;
   const csPerMin = durationSeconds > 0 ? (totalCs / (durationSeconds / 60)).toFixed(1) : "0";

   const gameMode = match.info.gameMode || (match.info.queueId ? `Queue ${match.info.queueId}` : "Unknown mode");

   const teamKills = match.info.participants
      .filter((p) => p.teamId === participant.teamId)
      .reduce((sum, p) => sum + p.kills, 0);
   const kp = ((kills + assists) / Math.max(1, teamKills)).toFixed(2);

   const teammates = match.info.participants.filter((p) => p.teamId === participant.teamId);
   const opponents = match.info.participants.filter((p) => p.teamId !== participant.teamId);
   const blueSide = match.info.participants.filter((p) => p.teamId === 100);
   const redSide = match.info.participants.filter((p) => p.teamId === 200);

   const statusColor = isWin ? "bg-blue-500/10 border-blue-500/50" : "bg-red-500/10 border-red-500/50";
   const accentColor = isWin ? "text-blue-600" : "text-red-600";
   const bgTint = isWin ? "bg-blue-500/5" : "bg-red-500/5";

   // Items in the same order u.gg shows (6 slots + ward)
   const itemIds = itemIdsFromParticipant(participant);

   const version = useMemo(() => shortVersion(match.info.gameVersion), [match.info.gameVersion]);

   const keystoneId = participant.perks?.styles?.[0]?.selections?.[0]?.perk;
   const secondaryStyleId = participant.perks?.styles?.[1]?.style;

   const spellD = spellIcon(participant.summoner1Id, version);
   const spellF = spellIcon(participant.summoner2Id, version);
   const spellDLabel = spellLabel(participant.summoner1Id);
   const spellFLabel = spellLabel(participant.summoner2Id);

   // Load item names for tooltips using DDragon per-version item dataset
   useEffect(() => {
      let isMounted = true;
      const load = async () => {
         try {
            const res = await fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/item.json`);
            if (!res.ok) return;
            const json = await res.json();
            const data = json?.data as Record<string, { name: string }>;
            if (!data) return;
            const mapped: Record<number, string> = {};
            Object.entries(data).forEach(([id, item]) => {
               const numId = Number(id);
               if (!Number.isNaN(numId)) mapped[numId] = item.name;
            });
            if (isMounted) setItemNames(mapped);
         }
         catch (err) {
            console.error("Failed to load item data", err);
         }
      };
      load();
      return () => { isMounted = false; };
   }, [version]);

   const allyMaxDamage = useMemo(
      () => Math.max(...teammates.map((p) => p.totalDamageDealtToChampions || 0), 1),
      [teammates]
   );
   const enemyMaxDamage = useMemo(
      () => Math.max(...opponents.map((p) => p.totalDamageDealtToChampions || 0), 1),
      [opponents]
   );

   return (
      <Card className={`flex flex-col gap-2 p-3 border ${statusColor} ${bgTint} transition-all hover:brightness-110`}>
         <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <div className="flex items-center gap-2">
               <span className={`font-semibold uppercase ${accentColor}`}>{isWin ? "Victory" : "Defeat"}</span>
               <span>• {gameMode}</span>
               <span>• {duration}</span>
               {endedAt && <span>• {endedAt}</span>}
            </div>
            <div className="flex items-center gap-2">
               <Badge variant="secondary" className="h-5 px-2 text-[10px]">Match #{match.metadata?.matchId ?? "?"}</Badge>
               <button
                  className="text-[11px] font-semibold underline-offset-2 hover:underline"
                  onClick={() => setExpanded((prev) => !prev)}
               >
                  {expanded ? "Hide details" : "Show details"}
               </button>
            </div>
         </div>

         <div className="grid grid-cols-7 gap-3 items-center border">
            {/* Champion + level */}
            <div className="flex items-center gap-3 min-w-[170px]">
               <div className="relative h-14 w-14 overflow-hidden rounded-xl ring-2 ring-black/10">
                  <Image
                     src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${championName}.png`}
                     alt={championName}
                     fill
                     className="object-cover"
                  />
                  <span className="absolute bottom-0 right-0 bg-black/70 text-white text-[10px] px-1 rounded-tl">
                     {participant.champLevel}
                  </span>
               </div>
               <div className="flex flex-col">
                  <span className="text-sm font-semibold">{championName}</span>
                  <span className="text-[11px] text-muted-foreground">K/D/A {kda}</span>
                  <span className="text-[11px] text-muted-foreground">KP {kp}</span>
                  <SpellsAndRunesIcons
                     spellD={spellD}
                     spellF={spellF}
                     spellDLabel={spellDLabel}
                     spellFLabel={spellFLabel}
                     keystoneId={keystoneId}
                     secondaryStyleId={secondaryStyleId}
                  />
               </div>
            </div>

            {/* KDA block */}
            <div className="flex flex-col items-center justify-center">
               <span className="text-lg font-bold leading-tight">{kda}</span>
               <span className="text-[11px] text-muted-foreground">{ratio}:1 KDA</span>
            </div>

            {/* CS & vision-like */}
            <div className="flex flex-col items-center justify-center px-2">
               <span className="text-sm font-semibold">CS {totalCs}</span>
               <span className="text-[11px] text-muted-foreground">{csPerMin}/m</span>
            </div>

            <div className="col-span-2">
               <CompactLobby
                  blueSide={blueSide}
                  redSide={redSide}
                  version={version}
                  highlightPuuid={participant.puuid}
               />
            </div>

            {/* Items row */}
            <div className="col-span-2">
               <ItemGrid itemIds={itemIds} itemNames={itemNames} version={version} />
            </div>


         </div>
         {expanded && (
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-black/5">
               <RosterColumn
                  title="Allies"
                  participants={teammates}
                  version={version}
                  maxDamage={allyMaxDamage}
                  barColorClass="bg-blue-500/60"
               />
               <RosterColumn
                  title="Opponents"
                  participants={opponents}
                  version={version}
                  maxDamage={enemyMaxDamage}
                  barColorClass="bg-red-500/60"
               />
            </div>
         )}
      </Card>
   );
}