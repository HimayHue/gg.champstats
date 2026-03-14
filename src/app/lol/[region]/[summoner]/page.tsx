import { toTitleCase } from "@/utils/formatApiData/format";
interface PageProps {
   params: Promise<{
      summoner: string;
      region: string;
   }>;
}

export default async function Page({ params }: PageProps) {
   const { region, summoner } = await params;

   // "radec%20himay-NA1" -> "Radec Himay-NA1"
   const summonerNameWithTag = toTitleCase(decodeURIComponent(summoner).toLowerCase());

   // "Radec Himay-NA1" -> [gameName = "Radec Himay", tagLine = "NA1"]
   const [gameName, tagLine] = summonerNameWithTag.split('-');


   return (
      <div className="p-6 mx-auto text-center border">
         <h1 className="text-2xl font-bold mb-4">Summoner Profile</h1>
         <p className="text-lg">Region: {region.toUpperCase()}</p>
         <p className="text-lg">Game Name: {gameName}</p>
         <p className="text-lg">Tag Line: {tagLine}</p>
      </div>
   );
}