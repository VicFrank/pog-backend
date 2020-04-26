const sampleData = {
  gameStats: {
    gameDuration: "1249", // seconds from horn
    cheatsEnabled: "false",
    rankedGame: "true",
    winnerTeam: "DOTA_TEAM_GOODGUYS", // DOTA_TEAM_GOODGUYS = 2 (Lorekeepers), DOTA_TEAM_BADGUYS = 3 (Flameguard)
    healthDrops: "28",
    bannedHeroes: [
      // anything between 0 and 6 banned heroes
      "npc_dota_hero_antimage",
      "npc_dota_hero_batrider",
      "npc_dota_hero_keeper_of_the_light",
    ],
    teamInfo: {
      DOTA_TEAM_GOODGUYS: {
        kills: "37",
        deaths: "28",
        assists: "51",
        guardianKills: {
          // can be null. time of kill: guardian killed. POG_GUARDIAN_CREEPS = 1 (monkey), POG_GUARDIAN_DAMAGE = 2 (pooky), POG_GUARDIAN_CDR = 3 (bucket)
          "531": "POG_GUARDIAN_CREEPS",
          "569": "POG_GUARDIAN_DAMAGE",
        },
        buildingKills: {
          // can be null. structure: kill time.
          firstTower: "181",
          secondTower: "290",
          barracks: "617",
          thirdTower: "772",
          fourthTower: "788",
        },
      },
      DOTA_TEAM_BADGUYS: {
        kills: "28",
        deaths: "37",
        assists: "40",
        guardianKills: {},
        buildingKills: {
          firstTower: "315",
          secondTower: "342",
        },
      },
    },
    playerInfo: {
      "1": {
        steamid: "76561197960956468", // steam64 ID
        username: "Dingleberry", // steam username
        team: "DOTA_TEAM_GOODGUYS",
        banChoice: "npc_dota_hero_batrider", // can be null
        availablePicks: [
          "npc_dota_hero_lina",
          "npc_dota_hero_slark",
          "npc_dota_hero_scaldris",
        ],
        rerolledHeroes: [
          // can be null
          "npc_dota_hero_spectre",
        ],
        finalPick: "npc_dota_hero_lina",
        kills: "8",
        deaths: "11",
        assists: "16",
        lastHits: "168",
        denies: "3",
        doubleKills: "3",
        rampages: "1",
        heroDamage: "16238",
        buildingDamage: "1281",
        heroHealing: "234",
        tpScrollsUsed: "9",
        runesUsed: "3", // counts on activation, not pickup (in bottle's case)
        healthDropDuration: "127", // total duration of the regeneration buff on this hero
        currentGold: "1111",
        totalGold: "21357",
        totalExp: "19822",
        level: "24",
        spentRerolls: "1",
        abilities: {
          // ability name: final level (includes talents)
          lina_dragon_slave: "4",
          lina_light_strike_array: "4",
          lina_fiery_soul: "4",
          lina_laguna_blade: "3",
          special_ability_damage_30: "1",
          special_ability_spell_amp_12: "1",
          special_ability_mana_regen_3: "1",
        },
        itemPurchases: {
          // item purchases throughout the game, time: item name
          "34": "item_blink",
          "42": "item_cyclone",
          "111": "item_sheepstick",
          "234": "item_phase_boots",
          "456": "item_nokrash_blade",
          "799": "item_sphere",
          "919": "item_mango",
          "1028": "item_refresher",
        },
        finalInventory: {
          // end-of-match inventory, 0-5 = active inventory, 6-8 = backpack
          "0": "item_blink",
          "1": "item_cyclone",
          "2": "item_sheepstick",
          "3": "item_phase_boots",
          "4": "item_nokrash_blade",
          "5": "item_sphere",
          "6": "item_mango",
          "7": "item_refresher",
        },
        permanentBuffs: [
          // can be null. tracks permanent buffs like flesh heap, edible aghs, and moon shard
          "modifier_moon_shard_consumed",
          "modifier_ultimate_scepter_consumed",
        ],
        disconnectEvents: {
          // can be null if the player never disconnected until the end of the game. disconnect time: reconnect time (-1 if the player never reconnected after this disconnect event). Counts anything before the horn as 0.
          "37": "45",
          "871": "-1",
        },
        abandoned: "false",
      },
      "2": {
        // I'll omit other players for brevity but there should always be 6 of them
        steamid: "76561198007141460",
        username: "MidAndFeed",
        team: "DOTA_TEAM_BADGUYS",
        banChoice: "npc_dota_hero_antimage",
        availablePicks: [
          "npc_dota_hero_tidehunter",
          "npc_dota_hero_lich",
          "npc_dota_hero_mifune",
        ],
        rerolledHeroes: ["npc_dota_hero_warlock"],
        finalPick: "npc_dota_hero_mifune",
        kills: "8",
        deaths: "11",
        assists: "16",
        lastHits: "168",
        denies: "3",
        doubleKills: "1",
        rampages: "0",
        heroDamage: "16238",
        buildingDamage: "1281",
        heroHealing: "234",
        tpScrollsUsed: "9",
        runesUsed: "1",
        healthDropDuration: "89",
        currentGold: "322",
        totalGold: "21357",
        totalExp: "19822",
        level: "24",
        spentRerolls: "3",
        abilities: {
          lina_dragon_slave: "4",
          lina_light_strike_array: "4",
          lina_fiery_soul: "4",
          lina_laguna_blade: "3",
          special_ability_damage_30: "1",
          special_ability_spell_amp_12: "1",
          special_ability_mana_regen_3: "1",
        },
        itemPurchases: {
          "34": "item_blink",
          "42": "item_cyclone",
          "111": "item_sheepstick",
          "234": "item_phase_boots",
          "456": "item_nokrash_blade",
          "799": "item_rapier",
          "919": "item_mango",
          "1028": "item_refresher",
        },
        finalInventory: {
          "0": "item_blink",
          "1": "item_cyclone",
          "2": "item_sheepstick",
          "3": "item_phase_boots",
          "4": "item_nokrash_blade",
          "5": "item_sphere",
          "6": "item_mango",
          "7": "item_refresher",
          "8": "item_heart",
          "9": "item_tango",
        },
        permanentBuffs: [],
        disconnectEvents: {
          "422": "469",
        },
        abandoned: "true",
      },
    },
  },
};

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function randomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomFromBucket(bucket) {
  const randomIndex = Math.floor(Math.random() * bucket.length);
  return bucket.splice(randomIndex, 1)[0];
}

const heroes = [
  "npc_dota_hero_antimage",
  "npc_dota_hero_batrider",
  "npc_dota_hero_keeper_of_the_light",
  "npc_dota_hero_lina",
  "npc_dota_hero_slark",
  "npc_dota_hero_zuus",
  // "npc_dota_hero_scaldris",
];

const steamIDs = [
  "76561197960956468",
  "76561197964547457",
  "76561198014254115",
  "76561197960287930",
  "76561198052211234",
  "76561198015161808",
  "76561198007141460",
  "76561198030851434",
];

const usernames = {
  "76561197960956468": "HIPPOcrit",
  "76561197964547457": "DC | @syndereNDota",
  "76561198014254115": "IceFrog",
  "76561197960287930": "Rabscuttle",
  "76561198052211234": "bukka",
  "76561198015161808": "EarthSalamander",
  "76561198007141460": "Firetoad",
  "76561198030851434": "VicFrank",
};

function generateTeamInfo() {
  let teamInfo = {};
  teamInfo.kills = randomInt(0, 100).toString();
  teamInfo.deaths = randomInt(0, 100).toString();
  teamInfo.assists = randomInt(0, 100).toString();
  if (randomInt(0, 10) < 5) {
    teamInfo.guardianKills = {};
    teamInfo.guardianKills[randomInt(100, 1000)] = "POG_GUARDIAN_CREEPS";
    teamInfo.guardianKills[randomInt(100, 1000)] = "POG_GUARDIAN_DAMAGE";
    teamInfo.guardianKills[randomInt(100, 1000)] = "POG_GUARDIAN_CDR";
  }
  if (randomInt(0, 10) < 9) {
    teamInfo.buildingKills = {};
    teamInfo.buildingKills.firstTower = randomInt(100, 2000).toString();
    teamInfo.buildingKills.secondTower = randomInt(100, 2000).toString();
    teamInfo.buildingKills.barracks = randomInt(100, 2000).toString();
    teamInfo.buildingKills.thirdTower = randomInt(100, 2000).toString();
    teamInfo.buildingKills.fourthTower = randomInt(100, 2000).toString();
  }

  return teamInfo;
}

function generatePlayerInfo(steamIDBucket, team) {
  let playerInfo = {};
  playerInfo.steamid = getRandomFromBucket(steamIDBucket);
  playerInfo.team = team;
  playerInfo.username = usernames[playerInfo.steamid];
  if (randomInt(0, 10) < 5) {
    playerInfo.banChoice = randomElement(heroes);
  }
  playerInfo.availablePicks = [];
  playerInfo.availablePicks.push(randomElement(heroes));
  playerInfo.availablePicks.push(randomElement(heroes));
  playerInfo.availablePicks.push(randomElement(heroes));
  if (randomInt(0, 10) < 8) {
    playerInfo.rerolledHeroes = [];
    playerInfo.rerolledHeroes.push(randomElement(heroes));
  }
  playerInfo.finalPick = randomElement(heroes);
  playerInfo.kills = randomInt(0, 50).toString();
  playerInfo.deaths = randomInt(0, 50).toString();
  playerInfo.assists = randomInt(0, 50).toString();
  playerInfo.lastHits = randomInt(0, 300).toString();
  playerInfo.denies = randomInt(0, 100).toString();
  playerInfo.currentGold = randomInt(0, 999).toString();
  playerInfo.doubleKills = randomInt(0, 8).toString();
  playerInfo.rampages = randomInt(0, 2).toString();
  playerInfo.heroDamage = randomInt(0, 50000).toString();
  playerInfo.buildingDamage = randomInt(0, 50000).toString();
  playerInfo.heroHealing = randomInt(0, 1000).toString();
  playerInfo.tpScrollsUsed = randomInt(0, 10).toString();
  playerInfo.runesUsed = randomInt(0, 10).toString();
  playerInfo.healthDropDuration = randomInt(0, 100).toString();
  playerInfo.totalGold = randomInt(1000, 10000).toString();
  playerInfo.totalExp = randomInt(1000, 10000).toString();
  playerInfo.level = randomInt(1, 25).toString();
  playerInfo.spentRerolls = randomInt(0, 3).toString();

  playerInfo.abilities = {
    lina_dragon_slave: "4",
    lina_light_strike_array: "4",
    lina_fiery_soul: "4",
    lina_laguna_blade: "3",
    special_ability_damage_30: "1",
    special_ability_spell_amp_12: "1",
    special_ability_mana_regen_3: "1",
  };

  playerInfo.finalInventory = {
    "0": "item_blink",
    "1": "item_cyclone",
    "2": "item_sheepstick",
    "3": "item_phase_boots",
    "4": "item_nokrash_blade",
    "5": "item_sphere",
    "6": "item_mango",
    "7": "item_refresher",
  };

  playerInfo.itemPurchases = {
    "34": "item_blink",
    "42": "item_cyclone",
    "111": "item_sheepstick",
    "234": "item_phase_boots",
    "456": "item_nokrash_blade",
    "799": "item_sphere",
    "919": "item_mango",
    "1028": "item_refresher",
  };

  if (randomInt(0, 10) < 5) {
    playerInfo.permanentBuffs = [
      "modifier_moon_shard_consumed",
      "modifier_ultimate_scepter_consumed",
    ];
  }

  if (randomInt(0, 10) < 8) {
    playerInfo.disconnectEvents = {
      "37": "45",
      "871": "-1",
    };
  }

  return playerInfo;
}

const generateRandomSampleData = () => {
  let gameStats = {};
  gameStats.gameDuration = randomInt(3000, 6000);
  gameStats.cheatsEnabled = randomElement(["true", "false"]);
  gameStats.rankedGame = randomElement(["true", "false"]);
  gameStats.winnerTeam = randomElement([
    "DOTA_TEAM_GOODGUYS",
    "DOTA_TEAM_BADGUYS",
  ]);
  gameStats.healthDrops = randomInt(0, 100).toString();
  gameStats.bannedHeroes = [];
  for (let i = 0; i < randomInt(0, 6); i++) {
    gameStats.bannedHeroes.push(randomElement(heroes));
  }
  gameStats.teamInfo = {};
  gameStats.teamInfo.DOTA_TEAM_GOODGUYS = generateTeamInfo();
  gameStats.teamInfo.DOTA_TEAM_BADGUYS = generateTeamInfo();

  gameStats.playerInfo = [];
  let steamIDBucket = [...steamIDs];
  for (let i = 0; i < 3; i++) {
    gameStats.playerInfo[i.toString()] = generatePlayerInfo(
      steamIDBucket,
      "DOTA_TEAM_GOODGUYS"
    );
    gameStats.playerInfo[(i + 3).toString()] = generatePlayerInfo(
      steamIDBucket,
      "DOTA_TEAM_BADGUYS"
    );
  }

  return gameStats;
};

module.exports = {
  sampleData: sampleData,
  generateRandomSampleData: generateRandomSampleData,
};
