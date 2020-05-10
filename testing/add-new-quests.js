const { query } = require("../db/index");
const quests = require("../db/quests");

const newQuests = [
  {
    isAchievement: false,
    name: "Pick up %x% Runes",
    description: "",
    poggers: 0,
    xp: 100,
    stat: "runes_picked_up",
    requiredAmount: 6,
  },
  {
    isAchievement: false,
    name: "Buy %x% Neutral Items",
    description: "",
    poggers: 0,
    xp: 100,
    stat: "neutral_item_purchased",
    requiredAmount: 3,
  },
  {
    isAchievement: false,
    name: "Kill %x% Guardians",
    description: "",
    poggers: 0,
    xp: 150,
    stat: "guardians_killed",
    requiredAmount: 4,
  },
  {
    isAchievement: false,
    name: "Kill %x% creeps",
    description: "",
    poggers: 0,
    xp: 150,
    stat: "creeps_killed",
    requiredAmount: 400,
  },
  {
    isAchievement: false,
    name: "Get %x% Assists",
    description: "",
    poggers: 0,
    xp: 100,
    stat: "assists",
    requiredAmount: 20,
  },
  {
    isAchievement: false,
    name: "Get %x% Assists",
    description: "",
    poggers: 0,
    xp: 150,
    stat: "assists",
    requiredAmount: 40,
  },
  {
    isAchievement: false,
    name: "Earn %x% Gold",
    description: "",
    poggers: 0,
    xp: 100,
    stat: "gold_earned",
    requiredAmount: 40000,
  },
  {
    isAchievement: false,
    name: "Earn %x% Gold",
    description: "",
    poggers: 0,
    xp: 150,
    stat: "gold_earned",
    requiredAmount: 80000,
  },
  {
    isAchievement: false,
    name: "Deny %x% Creeps",
    description: "",
    poggers: 0,
    xp: 100,
    stat: "denies",
    requiredAmount: 10,
  },
  {
    isAchievement: false,
    name: "Deny %x% Creeps",
    description: "",
    poggers: 0,
    xp: 150,
    stat: "denies",
    requiredAmount: 20,
  },
  {
    isAchievement: false,
    name: "Get a Rampage",
    description: "",
    poggers: 0,
    xp: 150,
    stat: "rampages",
    requiredAmount: 1,
  },
  {
    isAchievement: false,
    name: "Deal %x% Building Damage",
    description: "",
    poggers: 0,
    xp: 100,
    stat: "building_damage",
    requiredAmount: 5000,
  },
  {
    isAchievement: false,
    name: "Deal %x% Building Damage",
    description: "",
    poggers: 0,
    xp: 150,
    stat: "building_damage",
    requiredAmount: 10000,
  },
  {
    isAchievement: false,
    name: "Reach Level 30",
    description: "",
    poggers: 0,
    xp: 100,
    stat: "max_level",
    requiredAmount: 1,
  },
  {
    isAchievement: false,
    name: "Reach Level 30 twice",
    description: "",
    poggers: 0,
    xp: 150,
    stat: "max_level",
    requiredAmount: 2,
  },
  {
    isAchievement: false,
    name: "Kill %x% heroes",
    description: "",
    poggers: 0,
    xp: 100,
    stat: "hero_kills",
    requiredAmount: 7,
  },
  {
    isAchievement: false,
    name: "Kill %x% heroes",
    description: "",
    poggers: 0,
    xp: 150,
    stat: "hero_kills",
    requiredAmount: 15,
  },
];

const updateQuests = [
  {
    isAchievement: false,
    name: "Pick up %x% Runes",
    description: "",
    poggers: 0,
    xp: 100,
    stat: "runes_picked_up",
    requiredAmount: 3, // 5 -> 3
  },
  {
    isAchievement: false,
    name: "Buy %x% Neutral Items",
    description: "",
    poggers: 0,
    xp: 150,
    stat: "neutral_item_purchased",
    requiredAmount: 6, // 3 -> 6
  },
  {
    isAchievement: false,
    name: "Win %x% Games",
    description: "",
    poggers: 0,
    xp: 100, // 150 -> 100
    stat: "games_won",
    requiredAmount: 2,
  },
  {
    isAchievement: false,
    name: "Deal %x% damage to Heroes",
    description: "",
    poggers: 0,
    xp: 100,
    stat: "damage_dealt", // same
    requiredAmount: 30000,
  },
  {
    isAchievement: false,
    name: "Kill %x% Guardians", // change name
    description: "",
    poggers: 0,
    xp: 100,
    stat: "guardians_killed",
    requiredAmount: 2, // 1 -> 2
  },
  {
    isAchievement: false,
    name: "Buy Nokrah's Blade",
    description: "",
    poggers: 0,
    xp: 100,
    stat: "nokrah_purchased", // same
    requiredAmount: 1,
  },
  {
    isAchievement: false,
    name: "Kill %x% creeps",
    description: "",
    poggers: 0,
    xp: 100,
    stat: "creeps_killed", // same
    requiredAmount: 200,
  },
];

async function UpdateExistingQuests() {
  try {
    console.log("Updating Quests...");

    for (let questData of updateQuests) {
      const sql_query = `
      UPDATE quests
      SET (quest_name, poggers_reward, xp_reward, required_amount) =
      ($1, $2, $3, $4)
      WHERE stat = $5 AND is_achievement = FALSE
      RETURNING *
      `;
      const { name, poggers, xp, stat, requiredAmount } = questData;
      const args = [name, poggers, xp, requiredAmount, stat];
      console.log(`updating quest ${stat}`);
      const { rows } = await query(sql_query, args);
      console.log(rows[0]);
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function AddNewQuests() {
  try {
    console.log("Adding new quests...");

    let promises = [];
    for (let questData of newQuests) {
      promises.push(quests.addNewQuest(questData));
    }

    await Promise.all(promises);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

(async function () {
  await UpdateExistingQuests();
  await AddNewQuests();
})();
