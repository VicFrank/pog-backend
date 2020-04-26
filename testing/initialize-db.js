const games = require("../db/games");
const quests = require("../db/quests");
const players = require("../db/players");
const cosmetics = require("../db/cosmetics");
const questsList = require("./quests-list");
const cosmeticsList = require("./cosmetics-list");
const battlePassRewards = require("./battle-pass-rewards");
const { generateRandomSampleData, realSample } = require("./sample-data");

/*
  Initializes the database with the daily quests/achievements
*/
async function loadQuests() {
  try {
    const loadedQuests = await quests.getAllAchievements();

    if (loadedQuests.length > 0) {
      console.log("Quests are already loaded");
      return;
    }

    console.log("Adding Quests...");

    let promises = [];
    for (let questData of questsList) {
      promises.push(quests.addNewQuest(questData));
    }

    await Promise.all(promises);
  } catch (error) {
    throw error;
  }
}

async function loadCosmetics() {
  try {
    const loadedCosmetics = await cosmetics.getAllCosmetics();

    if (loadedCosmetics.length > 0) {
      console.log("Cosmetics are already loaded");
      return;
    }

    console.log("Adding cosmetics...");

    let promises = [];
    for (let cosmeticData of cosmeticsList) {
      const { cost, cosmetic_id, rarity, type, equip_group } = cosmeticData;
      promises.push(
        cosmetics.createCosmetic(cost, cosmetic_id, rarity, type, equip_group)
      );
    }

    await Promise.all(promises);
  } catch (error) {
    throw error;
  }
}

async function loadBattlePass() {
  try {
    const loadedBattlePass = await cosmetics.getBattlePass();

    if (loadedBattlePass.length > 0) {
      console.log("Battle Pass is already loaded");
      return;
    }

    console.log("Loading Battle pass...");

    let promises = [];
    for (let rewards of battlePassRewards) {
      const { level, cosmetic_id, chest_type, chest_amount } = rewards;
      promises.push(
        cosmetics.createBattlePassLevel(
          level,
          cosmetic_id,
          chest_type,
          chest_amount
        )
      );
    }

    await Promise.all(promises);
  } catch (error) {
    throw error;
  }
}

async function initPlayers() {
  try {
    for (let i = 0; i < 10; i++) {
      await games.create(generateRandomSampleData());
    }
    console.log(`Ran 10 sample games to initialize players`);
  } catch (error) {
    throw error;
  }
}

async function addSampleGames(numGames) {
  try {
    let promises = [];
    for (let i = 0; i < numGames; i++) {
      promises.push(games.create(generateRandomSampleData()));
    }

    await Promise.all(promises);

    console.log(`Added ${numGames} sample games`);
  } catch (error) {
    throw error;
  }
}

async function addRealSample() {
  try {
    await games.create(realSample);

    console.log(`Added real sample games`);
  } catch (error) {
    throw error;
  }
}

async function initializeAdmins() {
  console.log("Initializing Admins");
  const adminList = [
    "76561198015161808",
    "76561197960956468",
    "76561198030851434",
    "76561198007141460",
    "76561198052211234",
    "76561197983098727",
  ];

  try {
    for (let steamID of adminList) {
      await players.setAdmin(steamID, true, 1);
    }
  } catch (error) {
    throw error;
  }
}

(async function () {
  // await loadQuests();
  // await loadCosmetics();
  // await loadBattlePass();
  // await initPlayers();
  // await addSampleGames(10);
  // await initializeAdmins();
  await addRealSample();
})();
