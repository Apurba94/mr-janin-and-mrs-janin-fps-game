// Mr Janin & Mrs Janin FPS — brutalist arcade tuning and asset contracts.

export const COLORS = {
  janinCyan: "#00e5ff",
  enemyMagenta: "#ff2d87",
  clearLime: "#b9ff3d",
  arenaInk: "#07111f",
  concrete: "#273449",
  gold: "#ffca58",
} as const;

// Arena floor and wall textures are drawn procedurally (see textures.ts).
export const ASSETS = {
  briefingArt: "/mr-mrs-janin.svg",
} as const;

export type WeaponName = "PULSE PISTOL" | "JANIN RIFLE" | "BREACHER";

export type WeaponSpec = {
  name: WeaponName;
  damage: number;
  magazine: number;
  fireDelay: number;
  spread: number;
  color: string;
};

export const WEAPONS: WeaponSpec[] = [
  { name: "PULSE PISTOL", damage: 34, magazine: 18, fireDelay: 220, spread: 0.008, color: COLORS.janinCyan },
  { name: "JANIN RIFLE", damage: 22, magazine: 40, fireDelay: 95, spread: 0.011, color: COLORS.clearLime },
  { name: "BREACHER", damage: 66, magazine: 9, fireDelay: 620, spread: 0.075, color: COLORS.gold },
];

export const GAME = {
  maxHealth: 100,
  playerSpeed: 17,
  arenaRadius: 88,
  maxWaves: 7,
  enemySpawnDelayMs: 560,
  enemyContactDistance: 3.4,
  enemyDamagePerSecond: 15,
} as const;
