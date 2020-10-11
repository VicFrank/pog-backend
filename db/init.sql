DROP TABLE IF EXISTS games CASCADE;
DROP TABLE IF EXISTS game_bans CASCADE;
DROP TABLE IF EXISTS teams CASCADE;
DROP TABLE IF EXISTS players CASCADE;
DROP TABLE IF EXISTS game_players CASCADE;
DROP TABLE IF EXISTS cosmetics CASCADE;
DROP TABLE IF EXISTS player_cosmetics CASCADE;
DROP TABLE IF EXISTS player_companions CASCADE;
DROP TABLE IF EXISTS quests CASCADE;
DROP TABLE IF EXISTS player_quests CASCADE;

CREATE TABLE IF NOT EXISTS games (
  game_id SERIAL PRIMARY KEY,
  radiant_win BOOLEAN,
  ranked BOOLEAN,
  duration INTEGER,
  health_drops INTEGER,
  cheats_enabled BOOLEAN,
  map TEXT DEFAULT '3v3_classic',

  created_at TIMESTAMPTZ DEFAULT Now()
);

DROP INDEX IF EXISTS idx_games_created_at;
CREATE INDEX idx_games_created_at ON games (created_at);

CREATE TABLE IF NOT EXISTS game_bans (
  game_id INTEGER REFERENCES games (game_id) ON UPDATE CASCADE,
  hero TEXT 
);

DROP INDEX IF EXISTS idx_game_bans_game_id;
CREATE INDEX idx_game_bans_game_id ON game_bans (game_id);

CREATE TABLE IF NOT EXISTS teams (
  game_id INTEGER REFERENCES games (game_id) ON UPDATE CASCADE,
  is_radiant BOOLEAN,

  kills INTEGER,
  deaths INTEGER,
  assists INTEGER,

  guardian_kills JSON,
  building_kills JSON,

  CONSTRAINT teams_pkey PRIMARY KEY (game_id, is_radiant)
);

CREATE TABLE IF NOT EXISTS players (
  steam_id TEXT PRIMARY KEY,
  username TEXT,
  mmr INTEGER DEFAULT 2000,
  poggers INTEGER DEFAULT 0 CHECK (poggers >= 0),
  patreon_level INTEGER DEFAULT 0,
  is_admin BOOLEAN DEFAULT FALSE,
  in_tournament BOOLEAN DEFAULT FALSE,

  last_stat_reset TIMESTAMP DEFAULT Now()
);

CREATE TABLE IF NOT EXISTS game_players (
  game_id INTEGER REFERENCES games (game_id) ON UPDATE CASCADE,
  steam_id TEXT REFERENCES players (steam_id) ON UPDATE CASCADE,

  abandoned BOOLEAN,
  is_radiant BOOLEAN,

  hero TEXT,
  ban TEXT,
  available_picks JSON,
  rerolled_heroes JSON,

  hero_damage INTEGER,
  building_damage INTEGER,
  hero_healing INTEGER,
  kills INTEGER,
  deaths INTEGER,
  assists INTEGER,
  last_hits INTEGER,
  denies INTEGER,
  gold INTEGER,
  rampages INTEGER,
  double_kills INTEGER,
  tp_used INTEGER,
  runes_used INTEGER,
  health_drop_duration INTEGER,
  total_gold INTEGER,
  total_exp INTEGER,
  hero_level INTEGER,

  xp_earned INTEGER DEFAULT 0,
  mmr_change INTEGER DEFAULT 0,

  abilities JSON,
  permanent_buffs JSON,
  disconnects JSON,
  item_purchases JSON,

  item_0 TEXT,
  item_1 TEXT,
  item_2 TEXT,
  item_3 TEXT,
  item_4 TEXT,
  item_5 TEXT,
  backpack_0 TEXT,
  backpack_1 TEXT,
  backpack_2 TEXT,
  backpack_3 TEXT,

  CONSTRAINT game_players_pkey PRIMARY KEY (game_id, steam_id)
);

CREATE TABLE IF NOT EXISTS cosmetics (
  cosmetic_id TEXT PRIMARY KEY,
  cosmetic_type TEXT,
  equip_group TEXT,
  cost INTEGER,
  rarity TEXT,
  min_bp_tier INTEGER DEFAULT 0
);

DROP TABLE IF EXISTS item_prices;
CREATE TABLE IF NOT EXISTS item_prices (
  item_id TEXT PRIMARY KEY,
  cost_usd DECIMAL NOT NULL,
  item_type TEXT,
  reward INTEGER
);

CREATE TABLE IF NOT EXISTS player_companions (
  companion_id SERIAL PRIMARY KEY,
  cosmetic_id TEXT NOT NULL REFERENCES cosmetics (cosmetic_id) ON UPDATE CASCADE,
  steam_id TEXT REFERENCES players (steam_id) ON UPDATE CASCADE,
  companion_level INTEGER DEFAULT 0,
  equipped BOOLEAN DEFAULT FALSE,
  effect INTEGER DEFAULT -1
);

DROP INDEX IF EXISTS idx_player_companions;
CREATE INDEX idx_player_companions
ON player_companions (steam_id, cosmetic_id, companion_level, effect);

CREATE TABLE IF NOT EXISTS player_cosmetics (
  cosmetic_id TEXT REFERENCES cosmetics (cosmetic_id) ON UPDATE CASCADE,
  steam_id TEXT REFERENCES players (steam_id) ON UPDATE CASCADE,
  created TIMESTAMP DEFAULT Now(),
  equipped BOOLEAN DEFAULT FALSE
);

DROP TABLE IF EXISTS battle_pass_levels CASCADE;
CREATE TABLE IF NOT EXISTS battle_pass_levels (
  bp_version INTEGER DEFAULT 1,
  bp_level INTEGER NOT NULL,
  next_level_xp INTEGER NOT NULL,
  total_xp INTEGER NOT NULL,
  cosmetic_id TEXT REFERENCES cosmetics (cosmetic_id),
  chest INTEGER,
  chest_amount INTEGER,

  CONSTRAINT battle_pass_levels_pkey PRIMARY KEY (bp_version, bp_level)
);

DROP TABLE IF EXISTS player_battle_pass CASCADE;
CREATE TABLE IF NOT EXISTS player_battle_pass (
  steam_id TEXT REFERENCES players (steam_id) ON UPDATE CASCADE,
  bp_version INTEGER DEFAULT 1,
  bp_level INTEGER DEFAULT 0,
  total_experience INTEGER DEFAULT 0,
  tier INTEGER DEFAULT 0,
  upgrade_expiration TIMESTAMP
);

CREATE OR REPLACE FUNCTION create_battle_pass()
  RETURNS trigger AS
$$
BEGIN
  INSERT INTO player_battle_pass(steam_id)
  VALUES(NEW.steam_id);

RETURN NEW;
END;
$$
LANGUAGE 'plpgsql';

ALTER TABLE player_battle_pass
ADD COLUMN tier1_expiration TIMESTAMP DEFAULT NOW(),
ADD COLUMN tier2_expiration TIMESTAMP DEFAULT NOW(),
ADD COLUMN tier3_expiration TIMESTAMP DEFAULT NOW();

UPDATE player_battle_pass
SET tier1_expiration = upgrade_expiration
WHERE tier = 1;

UPDATE player_battle_pass
SET tier2_expiration = upgrade_expiration
WHERE tier = 2;

CREATE TRIGGER create_player_trigger
AFTER INSERT
ON players
FOR EACH ROW
EXECUTE PROCEDURE create_battle_pass();

CREATE TABLE IF NOT EXISTS quests (
  quest_id SERIAL PRIMARY KEY,
  quest_name TEXT NOT NULL,
  is_achievement BOOLEAN NOT NULL,
  is_weekly BOOLEAN DEFAULT FALSE,
  quest_description TEXT,
  title_reward TEXT,
  poggers_reward INTEGER DEFAULT 0,
  xp_reward INTEGER DEFAULT 0,
  stat TEXT NOT NULL,
  required_amount INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS player_quests (
  steam_id TEXT REFERENCES players (steam_id) ON UPDATE CASCADE,
  quest_id INTEGER REFERENCES quests (quest_id) ON UPDATE CASCADE,
  quest_progress INTEGER DEFAULT 0,
  created TIMESTAMP DEFAULT Now(),
  claimed BOOLEAN DEFAULT FALSE,
  quest_index INTEGER,

  CONSTRAINT player_quests_pkey PRIMARY KEY (steam_id, quest_id)
);

DROP TABLE IF EXISTS chest_item_rewards;
CREATE TABLE IF NOT EXISTS chest_item_rewards (
  cosmetic_id TEXT REFERENCES cosmetics (cosmetic_id),
  reward_rarity TEXT NOT NULL,
  reward_odds INTEGER NOT NULL,

  CONSTRAINT chest_item_rewards_pkey PRIMARY KEY (cosmetic_id, reward_rarity)
);

DROP TABLE IF EXISTS chest_pogger_rewards;
CREATE TABLE IF NOT EXISTS chest_pogger_rewards (
  cosmetic_id TEXT REFERENCES cosmetics (cosmetic_id),
  cum_sum INTEGER NOT NULL,
  poggers INTEGER NOT NULL,

  CONSTRAINT chest_pogger_rewards_pkey PRIMARY KEY (cosmetic_id, cum_sum)
);

DROP TABLE IF EXISTS chest_bonus_rewards;
CREATE TABLE IF NOT EXISTS chest_bonus_rewards (
  cosmetic_id TEXT REFERENCES cosmetics (cosmetic_id),
  cum_sum INTEGER NOT NULL,
  reward_id TEXT REFERENCES cosmetics (cosmetic_id),

  CONSTRAINT chest_bonus_rewards_pkey PRIMARY KEY (cosmetic_id, cum_sum)
);

DROP TABLE IF EXISTS player_logs;
CREATE TABLE IF NOT EXISTS player_logs (
  steam_id TEXT REFERENCES players (steam_id) ON UPDATE CASCADE,
  log_event TEXT NOT NULL,
  log_data JSON,
  log_time TIMESTAMPTZ DEFAULT Now()
);

DROP INDEX IF EXISTS idx_player_logs_steam_id;
CREATE INDEX idx_player_logs_steam_id ON player_logs (steam_id);

DROP TABLE IF EXISTS polls;
CREATE TABLE IF NOT EXISTS polls (
  poll_id SERIAL PRIMARY KEY,
  poll_name TEXT,
  poll_description TEXT
);

DROP TABLE IF EXISTS poll_options;
CREATE TABLE IF NOT EXISTS poll_options (
  option_id SERIAL UNIQUE NOT NULL,
  poll_id INTEGER REFERENCES polls (poll_id),
  option_text TEXT NOT NULL,
  votes INTEGER default 0,

  CONSTRAINT poll_options_pkey PRIMARY KEY (poll_id, option_id)
);

DROP TABLE IF EXISTS votes;
CREATE TABLE IF NOT EXISTS votes (
  poll_id INTEGER REFERENCES polls (poll_id),
  steam_id TEXT REFERENCES players (steam_id),
  vote INTEGER REFERENCES poll_options (option_id),

  CONSTRAINT vote_pkey PRIMARY KEY (poll_id, steam_id)
);

DROP TABLE IF EXISTS player_subscriptions;
CREATE TABLE IF NOT EXISTS player_subscriptions (
  steam_id TEXT REFERENCES players (steam_id),
  client TEXT,
  customer_id TEXT,
  subscription_status TEXT
);