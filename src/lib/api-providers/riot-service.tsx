import { AccountInformation } from "@/types/LeagueOfLegends";
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
export async function getAccountByRiotId(
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

