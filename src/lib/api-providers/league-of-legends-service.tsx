import { MatchDto, SummonerDTO, SummonerSpells } from "@/types/LeagueOfLegends";

const apiKey = process.env.RIOT_API_KEY;

/**
 * Helper function to perform fetch requests to the Riot API with proper error handling and API key management.
 * @param url - The endpoint URL to fetch data from.
 * @returns A promise that resolves to the parsed JSON response from the Riot API.
 */
async function riotFetch<T>(url: string): Promise<T> {
   if (!apiKey) throw new Error("Missing RIOT_API_KEY");

   const response = await fetch(url, {
      headers: { "X-Riot-Token": apiKey },
   });

   if (!response.ok) {
      throw new Error(`Riot API Error: ${response.status} at ${url}`);
   }

   return response.json();
}

export const getSummonerProfile = (puuid: string) =>
   riotFetch<SummonerDTO>(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`);

export const getMatchIds = (puuid: string, count: number = 20) =>
   riotFetch<string[]>(`https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?count=${count}`);

export const getMatchDetails = (matchId: string) =>
   riotFetch<MatchDto>(`https://americas.api.riotgames.com/lol/match/v5/matches/${matchId}`);


export async function getSummonerSpells(gameVersion: string): Promise<SummonerSpells> {
   // format the version number to only include the first two numbers 
   let version = gameVersion.split('.').slice(0, 2).join('.');
   console.log(`fetchSummmoerSpellsData: Fetching spells for version: ${version}`)

   const response = await fetch(`https://americas.api.riotgames.com/summoner/v1/spells?Version=${version}`);
   const fetchedData = await response.json();

   // console.log('fetchSummonerSpellsData: fetchedData:', JSON.stringify(fetchedData));
   return fetchedData.data;
}


export async function getRunes(gameVersion: string): Promise<any> {
   // format the version number to only include the first two numbers 
   let version = gameVersion.split('.').slice(0, 2).join('.');
   console.log(`fetchRunesData: Fetching runes for version: ${version}`)

   const response = await fetch(`https://americas.api.riotgames.com/runes/v1/runes?Version=${version}`);
   const fetchedData = await response.json();

   // console.log('fetchRunesData: fetchedData:', JSON.stringify(fetchedData));
   return fetchedData.data;
}