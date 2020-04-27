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
        neutralItems: 1,
        healingGoblets: 1,
        highFives: 0,
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
        neutralItems: 1,
        healingGoblets: 1,
        highFives: 0,
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

const realSample = {
  healthDrops: 45,
  winnerTeam: "DOTA_TEAM_BADGUYS",
  gameDuration: 924.51354980469,
  teamInfo: {
    DOTA_TEAM_BADGUYS: {
      buildingKills: {
        barracks: 688.20458984375,
        thirdTower: 917.44860839844,
        secondTower: 679.64001464844,
        fourthTower: 919.98132324219,
        firstTower: 630.05212402344,
      },
      assists: 46,
      guardianKills: {
        "806": "POG_GUARDIAN_DAMAGE",
        "809": "POG_GUARDIAN_CREEPS",
      },
      kills: 25,
      deaths: 12,
    },
    DOTA_TEAM_GOODGUYS: {
      buildingKills: { secondTower: 571.56640625, firstTower: 307.49749755859 },
      assists: 20,
      guardianKills: [],
      kills: 11,
      deaths: 26,
    },
  },
  playerInfo: {
    "0": {
      healthDropDuration: 63.966430664062,
      assists: 8,
      spentRerolls: 0,
      neutralItems: 1,
      healingGoblets: 1,
      highFives: 0,
      availablePicks: [
        "npc_dota_hero_centaur",
        "npc_dota_hero_dazzle",
        "npc_dota_hero_weaver",
        "npc_dota_hero_windrunner",
      ],
      finalPick: "npc_dota_hero_dazzle",
      buildingDamage: 234,
      denies: 3,
      tpScrollsUsed: 0,
      totalGold: 21393,
      heroHealing: 692,
      team: "DOTA_TEAM_GOODGUYS",
      heroDamage: 11449,
      currentGold: 3388,
      totalExp: 11364,
      itemPurchases: [],
      level: 26,
      runesUsed: 0,
      abandoned: false,
      permanentBuffs: [],
      disconnectEvents: [],
      abilities: {
        special_bonus_unique_dazzle_3: 1,
        dazzle_shadow_wave: 4,
        dazzle_poison_touch: 4,
        generic_hidden: 0,
        ability_capture: 1,
        special_bonus_unique_dazzle_4: 1,
        special_bonus_attack_damage_60: 1,
        special_bonus_cast_range_200: 0,
        special_bonus_movement_speed_40: 0,
        dazzle_shallow_grave: 4,
        special_bonus_unique_dazzle_2: 1,
        special_bonus_unique_dazzle_1: 0,
        special_bonus_mp_regen_2: 0,
        dazzle_bad_juju: 3,
      },
      kills: 3,
      finalInventory: {
        "0": "item_pog_guardian_greaves",
        "1": "item_black_king_bar",
        "2": "item_pog_phase_boots",
        "3": "item_desolator",
        "4": "item_ultimate_scepter",
        "5": "item_magic_wand",
      },
      lastHits: 83,
      doubleKills: 0,
      deaths: 10,
      rerolledHeroes: ["npc_dota_hero_weaver"],
      banChoice: "npc_dota_hero_ancient_apparition",
      username: "@SUNSfanTV",
      rampages: 0,
      steamid: "76561197960956468",
    },
    "1": {
      healthDropDuration: 95.73046875,
      assists: 18,
      spentRerolls: 0,
      neutralItems: 1,
      healingGoblets: 1,
      highFives: 0,
      availablePicks: [
        "npc_dota_hero_mars",
        "npc_dota_hero_mirana",
        "npc_dota_hero_tiny",
        "npc_dota_hero_spectre",
      ],
      finalPick: "npc_dota_hero_mars",
      buildingDamage: 4793,
      denies: 8,
      tpScrollsUsed: 0,
      totalGold: 32257,
      heroHealing: 0,
      team: "DOTA_TEAM_BADGUYS",
      heroDamage: 26277,
      currentGold: 5327,
      totalExp: 28011,
      itemPurchases: [],
      level: 30,
      runesUsed: 2,
      abandoned: false,
      permanentBuffs: [],
      disconnectEvents: [],
      abilities: {
        special_bonus_unique_mars_spear_stun_duration: 1,
        mars_gods_rebuke: 4,
        ability_capture: 1,
        mars_spear: 4,
        mars_bulwark: 4,
        mars_arena_of_blood: 3,
        special_bonus_unique_mars_arena_of_blood_hp_regen: 1,
        special_bonus_movement_speed_20: 1,
        special_bonus_unique_mars_spear_bonus_damage: 1,
        special_bonus_unique_mars_gods_rebuke_extra_crit: 1,
        generic_hidden: 0,
        special_bonus_armor_8: 1,
        special_bonus_attack_damage_25: 1,
        special_bonus_strength_8: 1,
      },
      kills: 8,
      finalInventory: {
        "0": "item_pog_phase_boots",
        "1": "item_fallen_sky",
        "2": "item_black_king_bar",
        "3": "item_havoc_hammer",
        "4": "item_havoc_hammer",
        "5": "item_desolator_2",
      },
      lastHits: 133,
      doubleKills: 0,
      deaths: 4,
      rerolledHeroes: ["npc_dota_hero_mirana"],
      banChoice: "npc_dota_hero_jakiro",
      username: "Say So",
      rampages: 0,
      steamid: "76561198114133623",
    },
    "2": {
      healthDropDuration: 35,
      assists: 7,
      spentRerolls: 0,
      neutralItems: 1,
      healingGoblets: 1,
      highFives: 0,
      availablePicks: [
        "npc_dota_hero_luna",
        "npc_dota_hero_grimstroke",
        "npc_dota_hero_storm_spirit",
        "npc_dota_hero_slardar",
      ],
      finalPick: "npc_dota_hero_grimstroke",
      buildingDamage: 0,
      denies: 1,
      tpScrollsUsed: 0,
      totalGold: 21752,
      heroHealing: 0,
      team: "DOTA_TEAM_GOODGUYS",
      heroDamage: 23987,
      currentGold: 4700,
      totalExp: 26119,
      itemPurchases: [],
      level: 28,
      runesUsed: 0,
      abandoned: false,
      permanentBuffs: [],
      disconnectEvents: [],
      abilities: {
        special_bonus_cast_range_175: 0,
        special_bonus_spell_amplify_20: 1,
        grimstroke_ink_creature: 4,
        grimstroke_soul_chain: 3,
        generic_hidden: 0,
        grimstroke_scepter: 0,
        special_bonus_unique_grimstroke_2: 1,
        ability_capture: 1,
        grimstroke_spirit_walk: 4,
        special_bonus_unique_grimstroke_1: 0,
        special_bonus_unique_grimstroke_4: 0,
        special_bonus_unique_grimstroke_5: 1,
        special_bonus_unique_grimstroke_3: 1,
        special_bonus_movement_speed_30: 0,
        grimstroke_dark_artistry: 4,
      },
      kills: 2,
      finalInventory: {
        "0": "item_magic_wand",
        "1": "item_aether_lens",
        "2": "item_boots",
        "3": "item_pog_seer_stone",
        "4": "item_kaya_and_sange",
        "5": "item_ward_sentry",
      },
      lastHits: 90,
      doubleKills: 0,
      deaths: 7,
      rerolledHeroes: ["npc_dota_hero_luna"],
      banChoice: "npc_dota_hero_zuus",
      username: "Pipsqueaker1",
      rampages: 0,
      steamid: "76561198081639370",
    },
    "3": {
      healthDropDuration: 21.66650390625,
      assists: 11,
      spentRerolls: 0,
      neutralItems: 1,
      healingGoblets: 1,
      highFives: 0,
      availablePicks: [
        "npc_dota_hero_earthshaker",
        "npc_dota_hero_chen",
        "npc_dota_hero_riki",
        "npc_dota_hero_enchantress",
      ],
      finalPick: "npc_dota_hero_riki",
      buildingDamage: 1264,
      denies: 7,
      tpScrollsUsed: 0,
      totalGold: 30938,
      heroHealing: 0,
      team: "DOTA_TEAM_BADGUYS",
      heroDamage: 16907,
      currentGold: 10688,
      totalExp: 32953,
      itemPurchases: [],
      level: 30,
      runesUsed: 1,
      abandoned: false,
      permanentBuffs: [],
      disconnectEvents: [],
      abilities: {
        riki_backstab: 3,
        special_bonus_unique_riki_1: 1,
        generic_hidden: 0,
        ability_capture: 1,
        riki_smoke_screen: 4,
        special_bonus_unique_riki_5: 1,
        riki_tricks_of_the_trade: 4,
        special_bonus_unique_riki_2: 1,
        special_bonus_hp_regen_8: 1,
        special_bonus_attack_speed_25: 1,
        special_bonus_unique_riki_6: 1,
        special_bonus_attack_damage_30: 1,
        special_bonus_unique_riki_3: 1,
        riki_blink_strike: 4,
      },
      kills: 13,
      finalInventory: {
        "0": "item_magic_wand",
        "1": "item_nullifier",
        "2": "item_diffusal_blade",
        "3": "item_power_treads",
        "4": "item_sange_and_yasha",
        "5": "item_abyssal_blade",
        "6": "item_orb_of_venom",
        "7": "item_ward_observer",
      },
      lastHits: 37,
      doubleKills: 0,
      deaths: 1,
      rerolledHeroes: ["npc_dota_hero_chen"],
      banChoice: "npc_dota_hero_arc_warden",
      username: "Quazi",
      rampages: 0,
      steamid: "76561198040919515",
    },
    "4": {
      healthDropDuration: 64.299682617188,
      assists: 5,
      spentRerolls: 0,
      neutralItems: 1,
      healingGoblets: 1,
      highFives: 0,
      availablePicks: [
        "npc_dota_hero_drow_ranger",
        "npc_dota_hero_sand_king",
        "npc_dota_hero_razor",
      ],
      finalPick: "npc_dota_hero_drow_ranger",
      buildingDamage: 356,
      denies: 3,
      tpScrollsUsed: 0,
      totalGold: 20465,
      heroHealing: 0,
      team: "DOTA_TEAM_GOODGUYS",
      heroDamage: 13926,
      currentGold: 42,
      totalExp: 19617,
      itemPurchases: [],
      level: 27,
      runesUsed: 0,
      abandoned: true,
      permanentBuffs: [],
      disconnectEvents: [],
      abilities: {
        special_bonus_agility_12: 1,
        special_bonus_movement_speed_20: 0,
        special_bonus_unique_drow_ranger_1: 1,
        drow_ranger_marksmanship: 3,
        generic_hidden: 0,
        ability_capture: 1,
        special_bonus_unique_drow_ranger_3: 1,
        special_bonus_cooldown_reduction_40: 0,
        special_bonus_unique_drow_ranger_4: 0,
        special_bonus_unique_drow_ranger_5: 0,
        special_bonus_all_stats_5: 1,
        drow_ranger_frost_arrows: 4,
        drow_ranger_wave_of_silence: 4,
        drow_ranger_multishot: 4,
      },
      kills: 6,
      finalInventory: {
        "0": "item_havoc_hammer",
        "1": "item_ultimate_scepter",
        "2": "item_havoc_hammer",
        "3": "item_power_treads",
        "4": "item_hurricane_pike",
        "5": "item_mask_of_madness",
      },
      lastHits: 83,
      doubleKills: 0,
      deaths: 9,
      rerolledHeroes: [],
      banChoice: "npc_dota_hero_abyssal_underlord",
      username: "VicFrank",
      rampages: 0,
      steamid: "76561198030851434",
    },
    "5": {
      healthDropDuration: 99.696166992188,
      assists: 17,
      spentRerolls: 0,
      neutralItems: 1,
      healingGoblets: 1,
      highFives: 0,
      availablePicks: [
        "npc_dota_hero_skywrath_mage",
        "npc_dota_hero_pangolier",
        "npc_dota_hero_batrider",
        "npc_dota_hero_silencer",
      ],
      finalPick: "npc_dota_hero_silencer",
      buildingDamage: 2909,
      denies: 5,
      tpScrollsUsed: 0,
      totalGold: 30121,
      heroHealing: 0,
      team: "DOTA_TEAM_BADGUYS",
      heroDamage: 19185,
      currentGold: 6383,
      totalExp: 27667,
      itemPurchases: [],
      level: 30,
      runesUsed: 0,
      abandoned: false,
      permanentBuffs: [],
      disconnectEvents: [],
      abilities: {
        silencer_last_word: 4,
        special_bonus_armor_6: 1,
        generic_hidden: 0,
        special_bonus_unique_silencer_6: 1,
        ability_capture: 1,
        special_bonus_unique_silencer_3: 1,
        special_bonus_unique_silencer_4: 1,
        special_bonus_attack_range_125: 1,
        silencer_glaives_of_wisdom: 4,
        special_bonus_attack_speed_25: 1,
        special_bonus_unique_silencer: 1,
        silencer_global_silence: 3,
        silencer_curse_of_the_silent: 4,
        special_bonus_unique_silencer_2: 1,
      },
      kills: 4,
      finalInventory: {
        "0": "item_hurricane_pike",
        "1": "item_sheepstick",
        "2": "item_bloodthorn",
        "3": "item_satanic",
        "4": "item_magic_wand",
        "5": "item_power_treads",
      },
      lastHits: 77,
      doubleKills: 0,
      deaths: 7,
      rerolledHeroes: ["npc_dota_hero_skywrath_mage"],
      banChoice: "npc_dota_hero_undying",
      username: "Nogweii 🎆",
      rampages: 0,
      steamid: "76561197998191501",
    },
  },
  cheatsEnabled: false,
  bannedHeroes: [
    "npc_dota_hero_undying",
    "npc_dota_hero_jakiro",
    "npc_dota_hero_zuus",
    "npc_dota_hero_abyssal_underlord",
    "npc_dota_hero_ancient_apparition",
    "npc_dota_hero_arc_warden",
  ],
  rankedGame: true,
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
  playerInfo.neutralItems = randomInt(0, 3).toString();
  playerInfo.healingGoblets = randomInt(0, 3).toString();
  playerInfo.highFives = randomInt(0, 3).toString();

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
  sampleData,
  realSample,
  generateRandomSampleData,
};
