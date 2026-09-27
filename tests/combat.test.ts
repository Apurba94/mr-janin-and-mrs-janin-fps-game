// Headless combat test: a real Babylon scene on NullEngine, driven with the
// same pointer events the browser sends.
import { beforeEach, describe, expect, it } from "vitest";
import { NullEngine } from "@babylonjs/core/Engines/nullEngine";
import { Scene } from "@babylonjs/core/scene";

type Listener = (event: unknown) => void;
const listeners = new Map<string, Listener>();
let clock = 1_000;

const canvas = {
  addEventListener: () => {},
  // Refused, as in iframes and privacy-restricted browsers.
  requestPointerLock: () => Promise.reject(new Error("pointer lock denied")),
};
Object.assign(globalThis, {
  window: {
    addEventListener: (type: string, listener: Listener) => listeners.set(type, listener),
    removeEventListener: () => {},
    dispatchEvent: () => true,
    setTimeout: () => 0,
  },
  document: { pointerLockElement: null },
});
globalThis.performance.now = () => clock;

const { GameWorld } = await import("../client/src/game/world");
const { WEAPONS } = await import("../client/src/game/constants");

function setup() {
  const scene = new Scene(new NullEngine());
  const world = new GameWorld(scene, canvas as unknown as HTMLCanvasElement);
  return { scene, world };
}

/** Advance until the first enemy exists, then park it straight ahead of the camera. */
function enemyInSights(scene: Scene, world: InstanceType<typeof GameWorld>) {
  world.start();
  for (let i = 0; i < 40 && !(world as any).enemies.length; i++) { clock += 50; world.update(0.016); }
  const enemy = (world as any).enemies[0];
  enemy.speed = 0;
  const cam = world.player.camera;
  enemy.mesh.position.set(cam.position.x, cam.position.y, cam.position.z + 12);
  scene.render();
  return enemy;
}

const press = (target: unknown) => listeners.get("pointerdown")!({ button: 0, target });

describe("combat input", () => {
  beforeEach(() => { clock += 10_000; });

  it("listens to pointer events (Babylon suppresses mousedown on its canvas)", () => {
    setup();
    expect(listeners.has("pointerdown")).toBe(true);
    expect(listeners.has("mousedown")).toBe(false);
  });

  it("fires on a canvas click without pointer lock and hits the enemy ahead", () => {
    const { scene, world } = setup();
    const enemy = enemyInSights(scene, world);
    const before = enemy.health;
    press(canvas);
    clock += 300;
    world.update(0.016);
    expect(world.player.currentAmmo).toBe(WEAPONS[0].magazine - 1);
    expect(enemy.health).toBe(before - WEAPONS[0].damage);
  });

  it("scores a kill once the enemy's health is spent", () => {
    const { scene, world } = setup();
    enemyInSights(scene, world);
    for (let shot = 0; shot < 6; shot++) { press(canvas); clock += 300; world.update(0.016); }
    // Enemies keep spawning, and one spawn point is straight ahead, so later
    // shots may land more kills; each is worth 100 + 20 per wave.
    const kills = (world as any).kills;
    expect(kills).toBeGreaterThanOrEqual(1);
    expect((world as any).score).toBe(kills * 120);
  });

  it("does not fire when clicking HUD controls instead of the arena", () => {
    const { scene, world } = setup();
    enemyInSights(scene, world);
    press({ tagName: "BUTTON" });
    clock += 300;
    world.update(0.016);
    expect(world.player.currentAmmo).toBe(WEAPONS[0].magazine);
  });

  it("starts a new match with full magazines on the pistol", () => {
    const { scene, world } = setup();
    enemyInSights(scene, world);
    listeners.get("keydown")!({ code: "Digit2", preventDefault() {} });
    world.update(0.016);
    for (let shot = 0; shot < 3; shot++) { press(canvas); clock += 300; world.update(0.016); }
    (world as any).gameStatus = "DEFEAT";
    (world as any).active = false;
    world.start();
    expect(world.player.weaponIndex).toBe(0);
    expect(world.player.currentAmmo).toBe(WEAPONS[0].magazine);
  });
});
