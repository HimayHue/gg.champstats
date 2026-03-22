import { LOL_RUNES, LolRuneId } from "@/lib/constants/league-of-legends/runes";
import { SUMMONER_SPELL_LABELS, SUMMONER_SPELL_MAP } from "@/lib/constants/league-of-legends/summoner-spells";
import { MatchDto } from "@/types/LeagueOfLegends";
// import { LOL_CHAMPIONS } from "@/lib/constants/league-of-legends/champions";

const DDRAGON_BASE = "https://ddragon.leagueoflegends.com/cdn/img";

/**
 * Returns full rune data for a given ID
 */
export const getRuneData = (id: number) => {
   return LOL_RUNES[id.toString() as LolRuneId] || null;
};


/**
 * Returns the CDN URL for a rune icon
 */
export const getRuneIconUrl = (id: number) => {
   const rune = getRuneData(id);
   return rune ? `${DDRAGON_BASE}/${rune.icon}` : "/images/runePlaceholder.png";
};


export const itemIdsFromParticipant = (p: MatchDto["info"]["participants"][number]) => [
   p.item0,
   p.item1,
   p.item2,
   p.item3,
   p.item4,
   p.item5,
   p.item6,
]


export const spellIcon = (spellId?: number, version?: string) => {
   if (!spellId) return "";
   const key = SUMMONER_SPELL_MAP[spellId];
   if (!key) return "";
   const v = version || "14.5.1";
   return `https://ddragon.leagueoflegends.com/cdn/${v}/img/spell/${key}.png`;
};

export const spellLabel = (spellId?: number) => {
   if (!spellId) return "";
   return SUMMONER_SPELL_LABELS[spellId] || `Spell ${spellId}`;
};
/**
 * Returns champion name by ID
 */
// export const getChampionName = (id: number) => {
//   return LOL_CHAMPIONS[id.toString()]?.name ?? "Unknown Champion";
// };