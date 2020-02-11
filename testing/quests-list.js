module.exports = [
  // Daily Quests
  {
    isAchievement: false,
    name: "Pick up %x% Runes",
    description: "",
    poggers: 0,
    xp: 100,
    stat: "runes_picked_up",
    requiredAmount: 5,
  },
  {
    isAchievement: false,
    name: "Buy %x% Neutral Items",
    description: "",
    poggers: 0,
    xp: 150,
    stat: "neutral_item_purchased",
    requiredAmount: 3,
  },
  {
    isAchievement: false,
    name: "Win %x% Games",
    description: "",
    poggers: 0,
    xp: 150,
    stat: "games_won",
    requiredAmount: 2,
  },
  {
    isAchievement: false,
    name: "Deal %x% damage to Heroes",
    description: "",
    poggers: 0,
    xp: 100,
    stat: "damage_dealt",
    requiredAmount: 30000,
  },
  {
    isAchievement: false,
    name: "Kill a Guardian",
    description: "",
    poggers: 0,
    xp: 100,
    stat: "guardians_killed",
    requiredAmount: 1,
  },
  {
    isAchievement: false,
    name: "Buy Nokrah's Blade",
    description: "",
    poggers: 0,
    xp: 100,
    stat: "nokrah_purchased",
    requiredAmount: 1,
  },
  {
    isAchievement: false,
    name: "Kill %x% creeps",
    description: "",
    poggers: 0,
    xp: 100,
    stat: "creeps_killed",
    requiredAmount: 200,
  },
  // Achievements
  {
    isAchievement: true,
    name: "Hero of the Path",
    title: "Hero",
    description: "Win %x% games",
    xp: 2000,
    poggers: 125,
    stat: "games_won",
    requiredAmount: 100,
  },
  {
    isAchievement: true,
    name: "Guardian of the Path",
    title: "Guardian",
    description: "Win %x% games",
    xp: 7500,
    poggers: 350,
    stat: "games_won",
    requiredAmount: 1000,
  },
  {
    isAchievement: true,
    name: "I like big items and I cannot lie",
    title: "Farmer",
    description: "Earn a total of %x% gold",
    xp: 500,
    poggers: 30,
    stat: "gold_earned",
    requiredAmount: 100000,
  },
  {
    isAchievement: true,
    name: "Who wants to be a millionaire?",
    title: "Millionaire",
    description: "Earn a total of %x% gold",
    xp: 2000,
    poggers: 125,
    stat: "gold_earned",
    requiredAmount: 1000000,
  },
  {
    isAchievement: true,
    name: "Butchering in Style",
    title: "The Butcher",
    description: "Get %x% Rampages",
    xp: 750,
    poggers: 77,
    stat: "rampages",
    requiredAmount: 7,
  },
  {
    isAchievement: true,
    name: "Terminator of Teamfights",
    title: "The Terminator",
    description: "Get %x% Rampages",
    xp: 2500,
    poggers: 177,
    stat: "rampages",
    requiredAmount: 77,
  },
  {
    isAchievement: true,
    name: "Fear the Reaper",
    title: "The Reaper",
    description: "Get %x% Rampages",
    xp: 10000,
    poggers: 777,
    stat: "rampages",
    requiredAmount: 777,
  },
  {
    isAchievement: true,
    name: "On the (Lifeless) Shoulders of Giants",
    title: "Giantkiller",
    description: "Kill %x% Guardians with your team",
    xp: 500,
    poggers: 30,
    stat: "guardians_killed",
    requiredAmount: 25,
  },
  {
    isAchievement: true,
    name: "Titanomachia",
    title: "Titanbreaker",
    description: "Kill %x% Guardians with your team",
    xp: 2000,
    poggers: 125,
    stat: "guardians_killed",
    requiredAmount: 250,
  },
  {
    isAchievement: true,
    name: "Who Guards the Guardians?",
    title: "Godslayer",
    description: "Kill %x% Guardians with your team",
    xp: 7500,
    poggers: 350,
    stat: "guardians_killed",
    requiredAmount: 2500,
  },
  {
    isAchievement: true,
    name: "The Good Stuff",
    title: "Big Drinker",
    description: "Benefit from %x% healing goblets",
    xp: 500,
    poggers: 30,
    stat: "healing_goblets",
    requiredAmount: 100,
  },
  {
    isAchievement: true,
    name: "You Only Live Forever",
    title: "The Immortal",
    description: "Benefit from %x% healing goblets",
    xp: 2000,
    poggers: 125,
    stat: "healing_goblets",
    requiredAmount: 1000,
  },
  {
    isAchievement: true,
    name: "Drink Deep the Goblet of Life",
    title: "The Eternal",
    description: "Benefit from %x% healing goblets",
    xp: 7500,
    poggers: 350,
    stat: "healing_goblets",
    requiredAmount: 10000,
  },
  {
    isAchievement: true,
    name: "I got the Healing Touch",
    title: "Healer",
    description: "Provide a total of %x% healing to allied heroes",
    xp: 750,
    poggers: 30,
    stat: "total_healed",
    requiredAmount: 200000,
  },
  {
    isAchievement: true,
    name: "A Sawbones to remember",
    title: "Battle Medic",
    description: "Provide a total of %x% healing to allied heroes",
    xp: 2500,
    poggers: 125,
    stat: "total_healed",
    requiredAmount: 2000000,
  },
  {
    isAchievement: true,
    name: "Battlefield Angel",
    title: "Angel of Life",
    description: "Provide a total of %x% healing to allied heroes",
    xp: 10000,
    poggers: 350,
    stat: "total_healed",
    requiredAmount: 20000000,
  },
  {
    isAchievement: true,
    name: "Improvise, Adapt, Overcome",
    title: "The Strategist",
    description: "Benefit from Guardian buffs %x% times",
    xp: 750,
    poggers: 30,
    stat: "guardian_buffs_received",
    requiredAmount: 20,
  },
  {
    isAchievement: true,
    name: "The Art of War",
    title: "Master Tactician",
    description: "Benefit from Guardian buffs %x% times",
    xp: 2500,
    poggers: 125,
    stat: "guardian_buffs_received",
    requiredAmount: 200,
  },
  {
    isAchievement: true,
    name: "Mastering 4D Chess",
    title: "200 IQ",
    description: "Benefit from Guardian buffs %x% times",
    xp: 10000,
    poggers: 350,
    stat: "guardian_buffs_received",
    requiredAmount: 2000,
  },
  {
    isAchievement: true,
    name: "Level Up",
    title: "",
    description: "Reach max level %x% times",
    xp: 750,
    poggers: 30,
    stat: "max_level",
    requiredAmount: 10,
  },
  {
    isAchievement: true,
    name: "Level Up",
    title: "",
    description: "Reach max level %x% times",
    xp: 2500,
    poggers: 125,
    stat: "max_level",
    requiredAmount: 100,
  },
  {
    isAchievement: true,
    name: "Level Up",
    title: "",
    description: "Reach max level %x% times",
    xp: 10000,
    poggers: 350,
    stat: "max_level",
    requiredAmount: 1000,
  },
  {
    isAchievement: true,
    name: "Slaughterhouse One",
    title: "Vonnegut",
    description: "Deal a total of %x% building damage",
    xp: 750,
    poggers: 30,
    stat: "building_damage",
    requiredAmount: 250000,
  },
  {
    isAchievement: true,
    name: "To Crush your Enemies",
    title: "Vonnegutter",
    description: "Deal a total of %x% building damage",
    xp: 2500,
    poggers: 125,
    stat: "building_damage",
    requiredAmount: 2500000,
  },
  {
    isAchievement: true,
    name: "Building Damage",
    title: "Vonnegot",
    description: "Deal a total of %x% building damage",
    xp: 10000,
    poggers: 350,
    stat: "building_damage",
    requiredAmount: 25000000,
  },
  {
    isAchievement: true,
    name: "Open Chests",
    title: "Relic Seeker",
    description: "Open a total of %x% chests",
    xp: 1000,
    poggers: 88,
    stat: "chests_opened",
    requiredAmount: 8,
  },
  {
    isAchievement: true,
    name: "Open Chests",
    title: "Treasure Hunter",
    description: "Open a total of %x% chests",
    xp: 5000,
    poggers: 188,
    stat: "chests_opened",
    requiredAmount: 88,
  },
  {
    isAchievement: true,
    name: "Open Chests",
    title: "Chest Opener",
    description: "Open a total of %x% chests",
    xp: 15000,
    poggers: 888,
    stat: "chests_opened",
    requiredAmount: 888,
  },
  {
    isAchievement: true,
    name: "High Five",
    title: "",
    description: "High Five a total of %x% players",
    xp: 500,
    poggers: 30,
    stat: "high_fives",
    requiredAmount: 25,
  },
  {
    isAchievement: true,
    name: "High Five",
    title: "",
    description: "High Five a total of %x% players",
    xp: 2000,
    poggers: 125,
    stat: "high_fives",
    requiredAmount: 200,
  },
  {
    isAchievement: true,
    name: "High Five",
    title: "",
    description: "High Five a total of %x% players",
    xp: 5000,
    poggers: 350,
    stat: "high_fives",
    requiredAmount: 1000,
  },
];
