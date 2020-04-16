const levelTable = [
  {
    level: 1,
    toNextLevel: 1000,
    totalXP: 0,
  },
  {
    level: 2,
    toNextLevel: 1000,
    totalXP: 1000,
  },
  {
    level: 3,
    toNextLevel: 1000,
    totalXP: 2000,
  },
  {
    level: 4,
    toNextLevel: 1000,
    totalXP: 3000,
  },
  {
    level: 5,
    toNextLevel: 1000,
    totalXP: 4000,
  },
  {
    level: 6,
    toNextLevel: 1000,
    totalXP: 5000,
  },
  {
    level: 7,
    toNextLevel: 1000,
    totalXP: 6000,
  },
  {
    level: 8,
    toNextLevel: 1000,
    totalXP: 7000,
  },
  {
    level: 9,
    toNextLevel: 1000,
    totalXP: 8000,
  },
  {
    level: 10,
    toNextLevel: 1100,
    totalXP: 9000,
  },
  {
    level: 11,
    toNextLevel: 1125,
    totalXP: 10100,
  },
  {
    level: 12,
    toNextLevel: 1150,
    totalXP: 11225,
  },
  {
    level: 13,
    toNextLevel: 1175,
    totalXP: 12375,
  },
  {
    level: 14,
    toNextLevel: 1200,
    totalXP: 13550,
  },
  {
    level: 15,
    toNextLevel: 1225,
    totalXP: 14750,
  },
  {
    level: 16,
    toNextLevel: 1250,
    totalXP: 15975,
  },
  {
    level: 17,
    toNextLevel: 1275,
    totalXP: 17225,
  },
  {
    level: 18,
    toNextLevel: 1300,
    totalXP: 18500,
  },
  {
    level: 19,
    toNextLevel: 1325,
    totalXP: 19800,
  },
  {
    level: 20,
    toNextLevel: 1550,
    totalXP: 21125,
  },
  {
    level: 21,
    toNextLevel: 1575,
    totalXP: 22675,
  },
  {
    level: 22,
    toNextLevel: 1600,
    totalXP: 24250,
  },
  {
    level: 23,
    toNextLevel: 1625,
    totalXP: 25850,
  },
  {
    level: 24,
    toNextLevel: 1650,
    totalXP: 27475,
  },
  {
    level: 25,
    toNextLevel: 1675,
    totalXP: 29125,
  },
  {
    level: 26,
    toNextLevel: 1700,
    totalXP: 30800,
  },
  {
    level: 27,
    toNextLevel: 1725,
    totalXP: 32500,
  },
  {
    level: 28,
    toNextLevel: 1750,
    totalXP: 34225,
  },
  {
    level: 29,
    toNextLevel: 1775,
    totalXP: 35975,
  },
  {
    level: 30,
    toNextLevel: 2100,
    totalXP: 37750,
  },
  {
    level: 31,
    toNextLevel: 2125,
    totalXP: 39850,
  },
  {
    level: 32,
    toNextLevel: 2150,
    totalXP: 41975,
  },
  {
    level: 33,
    toNextLevel: 2175,
    totalXP: 44125,
  },
  {
    level: 34,
    toNextLevel: 2200,
    totalXP: 46300,
  },
  {
    level: 35,
    toNextLevel: 2225,
    totalXP: 48500,
  },
  {
    level: 36,
    toNextLevel: 2250,
    totalXP: 50725,
  },
  {
    level: 37,
    toNextLevel: 2275,
    totalXP: 52975,
  },
  {
    level: 38,
    toNextLevel: 2300,
    totalXP: 55250,
  },
  {
    level: 39,
    toNextLevel: 2325,
    totalXP: 57550,
  },
  {
    level: 40,
    toNextLevel: 2750,
    totalXP: 59875,
  },
  {
    level: 41,
    toNextLevel: 2775,
    totalXP: 62625,
  },
  {
    level: 42,
    toNextLevel: 2800,
    totalXP: 65400,
  },
  {
    level: 43,
    toNextLevel: 2825,
    totalXP: 68200,
  },
  {
    level: 44,
    toNextLevel: 2850,
    totalXP: 71025,
  },
  {
    level: 45,
    toNextLevel: 2875,
    totalXP: 73875,
  },
  {
    level: 46,
    toNextLevel: 2900,
    totalXP: 76750,
  },
  {
    level: 47,
    toNextLevel: 2925,
    totalXP: 79650,
  },
  {
    level: 48,
    toNextLevel: 2950,
    totalXP: 82575,
  },
  {
    level: 49,
    toNextLevel: 2975,
    totalXP: 85525,
  },
  {
    level: 50,
    toNextLevel: 3500,
    totalXP: 88500,
  },
  {
    level: 51,
    toNextLevel: 3525,
    totalXP: 92000,
  },
  {
    level: 52,
    toNextLevel: 3550,
    totalXP: 95525,
  },
  {
    level: 53,
    toNextLevel: 3575,
    totalXP: 99075,
  },
  {
    level: 54,
    toNextLevel: 3600,
    totalXP: 102650,
  },
  {
    level: 55,
    toNextLevel: 3625,
    totalXP: 106250,
  },
  {
    level: 56,
    toNextLevel: 3650,
    totalXP: 109875,
  },
  {
    level: 57,
    toNextLevel: 3675,
    totalXP: 113525,
  },
  {
    level: 58,
    toNextLevel: 3700,
    totalXP: 117200,
  },
  {
    level: 59,
    toNextLevel: 3725,
    totalXP: 120900,
  },
  {
    level: 60,
    toNextLevel: 4350,
    totalXP: 124625,
  },
  {
    level: 61,
    toNextLevel: 4375,
    totalXP: 128975,
  },
  {
    level: 62,
    toNextLevel: 4400,
    totalXP: 133350,
  },
  {
    level: 63,
    toNextLevel: 4425,
    totalXP: 137750,
  },
  {
    level: 64,
    toNextLevel: 4450,
    totalXP: 142175,
  },
  {
    level: 65,
    toNextLevel: 4475,
    totalXP: 146625,
  },
  {
    level: 66,
    toNextLevel: 4500,
    totalXP: 151100,
  },
  {
    level: 67,
    toNextLevel: 4525,
    totalXP: 155600,
  },
  {
    level: 68,
    toNextLevel: 4550,
    totalXP: 160125,
  },
  {
    level: 69,
    toNextLevel: 4575,
    totalXP: 164675,
  },
  {
    level: 70,
    toNextLevel: 5300,
    totalXP: 169250,
  },
  {
    level: 71,
    toNextLevel: 5325,
    totalXP: 174550,
  },
  {
    level: 72,
    toNextLevel: 5350,
    totalXP: 179875,
  },
  {
    level: 73,
    toNextLevel: 5375,
    totalXP: 185225,
  },
  {
    level: 74,
    toNextLevel: 5400,
    totalXP: 190600,
  },
  {
    level: 75,
    toNextLevel: 5425,
    totalXP: 196000,
  },
  {
    level: 76,
    toNextLevel: 5450,
    totalXP: 201425,
  },
  {
    level: 77,
    toNextLevel: 5475,
    totalXP: 206875,
  },
  {
    level: 78,
    toNextLevel: 5500,
    totalXP: 212350,
  },
  {
    level: 79,
    toNextLevel: 5525,
    totalXP: 217850,
  },
  {
    level: 80,
    toNextLevel: 6350,
    totalXP: 223375,
  },
  {
    level: 81,
    toNextLevel: 6375,
    totalXP: 229725,
  },
  {
    level: 82,
    toNextLevel: 6400,
    totalXP: 236100,
  },
  {
    level: 83,
    toNextLevel: 6425,
    totalXP: 242500,
  },
  {
    level: 84,
    toNextLevel: 6450,
    totalXP: 248925,
  },
  {
    level: 85,
    toNextLevel: 6475,
    totalXP: 255375,
  },
  {
    level: 86,
    toNextLevel: 6500,
    totalXP: 261850,
  },
  {
    level: 87,
    toNextLevel: 6525,
    totalXP: 268350,
  },
  {
    level: 88,
    toNextLevel: 6550,
    totalXP: 274875,
  },
  {
    level: 89,
    toNextLevel: 6575,
    totalXP: 281425,
  },
  {
    level: 90,
    toNextLevel: 7500,
    totalXP: 288000,
  },
  {
    level: 91,
    toNextLevel: 7525,
    totalXP: 295500,
  },
  {
    level: 92,
    toNextLevel: 7550,
    totalXP: 303025,
  },
  {
    level: 93,
    toNextLevel: 7575,
    totalXP: 310575,
  },
  {
    level: 94,
    toNextLevel: 7600,
    totalXP: 318150,
  },
  {
    level: 95,
    toNextLevel: 7625,
    totalXP: 325750,
  },
  {
    level: 96,
    toNextLevel: 7650,
    totalXP: 333375,
  },
  {
    level: 97,
    toNextLevel: 7675,
    totalXP: 341025,
  },
  {
    level: 98,
    toNextLevel: 7700,
    totalXP: 348700,
  },
  {
    level: 99,
    toNextLevel: 7725,
    totalXP: 356400,
  },
  {
    level: 100,
    toNextLevel: 8000,
    totalXP: 364125,
  },
];

const getLevel = (xp) => {
  if (xp >= 372125) {
    return 101 + Math.floor((xp - 372125) / 8000);
  }

  for (const levelData of levelTable) {
    const { level, totalXP, toNextLevel } = levelData;
    if (xp < totalXP + toNextLevel) {
      console.log(level);
      return level;
    }
  }
};

const getToNextLevel = (xp) => {
  const level = getLevel(xp);
  const { toNextLevel, totalXP } = levelTable.find(
    (levelData) => levelData.level === level
  );

  return {
    progress: xp - totalXP,
    goal: toNextLevel,
  };
};

export { levelTable, getLevel, getToNextLevel };
