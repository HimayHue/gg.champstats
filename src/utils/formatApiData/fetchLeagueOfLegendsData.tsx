import { AccountInformation, MatchDto, SummonerProfile, SummonerSpell, SummonerSpells } from "@/types/LeagueOfLegends";

const LeagueAPIRoute = `https://americas.api.riotgames.com/riot`


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

   const apiKey = process.env.RIOT_API_KEY;
   if (!apiKey) throw new Error("RIOT_API_KEY is not defined in environment variables.");

   // TODO: Implement region swapping in the future. For now, we will default to the Americas endpoint for all requests.
   const url = `${LeagueAPIRoute}/account/v1/accounts/by-riot-id/${riotName}/${riotTag}`;

   try {
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

      const data = await response.json();

      return {
         puuid: data.puuid,
         gameName: data.gameName,
         tagLine: data.tagLine,
      };
   } catch (error) {
      console.error(`[RiotAPI] fetchAccountByRiotID failed:`, error);
      throw error;
   }
}


// Fetches the match IDs of a player using their PUUID
export async function fetchMatchIdsByPUUID(puuid: string): Promise<string[]> {
   try {
      const response = await fetch(`${LeagueAPIRoute}/match/v1/matches/by-puuid/${puuid}`);

      const fetchedData = await response.json();
      return fetchedData.data;
   }
   catch (error: any) {
      console.error('Error fetching match IDs by PUUID:', error);
      throw error;
   }
}

// Fetches the match data using the match ID
export async function fetchMatchByMatchID(matchId: string): Promise<MatchDto> {
   try {
      const response = await fetch(`${LeagueAPIRoute}/match/v1/matches/${matchId}`);

      if (response.status === 404) {
         const errorData = await response.json();
         throw new Error(`Invalid match ID: ${errorData.error}`);
      }

      const fetchedData = await response.json();
      console.log(`fetchMatchByMatchID: fetchedData: for matchId: ${matchId}`);
      return fetchedData.data;
   }
   catch (error: any) {
      console.error('Error fetching match data:', error);
      throw error;
   }
}

export async function fetchSummonerSpellsData(gameVersion: string): Promise<SummonerSpells> {
   // format the version number to only include the first two numbers 
   let version = gameVersion.split('.').slice(0, 2).join('.');
   console.log(`fetchSummmoerSpellsData: Fetching spells for version: ${version}`)

   try {
      const response = await fetch(`${LeagueAPIRoute}/summoner/v1/spells?Version=${version}`);
      const fetchedData = await response.json();

      // console.log('fetchSummonerSpellsData: fetchedData:', JSON.stringify(fetchedData));
      return fetchedData.data;
   }
   catch (error: any) {
      console.error('Error fetching summoner spell icon:', error);
      throw error;
   }
}

export async function fetchRunesData(gameVersion: string): Promise<any> {
   // format the version number to only include the first two numbers 
   let version = gameVersion.split('.').slice(0, 2).join('.');
   console.log(`fetchRunesData: Fetching runes for version: ${version}`)

   try {
      const response = await fetch(`${LeagueAPIRoute}/runes/v1/runes?Version=${version}`);
      const fetchedData = await response.json();

      // console.log('fetchRunesData: fetchedData:', JSON.stringify(fetchedData));
      return fetchedData.data;
   }
   catch (error: any) {
      console.error('Error fetching runes data:', error);
      throw error;
   }
}