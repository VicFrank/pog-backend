DROP TABLE IF EXISTS games CASCADE;
DROP TABLE IF EXISTS game_bans CASCADE;
DROP TABLE IF EXISTS teams CASCADE;
DROP TABLE IF EXISTS players CASCADE;
DROP TABLE IF EXISTS game_players CASCADE;
DROP TABLE IF EXISTS player_cosmetics CASCADE;
DROP TABLE IF EXISTS player_companions CASCADE;
DROP TABLE IF EXISTS player_battle_pass CASCADE;

CREATE TABLE IF NOT EXISTS games (
  game_id SERIAL PRIMARY KEY,
  radiant_win BOOLEAN,
  ranked BOOLEAN,
  duration INTEGER,
  health_drops INTEGER,
  cheats_enabled BOOLEAN,

  created_at TIMESTAMPTZ DEFAULT Now()
);

CREATE TABLE IF NOT EXISTS game_bans (
  game_id INTEGER REFERENCES games (game_id) ON UPDATE CASCADE,
  hero TEXT 
);

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
  mmr INTEGER DEFAULT 1000,
  poggers INTEGER DEFAULT 0 CHECK (poggers >= 0),
  patreon_level INTEGER DEFAULT 0,

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

CREATE TABLE IF NOT EXISTS player_companions (
  companion_id SERIAL PRIMARY KEY,
  steam_id TEXT REFERENCES players (steam_id) ON UPDATE CASCADE,
  companion_name TEXT,
  companion_level INTEGER DEFAULT 0,
  equipped BOOLEAN DEFAULT FALSE,
  effect INTEGER DEFAULT -1
);

CREATE TABLE IF NOT EXISTS player_cosmetics (
  cosmetic_id SERIAL PRIMARY KEY,
  steam_id TEXT REFERENCES players (steam_id) ON UPDATE CASCADE,
  cosmetic_name TEXT,
  equipped BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS player_battle_pass (
  steam_id TEXT REFERENCES players (steam_id) ON UPDATE CASCADE,
  bp_name TEXT,
  bp_level INTEGER DEFAULT 0,
  points INTEGER DEFAULT 0,

  CONSTRAINT player_battle_pass_pkey PRIMARY KEY (steam_id, bp_name)
);