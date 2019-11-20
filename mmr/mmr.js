const GetEloProbability = (winnerRating, loserRating) => {
  probablity =
    (1.0 * 1.0) /
    (1 + 1.0 * Math.pow(10, (1.0 * (loserRating - winnerRating)) / 400));
  return probablity;
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
