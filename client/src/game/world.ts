// Mr Janin & Mrs Janin FPS — owns score, waves, weapon hitscan, and combat telemetry.

import type { Scene } from "@babylonjs/core/scene";
import { Ray } from "@babylonjs/core/Culling/ray";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { PointLight } from "@babylonjs/core/Lights/pointLight";
import type { AbstractMesh } from "@babylonjs/core/Meshes/abstractMesh";
import { COLORS, GAME } from "./constants";
import { Enemy } from "./enemy";
import { InputManager } from "./input";
import { Player } from "./player";

export type HudTelemetry = {
  health: number;
  ammo: number;
  magazine: number;
  score: number;
  wave: number;
  kills: number;
  weapon: string;
  enemyCount: number;
  status: "BRIEFING" | "ACTIVE" | "CLEAR" | "DEFEAT" | "VICTORY";
  hit: boolean;
};

export class GameWorld {
  readonly player: Player;
  private readonly input: InputManager;
  private enemies: Enemy[] = [];
  private active = false;
  private wave = 1;
  private score = 0;
  private kills = 0;
  private spawned = 0;
  private spawnAt = 0;
  private lastTelemetryAt = 0;
  private hitUntil = 0;
  private elapsed = 0;
  private targetCount = 0;
  private gameStatus: HudTelemetry["status"] = "BRIEFING";

  constructor(private readonly scene: Scene, canvas: HTMLCanvasElement) {
    this.player = new Player(scene);
    this.scene.activeCamera = this.player.camera;
    this.input = new InputManager(canvas);
    canvas.addEventListener("click", () => {
      this.input.requestPointerLock();
      this.start();
    });
  }

  start(): void {
    if (this.gameStatus === "DEFEAT" || this.gameStatus === "VICTORY") this.reset();
    if (this.active) return;
    this.active = true;
    this.gameStatus = "ACTIVE";
    this.targetCount = 2 + this.wave * 2;
    this.spawnAt = performance.now() + 180;
    this.emitTelemetry(true);
  }

  update(deltaSeconds: number): void {
    this.elapsed += deltaSeconds;
    const frame = this.input.consumeFrame();
    if (!this.active) {
      this.emitTelemetry(false);
      return;
    }

    this.player.update(frame, deltaSeconds);
    if (frame.fire) this.fire();

    const now = performance.now();
    if (this.spawned < this.targetCount && now >= this.spawnAt) this.spawnEnemy();

    for (const enemy of this.enemies) {
      enemy.update(deltaSeconds, this.player.camera.position, this.elapsed * 1000);
      const distance = Vector3.Distance(enemy.mesh.position, this.player.camera.position);
      if (distance <= GAME.enemyContactDistance) this.player.takeDamage(GAME.enemyDamagePerSecond * deltaSeconds);
    }

    this.enemies = this.enemies.filter((enemy) => enemy.health > 0);

    if (this.player.health <= 0) {
      this.active = false;
      this.gameStatus = "DEFEAT";
    } else if (this.spawned === this.targetCount && this.enemies.length === 0 && this.targetCount > 0) {
      if (this.wave >= GAME.maxWaves) {
        this.active = false;
        this.gameStatus = "VICTORY";
      } else {
        this.wave += 1;
        this.spawned = 0;
        this.targetCount = 0;
        this.gameStatus = "CLEAR";
        window.setTimeout(() => {
          if (this.active) {
            this.gameStatus = "ACTIVE";
            this.targetCount = 2 + this.wave * 2;
            this.spawnAt = performance.now() + 650;
          }
        }, 700);
      }
    }
    this.emitTelemetry(false);
  }

  private spawnEnemy(): void {
    const spawnPattern = [
      new Vector3(0, 2.8, -2),
      new Vector3(-22, 2.8, 12),
      new Vector3(25, 2.8, 18),
      new Vector3(-34, 2.8, 36),
      new Vector3(34, 2.8, 42),
      new Vector3(0, 2.8, 57),
    ];
    const base = spawnPattern[this.spawned % spawnPattern.length];
    const ring = Math.floor(this.spawned / spawnPattern.length) * 8;
    const enemy = new Enemy(
      this.scene,
      new Vector3(base.x + ring, base.y, base.z + ring),
      this.wave
    );
    this.enemies.push(enemy);
    this.spawned += 1;
    this.spawnAt = performance.now() + GAME.enemySpawnDelayMs;
  }

  private fire(): void {
    const now = performance.now();
    if (!this.player.tryFire(now)) return;
    const direction = this.player.camera.getForwardRay(1).direction;
    const spread = this.player.weapon.spread;
    direction.x += (Math.random() - 0.5) * spread;
    direction.y += (Math.random() - 0.5) * spread;
    direction.z += (Math.random() - 0.5) * spread;
    direction.normalize();

    const ray = new Ray(this.player.camera.position.clone(), direction, 150);
    const pick = this.scene.pickWithRay(ray, (mesh) => this.isEnemyMesh(mesh));
    this.createShotTrace(direction);

    if (pick?.hit && pick.pickedMesh) {
      const enemy = this.enemies.find((target) => target.mesh === pick.pickedMesh || target.mesh.isDescendantOf(pick.pickedMesh!));
      if (enemy && enemy.takeDamage(this.player.weapon.damage)) {
        this.score += 100 + this.wave * 20;
        this.kills += 1;
        enemy.dispose();
      }
      this.hitUntil = performance.now() + 120;
    }
  }

  private isEnemyMesh(mesh: AbstractMesh): boolean {
    return this.enemies.some((enemy) => enemy.mesh === mesh || mesh.isDescendantOf(enemy.mesh));
  }

  private createShotTrace(direction: Vector3): void {
    const flash = MeshBuilder.CreateSphere("shotFlash", { diameter: 0.18 }, this.scene);
    flash.position = this.player.camera.position.add(direction.scale(1.2));
    const material = new StandardMaterial("shotFlashMat", this.scene);
    material.emissiveColor = Color3.FromHexString(COLORS.janinCyan);
    material.diffuseColor = Color3.Black();
    flash.material = material;
    const light = new PointLight("shotLight", flash.position.clone(), this.scene);
    light.diffuse = Color3.FromHexString(COLORS.janinCyan);
    light.intensity = 6;
    light.range = 8;
    window.setTimeout(() => {
      light.dispose();
      flash.dispose();
      material.dispose();
    }, 45);
  }

  private emitTelemetry(force: boolean): void {
    const now = performance.now();
    if (!force && now - this.lastTelemetryAt < 70) return;
    this.lastTelemetryAt = now;
    window.dispatchEvent(
      new CustomEvent<HudTelemetry>("janin-hud", {
        detail: {
          health: Math.ceil(this.player.health),
          ammo: this.player.currentAmmo,
          magazine: this.player.weapon.magazine,
          score: this.score,
          wave: this.wave,
          kills: this.kills,
          weapon: this.player.weaponName,
          enemyCount: this.enemies.length,
          status: this.gameStatus,
          hit: this.player.isHurt || performance.now() < this.hitUntil,
        },
      })
    );
  }

  private reset(): void {
    this.enemies.forEach((enemy) => enemy.dispose());
    this.enemies = [];
    this.wave = 1;
    this.score = 0;
    this.kills = 0;
    this.spawned = 0;
    this.targetCount = 0;
    this.player.health = GAME.maxHealth;
    this.player.resetLoadout();
    this.player.camera.position.set(0, 2.2, -42);
    this.player.camera.rotation.set(0, 0, 0);
  }

  dispose(): void {
    this.enemies.forEach((enemy) => enemy.dispose());
    this.input.dispose();
  }
}
