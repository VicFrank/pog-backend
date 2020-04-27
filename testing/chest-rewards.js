const dropOdds = {
  chest1: [
    {
      rarity: "Common",
      odds: 100,
    },
    {
      rarity: "Uncommon",
      odds: 30,
    },
    {
      rarity: "Rare",
      odds: 3,
    },
    {
      rarity: "Mythical",
      odds: 0,
    },
    {
      rarity: "Legendary",
      odds: 0,
    },
  ],
  chest2: [
    {
      rarity: "Common",
      odds: 50,
    },
    {
      rarity: "Uncommon",
      odds: 100,
    },
    {
      rarity: "Rare",
      odds: 25,
    },
    {
      rarity: "Mythical",
      odds: 3,
    },
    {
      rarity: "Legendary",
      odds: 0,
    },
  ],
  chest3: [
    {
      rarity: "Common",
      odds: 0,
    },
    {
      rarity: "Uncommon",
      odds: 0,
    },
    {
      rarity: "Rare",
      odds: 100,
    },
    {
      rarity: "Mythical",
      odds: 20,
    },
    {
      rarity: "Legendary",
      odds: 3,
    },
  ],
  chest4: [
    {
      rarity: "Common",
      odds: 0,
    },
    {
      rarity: "Uncommon",
      odds: 0,
    },
    {
      rarity: "Rare",
      odds: 0,
    },
    {
      rarity: "Mythical",
      odds: 125,
    },
    {
      rarity: "Legendary",
      odds: 15,
    },
  ],
  chest5: [
    {
      rarity: "Common",
      odds: 0,
    },
    {
      rarity: "Uncommon",
      odds: 0,
    },
    {
      rarity: "Rare",
      odds: 0,
    },
    {
      rarity: "Mythical",
      odds: 50,
    },
    {
      rarity: "Legendary",
      odds: 125,
    },
  ],
};

const poggerOdds = {
  chest1: [
    {
      cumSum: 1,
      poggers: 150,
    },
    {
      cumSum: 10,
      poggers: 50,
    },
    {
      cumSum: 45,
      poggers: 10,
    },
    {
      cumSum: 100,
      poggers: 5,
    },
  ],
  chest2: [
    {
      cumSum: 1,
      poggers: 300,
    },
    {
      cumSum: 10,
      poggers: 100,
    },
    {
      cumSum: 45,
      poggers: 20,
    },
    {
      cumSum: 100,
      poggers: 10,
    },
  ],
  chest3: [
    {
      cumSum: 1,
      poggers: 600,
    },
    {
      cumSum: 10,
      poggers: 225,
    },
    {
      cumSum: 45,
      poggers: 50,
    },
    {
      cumSum: 100,
      poggers: 25,
    },
  ],
  chest4: [
    {
      cumSum: 1,
      poggers: 1500,
    },
    {
      cumSum: 10,
      poggers: 500,
    },
    {
      cumSum: 45,
      poggers: 125,
    },
    {
      cumSum: 100,
      poggers: 60,
    },
  ],
  chest5: [
    {
      cumSum: 1,
      poggers: 3000,
    },
    {
      cumSum: 10,
      poggers: 1000,
    },
    {
      cumSum: 45,
      poggers: 200,
    },
    {
      cumSum: 100,
      poggers: 150,
    },
  ],
};

const bonusOdds = {
  chest1: [
    {
      cumSum: 1,
      reward: "xp_coupon_2000",
    },
    {
      cumSum: 5,
      reward: "xp_coupon_1000",
    },
    {
      cumSum: 20,
      reward: "xp_coupon_500",
    },
  ],
  chest2: [
    {
      cumSum: 1,
      reward: "xp_coupon_5000",
    },
    {
      cumSum: 5,
      reward: "xp_coupon_2000",
    },
    {
      cumSum: 20,
      reward: "xp_coupon_1000",
    },
  ],
  chest3: [
    {
      cumSum: 1,
      reward: "xp_coupon_10000",
    },
    {
      cumSum: 5,
      reward: "xp_coupon_5000",
    },
    {
      cumSum: 20,
      reward: "xp_coupon_2000",
    },
  ],
  chest4: [
    {
      cumSum: 1,
      reward: "xp_coupon_25000",
    },
    {
      cumSum: 5,
      reward: "xp_coupon_10000",
    },
    {
      cumSum: 20,
      reward: "xp_coupon_5000",
    },
  ],
  chest5: [
    {
      cumSum: 1,
      reward: "icefrog",
    },
    {
      cumSum: 5,
      reward: "xp_coupon_25000",
    },
    {
      cumSum: 20,
      reward: "xp_coupon_10000",
    },
  ],
};

module.exports = {
  dropOdds,
  poggerOdds,
  bonusOdds,
};
