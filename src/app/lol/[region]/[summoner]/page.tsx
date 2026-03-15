import { toTitleCase } from "@/utils/format";
import { fetchAccountByRiotID } from "@/utils/formatApiData/fetchLeagueOfLegendsData";
import { MatchSummaryCard } from "@/components/match-history";

interface PageProps {
   params: Promise<{
      region: string;
      summoner: string;
   }>;
}


export default async function Page({ params }: PageProps) {
   const { region, summoner } = await params;

   // "radec%20himay-NA1" -> "riotName: "radec%20himay", riotTag: "NA1"
   const [rawRiotName, rawRiotTag] = summoner.split('-');

   const riotName = toTitleCase(decodeURIComponent(rawRiotName)); // "radec%20himay" -> "Radec Himay"
   const riotTag = rawRiotTag.toUpperCase();


   let account;
   try {
      account = await fetchAccountByRiotID(rawRiotName, rawRiotTag);
   }
   catch (error) {
      console.error("Failed to fetch account information", error);
   }

   return (
      <div className="p-6 mx-auto text-center border">
         <h1 className="text-2xl font-bold mb-4">Summoner Profile</h1>
         <p className="text-lg">Region: {region.toUpperCase()}</p>
         <p className="text-lg">Game Name: {riotName}</p>
         <p className="text-lg">Tag Line: {riotTag}</p>
         <p className="text-lg">PUUID: {account?.puuid || "Not found"}</p>
         <div>
            <h1 className="text2xl font-bold mb-4">Match History</h1>
            <MatchSummaryCard />
         </div>
      </div>
   );
}