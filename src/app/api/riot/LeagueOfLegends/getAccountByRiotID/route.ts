/* 
Created By Himay on 5/21/2024
Lasted Edited By: Himay 3/14/2026
File Level: Junior Developer
Overview: Gets the PUUID of a player using their game name and tag line.
Example URL: /api/riot/getAccountPUUID?gameName=radechimay&tagLine=NA1
Note: gameName is valid as 'radechimay', 'radec himay' and 'radec%20himay' and are NOT case sensitive
Link to the API: https://developer.riotgames.com/apis#account-v1/GET_getByRiotId
*/

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {

   const gameName = request.nextUrl.searchParams.get('gameName');
   const tagLine = request.nextUrl.searchParams.get('tagLine');
   const apiKey = process.env.RIOT_API_KEY;

   if (gameName === 'undefined' || tagLine === 'undefined') {
      return NextResponse.json(
         { error: 'Missing game name or tag line' },
         { status: 400 }
      );
   }

   if (!apiKey) {
      return NextResponse.json(
         { error: 'Server configuration error: Missing API Key' },
         { status: 500 }
      );
   }

   try {
      console.log(`Fetching PUUID for ${gameName}#${tagLine} using API key: ${apiKey ? 'Present' : 'Missing'}`);
      const response = await fetch(`https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}?api_key=${apiKey}`);
      const data = await response.json();

      // Player not found
      if (data.status && data.status.status_code === 404) {
         return NextResponse.json({ error: 'Player not found' }, { status: 404 });
      }

      return NextResponse.json({ data }, { status: 200 });
   }
   catch (error) {
      console.error('Error fetching PUUID:', error);

      // Invalid API URL
      return NextResponse.json(
         { error: 'Invalid API URL' },
         { status: 500 }
      );
   }

}
