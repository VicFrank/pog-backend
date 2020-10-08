const games = require("../db/games");
const quests = require("../db/quests");
const players = require("../db/players");
const itemPrices = require("./item-prices");
const questsList = require("./quests-list");
const cosmetics = require("../db/cosmetics");
const cosmeticsList = require("./cosmetics-list");
const battlePassRewards = require("./battle-pass-rewards");
const {
  generateRandomSampleData,
  realSample,
  testSample,
} = require("./sample-data");
const { dropOdds, poggerOdds, bonusOdds } = require("./chest-rewards");

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

async function loadNewQuests(newQuests) {
  try {
    console.log("Adding New Quests...");

    let promises = [];
    for (let questData of newQuests) {
      promises.push(quests.addNewQuest(questData));
    }

    await Promise.all(promises);
  } catch (error) {
    throw error;
  }
}

async function addQuest(quest) {
  console.log("Adding Quest");
  quests.addNewQuest(quest);
}

async function deleteQuests(questsList) {
  try {
    console.log("Deleting Quests...");

    let promises = [];
    for (let questData of questsList) {
      promises.push(quests.removeQuest(questData));
    }

    await Promise.all(promises);
  } catch (error) {
    throw error;
  }
}

async function addQuest(quest) {
  console.log("Adding Quest");
  quests.addNewQuest(quest);
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
      const {
        cost,
        cosmetic_id,
        rarity,
        type,
        equip_group,
        bp_tier,
      } = cosmeticData;
      promises.push(
        cosmetics.createCosmetic(
          cost,
          cosmetic_id,
          rarity,
          type,
          equip_group,
          bp_tier
        )
      );
    }

    await Promise.all(promises);
  } catch (error) {
    throw error;
  }
}

async function loadItemPrices() {
  try {
    const loadedItemPrices = await cosmetics.getItemPrices();

    if (loadedItemPrices.length > 0) {
      console.log("Cosmetics are already loaded");
      return;
    }

    console.log("Adding Item Prices...");

    let promises = [];
    for (let itemPrice of itemPrices) {
      const { cost_usd, item_id, type, reward } = itemPrice;
      promises.push(cosmetics.createItemPrice(cost_usd, item_id, type, reward));
    }

    await Promise.all(promises);
  } catch (error) {
    throw error;
  }
}

async function loadNewCosmetics(newCosmetics) {
  try {
    console.log("Adding New cosmetics...");

    let promises = [];
    for (let cosmeticData of newCosmetics) {
      const {
        cost,
        cosmetic_id,
        rarity,
        type,
        equip_group,
        bp_tier,
      } = cosmeticData;
      promises.push(
        cosmetics.createCosmetic(
          cost,
          cosmetic_id,
          rarity,
          type,
          equip_group,
          bp_tier
        )
      );
    }

    await Promise.all(promises);
  } catch (error) {
    throw error;
  }
}

async function loadChestRewards() {
  try {
    const loadedRewards = await cosmetics.getAllChestRewards();

    if (loadedRewards.length > 0) {
      console.log("Chest Rewards are already loaded");
      return;
    }

    console.log("Adding Chest Rewards...");

    let promises = [];
    for (let [chestID, chestRewards] of Object.entries(dropOdds)) {
      for (let reward of chestRewards) {
        const { rarity, odds } = reward;
        promises.push(cosmetics.addChestItemReward(chestID, rarity, odds));
      }
    }
    for (let [chestID, chestRewards] of Object.entries(poggerOdds)) {
      for (let reward of chestRewards) {
        const { cumSum, poggers } = reward;
        promises.push(
          cosmetics.addChestPoggersReward(chestID, poggers, cumSum)
        );
      }
    }
    for (let [chestID, chestRewards] of Object.entries(bonusOdds)) {
      for (let bonusReward of chestRewards) {
        const { cumSum, reward } = bonusReward;
        promises.push(cosmetics.addChestBonusReward(chestID, reward, cumSum));
      }
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
      const {
        level,
        cosmetic_id,
        chest_type,
        chest_amount,
        next_level_xp,
        total_xp,
      } = rewards;
      promises.push(
        cosmetics.createBattlePassLevel(
          level,
          cosmetic_id,
          chest_type,
          chest_amount,
          next_level_xp,
          total_xp
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
    // "76561198015161808",
    "76561197960956468",
    "76561198030851434",
    "76561198007141460",
    // "76561198052211234",
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
  // await loadChestRewards();
  // await loadBattlePass();
  // await loadItemPrices();
  // await initPlayers();
  // await addSampleGames(10);
  // await initializeAdmins();
  // await addRealSample();

  const vips = [
    "76561198054705495",
    "76561198010267417",
    "76561198030851434",
    "76561197983098727",
    "76561197997664905",
    "76561197960956468",
  ];

  for (let steamID of vips) {
    await players.createInitialWeeklyQuests(steamID, 3);
  }
})();
