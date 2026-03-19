/*
Created By: Himay on 7/06/2024
Lasted Edited By: Himay 3/13/2026
File Level: Junior Developer
Overview: This file is the route for the Summoner Page. This file is called when a user searches for a summoner.
Two values are required, the gameName and tagLine of the player.
Example URL: champstats.gg/lol/radec%20himay-NA1
*/

export type AccountInformation = {
   puuid: string;
   gameName: string;
   tagLine: string;
}

export type MatchDto = {
   metadata: MetadataDto;
   info: infoDto;
}

export type MetadataDto = {
   dataVersion: string;
   matchId: string;
   participants: string[];
}

export type infoDto = {
   endOfGameResult: string;
   gameCreation: number;
   gameDuration: number;
   gameEndTimestamp: number;
   gameId: number;
   gameMode: string;
   gameName: string;
   gameStartTimestamp: number;
   gameType: string;
   gameVersion: string;
   mapId: number;
   participants: ParticipantDto[];
   platformId: string;
   queueId: number;
   teams: TeamDto[];
   tournamentCode: string;
}

export type ParticipantDto = {
   allInPings: number;
   assistMePings: number;
   assists: number;
   baronKills: number;
   bountyLevel: number;
   champExperience: number;
   champLevel: number;
   championId: number;
   championName: string;
   commandPings: number;
   championTransform: number;
   consumablesPurchased: number;
   challenges: ChallengesDto;
   damageDealtToBuildings: number;
   damageDealtToObjectives: number;
   damageDealtToTurrets: number;
   damageSelfMitigated: number;
   deaths: number;
   detectorWardsPlaced: number;
   doubleKills: number;
   dragonKills: number;
   eligibleForProgression: boolean;
   enemyMissingPings: number;
   enemyVisionPings: number;
   firstBloodAssist: boolean;
   firstBloodKill: boolean;
   firstTowerAssist: boolean;
   firstTowerKill: boolean;
   gameEndedInEarlySurrender: boolean;
   gameEndedInSurrender: boolean;
   holdPings: number;
   getBackPings: number;
   goldEarned: number;
   goldSpent: number;
   individualPosition: string;
   inhibitorKills: number;
   inhibitorTakedowns: number;
   inhibitorsLost: number;
   item0: number;
   item1: number;
   item2: number;
   item3: number;
   item4: number;
   item5: number;
   item6: number;
   itemsPurchased: number;
   killingSprees: number;
   kills: number;
   lane: string;
   largestCriticalStrike: number;
   largestKillingSpree: number;
   largestMultiKill: number;
   longestTimeSpentLiving: number;
   magicDamageDealt: number;
   magicDamageDealtToChampions: number;
   magicDamageTaken: number;
   missions: MissionsDto;
   neutralMinionsKilled: number;
   needVisionPings: number;
   nexusKills: number;
   nexusTakedowns: number;
   nexusLost: number;
   objectivesStolen: number;
   objectivesStolenAssists: number;
   onMyWayPings: number;
   participantId: number;
   playerScore0: number;
   playerScore1: number;
   playerScore2: number;
   playerScore3: number;
   playerScore4: number;
   playerScore5: number;
   playerScore6: number;
   playerScore7: number;
   playerScore8: number;
   playerScore9: number;
   playerScore10: number;
   playerScore11: number;
   pentaKills: number;
   perks: PerksDto;
   physicalDamageDealt: number;
   physicalDamageDealtToChampions: number;
   physicalDamageTaken: number;
   placement: number;
   playerAugment1: number;
   playerAugment2: number;
   playerAugment3: number;
   playerAugment4: number;
   playerSubteamId: number;
   subteamPlacement: number;
   profileIcon: number;
   pushPings: number;
   puuid: string;
   quadraKills: number;
   riotIdGameName: string;
   riotIdTagline: string;
   role: string;
   sightWardsBoughtInGame: number;
   spell1Casts: number;
   spell2Casts: number;
   spell3Casts: number;
   spell4Casts: number;
   summoner1Casts: number;
   summoner1Id: number;
   summoner2Casts: number;
   summoner2Id: number;
   summonerId: string;
   summonerLevel: number;
   summonerName: string;
   teamEarlySurrendered: boolean;
   teamId: number;
   teamPosition: string;
   timeCCingOthers: number;
   timePlayed: number;
   totalAllyJungleMinionsKilled: number;
   totalDamageDealt: number;
   totalDamageDealtToChampions: number;
   totalDamageShieldedOnTeammates: number;
   totalDamageTaken: number;
   totalEnemyJungleMinionsKilled: number;
   totalHeal: number;
   totalHealsOnTeammates: number;
   totalMinionsKilled: number;
   totalTimeCCDealt: number;
   totalTimeSpentDead: number;
   totalUnitsHealed: number;
   tripleKills: number;
   trueDamageDealt: number;
   trueDamageDealtToChampions: number;
   trueDamageTaken: number;
   turretKills: number;
   turretTakedowns: number;
   turretsLost: number;
   unrealKills: number;
   visionClearedPings: number;
   visionScore: number;
   visionWardsBoughtInGame: number;
   wardsKilled: number;
   wardsPlaced: number;
   win: boolean;
}

export type ChallengesDto = Record<string, number | string | boolean | null>;

export type MissionsDto = {
   playerScore0: number;
   playerScore1: number;
   playerScore2: number;
   playerScore3: number;
   playerScore4: number;
   playerScore5: number;
   playerScore6: number;
   playerScore7: number;
   playerScore8: number;
   playerScore9: number;
}

export type PerksDto = {
   statPerks: PerkStatsDto;
   styles: PerkStyleDto[];
}

export type PerkStatsDto = {
   defense: number;
   flex: number;
   offense: number;
}

export type PerkStyleDto = {
   description: string;
   selections: PerkStyleSelectionDto[];
   style: number;
}

export type PerkStyleSelectionDto = {
   perk: number;
   var1: number;
   var2: number;
   var3: number;
}

export type TeamDto = {
   bans: BanDto[];
   objectives: {
      baron: ObjectivesDto;
      champion: ObjectivesDto;
      dragon: ObjectivesDto;
      inhibitor: ObjectivesDto;
      riftHerald: ObjectivesDto;
      tower: ObjectivesDto;
   }
   teamId: number;
   win: boolean;
}

export type BanDto = {
   championId: number;
   pickTurn: number;
}

export type ObjectivesDto = {
   baron: ObjectiveDto;
   champion: ObjectiveDto;
   dragon: ObjectiveDto;
   hords: ObjectiveDto;
   inhibitor: ObjectiveDto;
   riftHerald: ObjectiveDto;
   tower: ObjectiveDto;
}

export type ObjectiveDto = {
   first: boolean;
   kills: number;
}

// Custom Types for easier handling of Summoner Spells and Runes data
export type SummonerSpell = {
   id: string;
   name: string;
   description: string;
   tooltip: string;
   maxrank: number;
   cooldown: number[];
   cooldownBurn: string;
   cost: number[];
   costBurn: string;
   datavalues: Record<string, unknown>;
   effect: Array<null | number[]>;
   effectBurn: Array<null | string>;
   vars: unknown[];
   key: string;
   summonerLevel: number;
   modes: string[];
   costType: string;
   maxammo: string;
   range: number[];
   rangeBurn: string;
   image: {
      full: string;
      sprite: string;
      group: string;
      x: number;
      y: number;
      w: number;
      h: number;
   };
   resource: string;
}

export type SummonerSpells = {
   type: string;
   version: string;
   data: Record<string, SummonerSpell>;
}

export type Rune = {
   id: number;
   key: string;
   icon: string;
   name: string;
   shortDesc: string;
   longDesc: string;
};

export type RuneSlot = {
   runes: Rune[];
};

export type Perk = {
   id: number;
   key: string;
   icon: string;
   name: string;
   slots: RuneSlot[];
};

export type PerkData = Perk[];

export type SummonerDTO = {
   profileIconId: number;
   revisionDate: number;
   puuid: string;
   summonerLevel: number;
}
