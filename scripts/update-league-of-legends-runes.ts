/**
 * This script fetches the latest rune data from Riot's Data Dragon API and generates a TypeScript file containing a mapping of rune IDs to their names, trees, and icons. 
 * This allows us to keep our rune data up-to-date without manual intervention.
 *  You can fetch the latest version from: https://ddragon.leagueoflegends.com/api/versions.json
 */

import fs from 'fs';
import path from 'path';

const FILE_PATH = path.join(process.cwd(), 'src/lib/constants/league-of-legends/runes.ts');
const VERSION = "16.6.1";
const URL = `https://ddragon.leagueoflegends.com/cdn/${VERSION}/data/en_US/runesReforged.json`;

async function generateRuneMap() {
   try {
      console.log(`fetching rune data from Riot v${VERSION}...`);
      const response = await fetch(URL);
      const data = await response.json();

      // The O(1) Lookup Table
      const flattenedRunes: Record<number, any> = {};

      data.forEach((tree: any) => {
         // 1. Add the Tree itself (e.g., 8100 -> Domination)
         flattenedRunes[tree.id] = {
            id: tree.id,
            name: tree.name,
            icon: tree.icon,
            isTree: true
         };

         // 2. Add every rune within that tree
         tree.slots.forEach((slot: any) => {
            slot.runes.forEach((rune: any) => {
               flattenedRunes[rune.id] = {
                  ...rune,
                  parentTreeName: tree.name,
                  parentTreeIcon: tree.icon,
                  isTree: false
               };
            });
         });
      });

      // We must define the file content before writing it!
      const fileContent = `
/**
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from Riot Data Dragon v${VERSION}
 */

export const LOL_RUNES = ${JSON.stringify(flattenedRunes, null, 2)} as const;

export type LolRuneId = keyof typeof LOL_RUNES;
export type LolRune = typeof LOL_RUNES[LolRuneId];
    `.trim();

      // Ensure directory exists and write file
      fs.mkdirSync(path.dirname(FILE_PATH), { recursive: true });
      fs.writeFileSync(FILE_PATH, fileContent);

      console.log(`✅ Successfully generated O(1) rune map to: ${FILE_PATH}`);
   } catch (error) {
      console.error("❌ Failed to generate rune data:", error);
   }
}

generateRuneMap();