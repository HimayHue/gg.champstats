"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Divide } from "lucide-react";
import { MatchDto, Participant } from "@/types/LeagueOfLegends";
import Image from "next/image";
import { getRuneData, getRuneIconUrl, itemIdsFromParticipant, spellIcon, spellLabel } from "@/utils/league-of-legends/mappers";
import { formatGameStartDate, formatMatchDuration, getDDragonVersion } from "@/utils/formatters";
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs));
}


const MatchMetaData = ({ isWin, gameMode, duration, endedAt, className }: { isWin: boolean; gameMode: string; duration: string; endedAt?: string; className?: string }) => (
   <div className={cn("flex flex-col items-left gap-2", className)}>
      <span>{gameMode}</span>
      <span>{endedAt}</span>
      <span>{isWin ? "Victory" : "Defeat"}</span>
      <span>{duration}</span>
   </div>
);


const SummonerLoadout = ({ championName, version, spellD, spellF, spellDLabel, spellFLabel, keystoneId, secondaryStyleId, champLevel, className }: {
   championName: string;
   version: string;
   spellD?: string;
   spellF?: string;
   spellDLabel?: string;
   spellFLabel?: string;
   keystoneId?: number;
   secondaryStyleId?: number;
   champLevel: number;
   className?: string;
}) => (
   <div className={cn("flex items-center", className)}>
      <div className="relative ">
         <ChampionIcon championName={championName} version={version} />
         <span className="absolute bottom-0 right-0 bg-black/70 text-white text-[10px] px-1 rounded-tl">
            {champLevel}
         </span>
      </div>
      <SpellsAndRunesIcons
         spellD={spellD}
         spellF={spellF}
         spellDLabel={spellDLabel}
         spellFLabel={spellFLabel}
         keystoneId={keystoneId}
         secondaryStyleId={secondaryStyleId}
      />
   </div>
);


const PerformanceSection = ({
   kills, deaths, assists, minionScore, visionScore,
   gameDuration: gameDurationInSeconds,
   className
}: {
   kills: number; deaths: number; assists: number;
   minionScore: number; visionScore: number;
   gameDuration: number;
   className?: string;
}) => (
   <div className={cn("flex flex-col items-center justify-center", className)}>
      <span className="text-lg font-bold leading-tight">{kills}/{deaths}/{assists}</span>
      <span className="text-[11px] text-muted-foreground">{((kills + assists) / Math.max(1, deaths)).toFixed(2)}:1 KDA</span>
      <span className="text-[11px] text-muted-foreground">{minionScore} cs ({((minionScore) / (gameDurationInSeconds / 60)).toFixed(1)})</span>
      <span className="text-[11px] text-muted-foreground">{visionScore} vision</span>
   </div>
);


const ExpandMatchButton = ({ expanded, onClick, className }: { expanded: boolean; onClick: () => void; className?: string }) => (
   <div className={cn("h-full flex flex-col justify-end", className)}>
      <button
         className="text-[11px] font-semibold underline-offset-2 hover:underline self-stretch border-red-500"
         onClick={onClick}
      >
         {expanded ? <ChevronDown className="h-5 w-5 rotate-180" /> : <ChevronDown className="h-5 w-5" />}
      </button>
   </div>
);

const ChampionIcon = ({ championName, version, className }: { championName: string; version: string; className?: string }) => (
   <div className={cn("h-12 w-12", className)}>
      <Image
         src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${championName}.png`}
         alt={championName}
         fill
         sizes="36px"
         className="object-cover"
      />
   </div>
);


interface SpellRuneIconsProps {
   spellD?: string;
   spellF?: string;
   spellDLabel?: string;
   spellFLabel?: string;
   keystoneId?: number;
   secondaryStyleId?: number;
   className?: string;
}
const SpellsAndRunesIcons = ({ spellD, spellF, spellDLabel, spellFLabel, keystoneId, secondaryStyleId, className }: SpellRuneIconsProps) => (
   <div className={cn("grid grid-cols-2 gap-1 content-center h-14", className)}>
      {spellD && (
         <Image src={spellD} alt={spellDLabel || "Spell D"} title={spellDLabel} width={20} height={20} className="rounded" />
      )}
      {spellF && (
         <Image src={spellF} alt={spellFLabel || "Spell F"} title={spellFLabel} width={20} height={20} className="rounded" />
      )}
      {keystoneId && (
         <Image src={getRuneIconUrl(keystoneId)} alt={`Keystone ${keystoneId}`} title={`Keystone ${keystoneId}`} width={20} height={20} className="rounded-full" />
      )}
      {secondaryStyleId && (
         <Image src={getRuneIconUrl(secondaryStyleId)} alt={`Secondary ${secondaryStyleId}`} title={`Secondary ${secondaryStyleId}`} width={20} height={20} className="rounded-full" />
      )}
   </div>
);


interface ItemGridProps {
   itemIds: number[];
   itemNames: Record<number, string>;
   version: string;
   className?: string;
}
const ItemGrid = ({ itemIds, itemNames, version, className }: ItemGridProps) => (
   <div className={cn("grid grid-cols-4 grid-rows-2 gap-[4px] w-fit", className)}>
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
   className?: string;
}
const RosterColumn = ({ title, participants, version, maxDamage, barColorClass, className }: RosterColumnProps) => (
   <div className={cn("flex flex-col gap-1", className)}>
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
                           sizes="40px"
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
                     {keystone && <Image src={getRuneIconUrl(keystone)} alt={`Rune ${keystone}`} title={`Rune ${keystone}`} width={18} height={18} className="rounded-full" />}
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


interface ParticipantListProps {
   blueSide: Participant[];
   redSide: Participant[];
   version: string;
   highlightPuuid: string;
   className?: string;
}
const ParticipantList = ({ blueSide, redSide, version, highlightPuuid, className }: ParticipantListProps) => {
   const renderChip = (p: Participant, isSelf: boolean) => (
      <div
         key={p.puuid}
         className={cn(`flex items-center gap-1  bg-black/5`, className)}
         title={p.riotIdGameName || p.summonerName}
      >
         <div className={`relative h-5 w-5 overflow-hidden rounded ${isSelf ? "ring-2 ring-blue-400/70" : "ring-1 ring-black/10"}`}>
            <Image
               src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${p.championName}.png`}
               alt={p.championName}
               fill
               className="object-cover"
               sizes="40px"
            />
         </div>
         <span className="max-w-[80px] truncate text-[10px] text-muted-foreground leading-none">{p.riotIdGameName || p.summonerName}</span>
      </div>
   );

   return (
      <div className={cn(`rounded-md border border-black/5 overflow-hidden text-[11px] w-full`, className)}>
         {/* Use grid-cols-2 to force a perfect 50/50 split */}
         <div className="grid grid-cols-2 divide-x divide-black/10">

            {/* Blue Side */}
            <div className="bg-blue-500/5 px-2 py-1 flex flex-col gap-1">
               <span className="text-[9px] font-bold uppercase text-blue-600 mb-1">Blue side</span>
               {blueSide.map((p) => renderChip(p, p.puuid === highlightPuuid))}
            </div>

            {/* Red Side */}
            <div className="grid grid-cols-2 divide-x divide-black/10">
               <span className="text-[9px] font-bold uppercase text-red-600 mb-1 text-right">Red side</span>
               {redSide.map((p) => renderChip(p, p.puuid === highlightPuuid))}
            </div>

         </div>
      </div>
   );
};


interface MatchSummaryCardProps {
   match: MatchDto;
   puuid: string;
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
   const visionScore = participant.visionScore || 0;
   const kda = `${kills} / ${deaths} / ${assists}`;
   const ratio = ((kills + assists) / Math.max(1, deaths)).toFixed(2);

   const durationSeconds = match.info.gameDuration ?? participant.timePlayed ?? 0;
   const duration = formatMatchDuration(durationSeconds);
   const endedAt = formatGameStartDate(match.info.gameStartTimestamp);

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

   const version = useMemo(() => getDDragonVersion(match.info.gameVersion), [match.info.gameVersion]);

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
      <Card className={`flex flex-col gap-2 p-3 ${statusColor} ${bgTint} transition-all hover:brightness-110`}>

         <div className="flex">
            <div className="grid grid-cols-10 gap-3 items-center [&>*]:outline [&>*]:outline-1 [&>*]:outline-red-500/40">

               <MatchMetaData
                  className="grid-cols-1"
                  isWin={isWin}
                  gameMode={gameMode}
                  duration={duration}
                  endedAt={endedAt}
               />

               <SummonerLoadout
                  className="col-span-2"
                  championName={championName}
                  version={version}
                  spellD={spellD}
                  spellF={spellF}
                  spellDLabel={spellDLabel}
                  spellFLabel={spellFLabel}
                  keystoneId={keystoneId}
                  secondaryStyleId={secondaryStyleId}
                  champLevel={participant.champLevel}
               />


               <PerformanceSection
                  kills={kills}
                  deaths={deaths}
                  assists={assists}
                  minionScore={totalCs}
                  gameDuration={durationSeconds}
                  visionScore={visionScore}
               />

               <ItemGrid
                  className="col-span-3"
                  itemIds={itemIds}
                  itemNames={itemNames}
                  version={version}
               />

               <ParticipantList
                  className="col-span-3 border"
                  blueSide={blueSide}
                  redSide={redSide}
                  version={version}
                  highlightPuuid={participant.puuid}
               />



            </div>
            <ExpandMatchButton expanded={expanded} onClick={() => setExpanded((prev) => !prev)} />
         </div>

         {
            expanded && (
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
            )
         }
      </Card >
   );
}