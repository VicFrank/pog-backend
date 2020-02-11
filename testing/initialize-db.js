const games = require("../db/games");
const quests = require("../db/quests");
const players = require("../db/players");
const cosmetics = require("../db/cosmetics");
const questsList = require("./quests-list");
const cosmeticsList = require("./cosmetics-list");
const { generateRandomSampleData } = require("./sample-data");

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

    let promises = [];
    for (let questData of questsList) {
      promises.push(quests.addNewQuest(questData));
    }

    await Promise.all(promises);

    console.log("Added quests");
  } catch (error) {
    throw error;
  }
}

async function loadCosmetics() {
  try {
    const loadedQuests = await cosmetics.getAllCosmetics();

    // if (loadedQuests.length > 0) {
    //   console.log("Cosmetics are already loaded");
    //   return;
    // }

    let promises = [];
    for (let cosmeticData of cosmeticsList) {
      const {
        name,
        rarity,
        cost,
        type,
        equip_group,
        entity_name,
      } = cosmeticData;
      promises.push(
        cosmetics.createCosmetic(
          name,
          rarity,
          cost,
          type,
          equip_group,
          entity_name
        )
      );
    }

    await Promise.all(promises);

    console.log("Added cosmetics");
  } catch (error) {
    throw error;
  }
}

async function initPlayers(numGames) {
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

async function initializeAdmins() {
  console.log("Initializing Admins");
  const adminList = [
    "76561198015161808",
    "76561197960956468",
    "76561198030851434",
    "76561198007141460",
    "76561198052211234",
  ];

  try {
    for (let steamID of adminList) {
      await players.setAdmin(steamID, true, 1);
    }
  } catch (error) {
    throw error;
  }
}

(async function() {
  await loadQuests();
  await loadCosmetics();
  await initPlayers();
  await addSampleGames(100);
  await initializeAdmins();
})();
