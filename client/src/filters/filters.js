import moment from "moment";

const translationMap = {
  npc_dota_hero_none: "--",
  npc_dota_hero_queenofpain: "Queen of Pain",
  npc_dota_hero_antimage: "Anti-Mage",
  npc_dota_hero_kunkka: "Kunkka",
  npc_dota_hero_lina: "Lina",
  npc_dota_hero_mirana: "Mirana",
  npc_dota_hero_slardar: "Slardar",
  npc_dota_hero_lion: "Lion",
  npc_dota_hero_phantom_assassin: "Phantom Assassin",
  npc_dota_hero_tidehunter: "Tidehunter",
  npc_dota_hero_witch_doctor: "Witch Doctor",
  npc_dota_hero_vengefulspirit: "Vengeful Spirit",
  npc_dota_hero_juggernaut: "Juggernaut",
  npc_dota_hero_earthshaker: "Earthshaker",
  npc_dota_hero_pudge: "Pudge",
  npc_dota_hero_bane: "Bane",
  npc_dota_hero_crystal_maiden: "Crystal Maiden",
  npc_dota_hero_sven: "Sven",
  npc_dota_hero_skeleton_king: "Wraith King",
  npc_dota_hero_storm_spirit: "Storm Spirit",
  npc_dota_hero_sand_king: "Sand King",
  npc_dota_hero_nevermore: "Shadow Fiend",
  npc_dota_hero_drow_ranger: "Drow Ranger",
  npc_dota_hero_axe: "Axe",
  npc_dota_hero_bloodseeker: "Bloodseeker",
  npc_dota_hero_phantom_lancer: "Phantom Lancer",
  npc_dota_hero_razor: "Razor",
  npc_dota_hero_morphling: "Morphling",
  npc_dota_hero_zuus: "Zeus",
  npc_dota_hero_tiny: "Tiny",
  npc_dota_hero_puck: "Puck",
  npc_dota_hero_windrunner: "Windranger",
  npc_dota_hero_lich: "Lich",
  npc_dota_hero_shadow_shaman: "Shadow Shaman",
  npc_dota_hero_riki: "Riki",
  npc_dota_hero_enigma: "Enigma",
  npc_dota_hero_tinker: "Tinker",
  npc_dota_hero_sniper: "Sniper",
  npc_dota_hero_necrolyte: "Necrophos",
  npc_dota_hero_warlock: "Warlock",
  npc_dota_hero_beastmaster: "Beastmaster",
  npc_dota_hero_venomancer: "Venomancer",
  npc_dota_hero_faceless_void: "Faceless Void",
  npc_dota_hero_death_prophet: "Death Prophet",
  npc_dota_hero_pugna: "Pugna",
  npc_dota_hero_templar_assassin: "Templar Assassin",
  npc_dota_hero_viper: "Viper",
  npc_dota_hero_luna: "Luna",
  npc_dota_hero_dragon_knight: "Dragon Knight",
  npc_dota_hero_dazzle: "Dazzle",
  npc_dota_hero_rattletrap: "Clockwerk",
  npc_dota_hero_leshrac: "Leshrac",
  npc_dota_hero_furion: "Nature's Prophet",
  npc_dota_hero_life_stealer: "Lifestealer",
  npc_dota_hero_dark_seer: "Dark Seer",
  npc_dota_hero_clinkz: "Clinkz",
  npc_dota_hero_omniknight: "Omniknight",
  npc_dota_hero_enchantress: "Enchantress",
  npc_dota_hero_huskar: "Huskar",
  npc_dota_hero_night_stalker: "Night Stalker",
  npc_dota_hero_broodmother: "Broodmother",
  npc_dota_hero_bounty_hunter: "Bounty Hunter",
  npc_dota_hero_weaver: "Weaver",
  npc_dota_hero_jakiro: "Jakiro",
  npc_dota_hero_batrider: "Batrider",
  npc_dota_hero_chen: "Chen",
  npc_dota_hero_spectre: "Spectre",
  npc_dota_hero_doom_bringer: "Doom",
  npc_dota_hero_ancient_apparition: "Ancient Apparition",
  npc_dota_hero_ursa: "Ursa",
  npc_dota_hero_spirit_breaker: "Spirit Breaker",
  npc_dota_hero_gyrocopter: "Gyrocopter",
  npc_dota_hero_alchemist: "Alchemist",
  npc_dota_hero_invoker: "Invoker",
  npc_dota_hero_silencer: "Silencer",
  npc_dota_hero_obsidian_destroyer: "Outworld Devourer",
  npc_dota_hero_lycan: "Lycan",
  npc_dota_hero_brewmaster: "Brewmaster",
  npc_dota_hero_shadow_demon: "Shadow Demon",
  npc_dota_hero_lone_druid: "Lone Druid",
  npc_dota_hero_chaos_knight: "Chaos Knight",
  npc_dota_hero_treant: "Treant Protector",
  npc_dota_hero_meepo: "Meepo",
  npc_dota_hero_ogre_magi: "Ogre Magi",
  npc_dota_hero_undying: "Undying",
  npc_dota_hero_rubick: "Rubick",
  npc_dota_hero_disruptor: "Disruptor",
  npc_dota_hero_nyx_assassin: "Nyx Assassin",
  npc_dota_hero_naga_siren: "Naga Siren",
  npc_dota_hero_keeper_of_the_light: "Keeper of the Light",
  npc_dota_hero_visage: "Visage",
  npc_dota_hero_wisp: "Io",
  npc_dota_hero_slark: "Slark",
  npc_dota_hero_medusa: "Medusa",
  npc_dota_hero_troll_warlord: "Troll Warlord",
  npc_dota_hero_centaur: "Centaur Warrunner",
  npc_dota_hero_magnataur: "Magnus",
  npc_dota_hero_shredder: "Timbersaw",
  npc_dota_hero_bristleback: "Bristleback",
  npc_dota_hero_tusk: "Tusk",
  npc_dota_hero_skywrath_mage: "Skywrath Mage",
  npc_dota_hero_abaddon: "Abaddon",
  npc_dota_hero_elder_titan: "Elder Titan",
  npc_dota_hero_legion_commander: "Legion Commander",
  npc_dota_hero_ember_spirit: "Ember Spirit",
  npc_dota_hero_earth_spirit: "Earth Spirit",
  npc_dota_hero_abyssal_underlord: "Underlord",
  npc_dota_hero_phoenix: "Phoenix",
  npc_dota_hero_terrorblade: "Terrorblade",
  npc_dota_hero_oracle: "Oracle",
  npc_dota_hero_techies: "Techies",
  npc_dota_hero_target_dummy: "Target Dummy",
  npc_dota_hero_winter_wyvern: "Winter Wyvern",
  npc_dota_hero_arc_warden: "Arc Warden",
  npc_dota_hero_monkey_king: "Monkey King",
  npc_dota_hero_pangolier: "Pangolier",
  npc_dota_hero_dark_willow: "Dark Willow",
  npc_dota_hero_scaldris: "Scaldris",
  npc_dota_hero_void_spirit: "Void Spirit",
  npc_dota_hero_mars: "Mars",
  npc_dota_hero_grimstroke: "Grimstroke",
  npc_dota_hero_snapfire: "Snapfire",

  item_abyssal_blade: "Abyssal Blade",
  item_arcane_ring: "Arcane Ring",
  item_armlet: "Armlet of Mordiggian",
  item_assault: "Assault Cuirass",
  item_basher: "Skull Basher",
  item_belt_of_strength: "Belt of Strength",
  item_bfury: "Battle Fury",
  item_black_king_bar: "Black King Bar",
  item_blade_mail: "Blade Mail",
  item_blades_of_attack: "Blades of Attack",
  item_blade_of_alacrity: "Blade of Alacrity",
  item_blink: "Blink Dagger",
  item_super_blink: "Super Blink Dagger",
  item_bloodstone: "Bloodstone",
  item_boots: "Boots of Speed",
  item_boots_of_elves: "Band of Elvenskin",
  item_bottle: "Bottle",
  item_bottle_double_damage: "Rune: Double Damage",
  item_bottle_haste: "Rune: Haste",
  item_bottle_illusion: "Rune: Illusion",
  item_bottle_invisible: "Rune: Invisibility",
  item_bottle_regeneration: "Rune: Regeneration",
  item_bottle_bounty: "Rune: Bounty",
  item_bottle_arcane: "Rune: Arcane",
  item_bracer: "Bracer",
  item_branches: "Iron Branch",
  item_broadsword: "Broadsword",
  item_buckler: "Buckler",
  item_butterfly: "Butterfly",
  item_chainmail: "Chainmail",
  item_circlet: "Circlet",
  item_clarity: "Clarity",
  item_cloak: "Cloak",
  item_faerie_fire: "Faerie Fire",
  item_skybreaker: "Skybreaker",
  item_infused_raindrop: "Infused Raindrops",
  item_banana: "Banana",
  item_jade_bow: "Jade Bow",
  item_spirit_helix: "Spirit Helix",
  item_tome_of_knowledge: "Tome of Knowledge",
  item_wind_lace: "Wind Lace",
  item_blight_stone: "Blight Stone",
  item_dragon_lance: "Dragon Lance",
  item_aether_lens: "Aether Lens",
  item_claymore: "Claymore",
  item_meteor_hammer: "Meteor Hammer",
  item_traditional_crackers: "Traditional Crackers",
  item_nullifier: "Nullifier",
  item_aeon_disk: "Aeon Disk",
  item_kaya: "Kaya",
  item__recipe_spirit_vessel: "Spirit Vessel Recipe",
  item_spirit_vessel: "Spirit Vessel",
  item_crimson_guard: "Crimson Guard",
  item_courier: "Animal Courier",
  item_flying_courier: "Flying Courier",
  item_cyclone: "Eul's Scepter of Divinity",
  item_cyclone_2: "Eul's Scepter of Divinity (level 2)",
  item_dagon: "Dagon",
  item_dagon_2: "Dagon",
  item_dagon_2L: "Dagon (level 2)",
  item_dagon_3: "Dagon",
  item_dagon_3L: "Dagon (level 3)",
  item_dagon_4: "Dagon",
  item_dagon_4L: "Dagon (level 4)",
  item_dagon_5: "Dagon",
  item_dagon_5L: "Dagon (level 5)",
  item_demon_edge: "Demon Edge",
  item_desolator: "Desolator",
  item_diffusal_blade: "Diffusal Blade",
  item_diffusal_blade_2: "Diffusal Blade",
  item_diffusal_blade_2L: "Diffusal Blade (level 2)",
  item_dust: "Dust of Appearance",
  item_eagle: "Eaglesong",
  item_energy_booster: "Energy Booster",
  item_ethereal_blade: "Ethereal Blade",
  item_flask: "Healing Salve",
  item_force_staff: "Force Staff",
  item_recipe_force_staff: "Force Staff Recipe",
  item_gauntlets: "Gauntlets of Strength",
  item_gem: "Gem of True Sight",
  item_ghost: "Ghost Scepter",
  item_aether_staff: "Aether Staff",
  item_gloves: "Gloves of Haste",
  item_greater_crit: "Daedalus",
  item_hand_of_midas: "Hand of Midas",
  item_headdress: "Headdress",
  item_heart: "Heart of Tarrasque",
  item_helm_of_iron_will: "Helm of Iron Will",
  item_helm_of_the_dominator: "Helm of the Dominator",
  item_hood_of_defiance: "Hood of Defiance",
  item_hyperstone: "Hyperstone",
  item_invis_sword: "Shadow Blade",
  item_silver_edge: "Silver Edge",
  item_glimmer_cape: "Glimmer Cape",
  item_red_mist: "Red Mist",
  item_octarine_core: "Octarine Core",
  item_iron_talon: "Iron Talon",
  item_enchanted_mango: "Enchanted Mango",
  item_lotus_orb: "Lotus Orb",
  item_nightfall_striders: "Nightfall Striders",
  item_guardian_greaves: "Guardian Greaves",
  item_ward_dispenser: "Observer and Sentry Wards",
  item_solar_crest: "Solar Crest",
  item_rune_breaker: "Rune Breaker",
  item_bounty_pact: "Bounty Pact",
  item_natures_mend: "Nature's Mend",
  item_blinders: "Blinders",
  item_javelin: "Javelin",
  item_lesser_crit: "Crystalys",
  item_lifesteal: "Morbid Mask",
  item_sphere: "Linken's Sphere",
  item_maelstrom: "Maelstrom",
  item_magic_stick: "Magic Stick",
  item_magic_wand: "Magic Wand",
  item_manta: "Manta Style",
  item_mantle: "Mantle of Intelligence",
  item_mask_of_madness: "Mask of Madness",
  item_mekansm: "Mekansm",
  item_mithril_hammer: "Mithril Hammer",
  item_mjollnir: "Mjollnir",
  item_monkey_king_bar: "Monkey King Bar",
  item_mystic_staff: "Mystic Staff",
  item_necronomicon: "Necronomicon",
  item_necronomicon_2: "Necronomicon",
  item_necronomicon_2L: "Necronomicon (level 2)",
  item_necronomicon_3: "Necronomicon",
  item_necronomicon_3L: "Necronomicon (level 3)",
  item_null_talisman: "Null Talisman",
  item_telescope: "Eye of Omen",
  item_hurricane_pike: "Hurricane Pike",
  item_whip: "Whip",
  item_oblivion_staff: "Oblivion Staff",
  item_ogre_axe: "Ogre Axe",
  item_orchid: "Orchid Malevolence",
  item_bloodthorn: "Bloodthorn",
  item_pers: "Perseverance",
  item_phase_boots: "Phase Boots",
  item_pipe: "Pipe of Insight",
  item_platemail: "Platemail",
  item_point_booster: "Point Booster",
  item_poor_mans_shield: "Poor Man's Shield",
  item_power_treads: "Power Treads",
  item_power_treads_str: "Strength",
  item_power_treads_agi: "Agility",
  item_power_treads_int: "Intelligence",
  item_quarterstaff: "Quarterstaff",
  item_echo_sabre: "Echo Sabre",
  item_quelling_blade: "Quelling Blade",
  item_radiance: "Radiance",
  item_rapier: "Divine Rapier",
  item_reaver: "Reaver",
  item_refresher: "Refresher Orb",
  item_aegis: "Aegis of the Immortal",
  item_cheese: "Cheese",
  item_refresher_shard: "Refresher Shard",
  item_relic: "Sacred Relic",
  item_ring_of_basilius: "Ring of Basilius",
  item_ring_of_health: "Ring of Health",
  item_ring_of_protection: "Ring of Protection",
  item_ring_of_regen: "Ring of Regen",
  item_robe: "Robe of the Magi",
  item_rod_of_atos: "Rod of Atos",
  item_sange: "Sange",
  item_heavens_halberd: "Heaven's Halberd",
  item_sange_and_yasha: "Sange and Yasha",
  item_satanic: "Satanic",
  item_sheepstick: "Scythe of Vyse",
  item_shivas_guard: "Shiva's Guard",
  item_skadi: "Eye of Skadi",
  item_slippers: "Slippers of Agility",
  item_sobi_mask: "Sage's Mask",
  item_soul_booster: "Soul Booster",
  item_soul_ring: "Soul Ring",
  item_staff_of_wizardry: "Staff of Wizardry",
  item_stout_shield: "Stout Shield",
  item_venomous_shield: "Venomous Spike (Temp Name)",
  item_moon_shard: "Moon Shard",
  item_talisman_of_evasion: "Talisman of Evasion",
  item_tango: "Tango",
  item_tango_single: "Tango (Shared)",
  item_tpscroll: "Town Portal Scroll",
  item_tranquil_boots: "Tranquil Boots",
  item_recipe_tranquil_boots: "Tranquil Boots Recipe",
  item_tranquil_boots2: "Tranquil Boots Level 2",
  item_recipe_tranquil_boots2: "Tranquil Boots Level 2 Recipe",
  item_travel_boots: "Boots of Travel",
  item_recipe_travel_boots: "Boots of Travel Recipe",
  item_travel_boots_2: "Boots of Travel",
  item_ultimate_orb: "Ultimate Orb",
  item_ultimate_scepter: "Aghanim's Scepter",
  item_urn_of_shadows: "Urn of Shadows",
  item_recipe_urn_of_shadows: "Urn of Shadows Recipe",
  item_vanguard: "Vanguard",
  item_vitality_booster: "Vitality Booster",
  item_vladmir: "Vladmir's Offering",
  item_void_stone: "Void Stone",
  item_ward_observer: "Observer Ward",
  item_ward_sentry: "Sentry Ward",
  item_wraith_band: "Wraith Band",
  item_yasha: "Yasha",
  recipe: "Recipe: %s1",
  item_arcane_boots: "Arcane Boots",
  item_arcane_boots2: "Arcane Boots 2",
  item_orb_of_venom: "Orb of Venom",
  item_ancient_janggo: "Drum of Endurance",
  item_medallion_of_courage: "Medallion of Courage",
  item_smoke_of_deceit: "Smoke of Deceit",
  item_veil_of_discord: "Veil of Discord",
  item_ring_of_aquila: "Ring of Aquila",
  item_shadow_amulet: "Shadow Amulet",
  item_river_painter: "River Vial: Chrome",
  item_river_painter2: "River Vial: Dry",
  item_river_painter3: "River Vial: Slime",
  item_river_painter4: "River Vial: Oil",
  item_river_painter5: "River Vial: Electrified",
  item_river_painter6: "River Vial: Potion",
  item_river_painter7: "River Vial: Blood",
  item_mutation_tombstone: "Tombstone",
  item_pocket_tower: "Pocket Tower",

  item_recipe_aeon_disk: "Aeon Disk Recipe",
  item_recipe_bracer: "Bracer Recipe",
  item_recipe_cyclone: "Eul's Scepter Recipe",
  item_recipe_silver_edge: "Silver Edge Recipe",
  item_recipe_maelstrom: "Maelstrom Recipe",
  item_recipe_shivas_guard: "Shiva's Guard Recipe",
  item_recipe_diffusal_blade: "Diffusal Blade Recipe",
  item_recipe_ancient_janggo: "Drum of Endurance Recipe",
  item_recipe_orchid: "Orchid Malevolence Recipe",
  item_recipe_bloodstone: "Bloodstone Recipe",
  item_recipe_manta: "Manta Style Recipe",
  item_recipe_hurricane_pike: "Hurricane Pike Recipe",
  item_recipe_refresher: "Refresher Orb Recipe",
  item_recipe_sphere: "Linken's Sphere Recipe",
  item_recipe_greater_crit: "Daedalus Recipe",
  item_recipe_hand_of_midas: "Hand of Midas Recipe",
  item_recipe_mekansm: "Mekansm Recipe",
  item_recipe_assault: "Assault Cuirass Recipe",
  item_recipe_pipe: "Pipe of Insight Recipe",
  item_recipe_magic_wand: "Magic Wand Recipe",
  item_recipe_heart: "Heart of Tarrasque Recipe",
  item_recipe_bloodthorn: "Bloodthorn Recipe",
  item_recipe_guardian_greaves: "Guardian Greaves Recipe",
  item_recipe_mjollnir: "Mjollnir Recipe",
  item_recipe_abyssal_blade: "Abyssal Blade Recipe",
  item_recipe_black_king_bar: "Black King Bar Recipe",
  item_recipe_dagon: "Dagon Recipe",
  item_recipe_soul_ring: "Soul Ring Recipe",
  item_recipe_yasha: "Yasha Recipe",
  item_recipe_crimson_guard: "Crimson Guard Recipe",
  item_recipe_necronomicon: "Necronomicon Recipe",
  item_recipe_sange: "Sange Recipe",
  item_recipe_basher: "Skull Basher Recipe",
  item_recipe_aether_lens: "Aether Lens Recipe",
  item_recipe_veil_of_discord: "Veil of Discord Recipe",
  item_recipe_buckler: "Buckler Recipe",
  item_recipe_lesser_crit: "Crystalys Recipe",
  item_recipe_mask_of_madness: "Mask of Madness Recipe",
  item_recipe_headdress: "Headdress Recipe",
  item_recipe_wraith_band: "Wraith Band Recipe",
  item_recipe_helm_of_the_dominator: "Helm of the Dominator Recipe",
  item_recipe_armlet: "Armlet of Mordiggian Recipe",
  item_recipe_null_talisman: "Null Talisman Recipe",
  item_recipe_iron_talon: "Iron Talon Recipe",
  item_recipe_radiance: "Radiance Recipe",
  item_recipe_rod_of_atos: "Rod of Atos Recipe",
  item_recipe_nullifier: "Nullifier Recipe",
  item_recipe_bfury: "Battle Fury Recipe",
};

export default {
  filters: {
    translateDota: function(text) {
      if (translationMap[text]) {
        return translationMap[text];
      } else {
        return text;
      }
    },
    hhmmss: function(secs) {
      if (secs > 3600) {
        return moment.utc(secs * 1000).format("H:mm:ss");
      } else return moment.utc(secs * 1000).format("mm:ss");
    },
    parseQuestText: function(text, value) {
      if (text) {
        return text.replace("%x%", value);
      }
    },
    dateFromNow: function(value) {
      if (value) {
        return moment(String(value)).fromNow();
      }
    },
    localizeNumber: function(value) {
      if (value) {
        return value.toLocaleString();
      }
    },
    round: function(value, decimals) {
      {
        if (!value) {
          value = 0;
        }

        if (!decimals) {
          decimals = 0;
        }

        value =
          Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
        return value;
      }
    },
    percentage: function(value, decimals) {
      if (!value) {
        value = 0;
      }

      if (!decimals) {
        decimals = 0;
      }

      value = value * 100;
      value =
        Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
      value = value + "%";
      return value;
    },
  },
  create: function(Vue) {
    Object.keys(this.filters).forEach(
      function(filter) {
        Vue.filter(filter, this.filters[filter]);
      }.bind(this)
    );
  },
};
