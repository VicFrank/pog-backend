const GetEloProbability = (winnerRating, loserRating) => {
  probability = 1.0 / (1 + Math.pow(10, (loserRating - winnerRating) / 400));
  return probability;
};

const GetEloRatingChange = (winnerRank, loserRank, K = 50) => {
  const Pa = GetEloProbability(winnerRank, loserRank);
  const ratingChange = Math.floor(K * (1 - Pa), 1);

  // Always return at least some mmr change
  if (ratingChange === 0) return 1;

  return ratingChange;
};

module.exports = {
  GetEloRatingChange,
};
