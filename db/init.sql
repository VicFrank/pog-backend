DROP TABLE IF EXISTS games CASCADE;
DROP TABLE IF EXISTS game_bans CASCADE;
DROP TABLE IF EXISTS teams CASCADE;
DROP TABLE IF EXISTS players CASCADE;
DROP TABLE IF EXISTS game_players CASCADE;
DROP TABLE IF EXISTS player_cosmetics CASCADE;

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
  bp_level INTEGER DEFAULT 0,
  currency INTEGER DEFAULT 0,
  patreon_level INTEGER DEFAULT 0
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

  item_0 TEXT,
  item_1 TEXT,
  item_2 TEXT,
  item_3 TEXT,
  item_4 TEXT,
  item_5 TEXT,
  backpack_0 TEXT,
  backpack_1 TEXT,
  backpack_2 TEXT,

  CONSTRAINT game_players_pkey PRIMARY KEY (game_id, steam_id)
);

CREATE TABLE IF NOT EXISTS player_cosmetics (
  steam_id TEXT REFERENCES players (steam_id) ON UPDATE CASCADE,
  name TEXT,
  owned INTEGER
);