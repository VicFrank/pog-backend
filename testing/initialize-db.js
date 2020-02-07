const games = require("../db/games");
const quests = require("../db/quests");
const players = require("../db/players");
const questsList = require("./quests-list");
const { generateRandomSampleData } = require("./sample-data");

/*
  Initializes the database with the daily quests/achievements
*/
async function loadQuests() {
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
}

async function addSampleGames(numGames) {
  let promises = [];
  for (let i = 0; i < numGames; i++) {
    promises.push(games.create(generateRandomSampleData()));
  }

  await Promise.all(promises);

  console.log(`Added ${numGames} sample games`);
}

async function initializeAdmins() {
  const adminList = [
    "76561198015161808",
    "76561198007141460",
    "76561198079741620",
    "76561198030851434",
  ];

  for (let steamID of adminList) {
    await players.setAdmin(steamID, true, 1);
  }
}

(async function() {
  await loadQuests();
  await addSampleGames(10);
  await initializeAdmins();
})();
