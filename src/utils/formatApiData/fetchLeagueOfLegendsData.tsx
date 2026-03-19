import { AccountInformation, MatchDto, SummonerDTO, SummonerSpell, SummonerSpells } from "@/types/LeagueOfLegends";
import { count } from "console";

// const LeagueAPIRoute = `https://americas.api.riotgames.com`
const apiKey = process.env.RIOT_API_KEY;


/**
 * Fetches account details (PUUID, gameName, and tagLine) from the Riot Games API
 * using a player's Riot ID.
 * @example
 * const account = await fetchAccountByRiotID('Radec Himay', 'NA1');
 * @param {string} riotName - The player's in-game name (e.g., "Radec Himay").
 * @param {string} riotTag - The player's tag line without the '#' (e.g., "NA1").
 * @returns {Promise<AccountInformation>} An object containing the player's PUUID and verified ID.
 * @throws {Error} If the RIOT_API_KEY is missing from environment variables.
 * @throws {Error} If the player is not found (404).
 * @throws {Error} If the API rate limit is exceeded (429).
 * @throws {Error} For any other non-OK response from the Riot API.
 */
export async function fetchAccountByRiotID(
   riotName: string,
   riotTag: string
): Promise<AccountInformation> {

   if (!apiKey) throw new Error("RIOT_API_KEY is not defined in environment variables.");

   // TODO: Implement region swapping in the future. For now, we will default to the Americas endpoint for all requests.
   const url = `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${riotName}/${riotTag}`;
   const response = await fetch(url, {
      headers: {
         "X-Riot-Token": apiKey,
      },
   });

   if (!response.ok) {
      if (response.status === 404) throw new Error(`Player ${riotName}#${riotTag} not found.`);
      if (response.status === 429) throw new Error("Rate limit exceeded. Please try again later.");
      throw new Error(`Riot API responded with status: ${response.status}`);
   }

   const accountData: AccountInformation = await response.json();
   return accountData;
}

/**
 * Fetches the summoner profile data for a player using their PUUID.
 * @param puuid The player's PUUID.
 * @returns {Promise<SummonerDTO>} A promise resolving to the summoner profile data.
 */
export async function fetchSummonerProfileByPUUID(puuid: string): Promise<SummonerDTO> {
   if (!apiKey) throw new Error("RIOT_API_KEY is not defined in environment variables.");

   const url = `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`;

   const response = await fetch(url, {
      headers: {
         "X-Riot-Token": apiKey,
      },
   });

   if (!response.ok) {
      // if (response.status === 404) throw new Error(`Player ${puuid} not found.`);
      // if (response.status === 429) throw new Error("Rate limit exceeded. Please try again later.");
      throw new Error(`Riot API responded with status: ${response.status}: ${response.statusText}`);
   }

   const summonerData: SummonerDTO = await response.json();
   return summonerData;
}
/**
 * Fetches the IDs of recent matches for a player using their PUUID.
 * @param puuid The player's PUUID.
 * @param count The number of recent matches to fetch.
 * @returns A promise resolving to an array of match IDs.
 */
export async function fetchMatchIDsByPUUID(
   puuid: string,
   count: number = 20
): Promise<string[]> {
   if (!apiKey) throw new Error("RIOT_API_KEY is not defined in environment variables.");

   const url = `https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?count=${count}`;

   const response = await fetch(url, {
      headers: {
         "X-Riot-Token": apiKey,
      },
   });

   if (!response.ok) {
      if (response.status === 404) throw new Error(`No matches found for PUUID: ${puuid}`);
      if (response.status === 429) throw new Error("Rate limit exceeded. Please try again later.");
      throw new Error(`Riot API responded with status: ${response.status}`);
   }

   const matchHistoryIDs: string[] = await response.json();
   return matchHistoryIDs;
}

/**
 * Fetches the data for a specific match using its ID.
 * @param matchId The ID of the match to fetch.
 * @returns A promise resolving to the match data.
 */
export async function fetchMatchDataByMatchID(matchId: string): Promise<MatchDto> {
   if (!apiKey) throw new Error("RIOT_API_KEY is not defined in environment variables.");

   const response = await fetch(`https://americas.api.riotgames.com/lol/match/v5/matches/${matchId}`, {
      headers: {
         "X-Riot-Token": apiKey,
      },
   });

   if (response.status === 404) {
      const errorData = await response.json();
      throw new Error(`Invalid match ID: ${errorData.error}`);
   }

   const matchData = await response.json();
   return matchData;
}

export async function fetchSummonerSpellsData(gameVersion: string): Promise<SummonerSpells> {
   // format the version number to only include the first two numbers 
   let version = gameVersion.split('.').slice(0, 2).join('.');
   console.log(`fetchSummmoerSpellsData: Fetching spells for version: ${version}`)

   const response = await fetch(`https://americas.api.riotgames.com/summoner/v1/spells?Version=${version}`);
   const fetchedData = await response.json();

   // console.log('fetchSummonerSpellsData: fetchedData:', JSON.stringify(fetchedData));
   return fetchedData.data;
}

export async function fetchRunesData(gameVersion: string): Promise<any> {
   // format the version number to only include the first two numbers 
   let version = gameVersion.split('.').slice(0, 2).join('.');
   console.log(`fetchRunesData: Fetching runes for version: ${version}`)

   const response = await fetch(`https://americas.api.riotgames.com/runes/v1/runes?Version=${version}`);
   const fetchedData = await response.json();

   // console.log('fetchRunesData: fetchedData:', JSON.stringify(fetchedData));
   return fetchedData.data;
}