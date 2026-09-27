// Mr Janin & Mrs Janin FPS — player combat state and first-person locomotion.

import { UniversalCamera } from "@babylonjs/core/Cameras/universalCamera";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import type { InputFrame } from "./input";
import { GAME, WEAPONS, type WeaponName, type WeaponSpec } from "./constants";

export class Player {
  readonly camera: UniversalCamera;
  health: number = GAME.maxHealth;
  weaponIndex = 0;
  private ammo = WEAPONS.map((weapon) => weapon.magazine);
  private lastShotAt = 0;
  private hurtFlashUntil = 0;

  constructor(scene: ConstructorParameters<typeof UniversalCamera>[2]) {
    this.camera = new UniversalCamera("janinCamera", new Vector3(0, 2.2, -42), scene);
    this.camera.minZ = 0.1;
    this.camera.fov = 1.1;
    this.camera.rotation = new Vector3(0, 0, 0);
  }

  get weapon(): WeaponSpec {
    return WEAPONS[this.weaponIndex];
  }

  get weaponName(): WeaponName {
    return this.weapon.name;
  }

  get currentAmmo(): number {
    return this.ammo[this.weaponIndex];
  }

  /** A new match starts on the pistol with every magazine full. */
  resetLoadout(): void {
    this.weaponIndex = 0;
    this.ammo = WEAPONS.map((weapon) => weapon.magazine);
  }

  get isHurt(): boolean {
    return performance.now() < this.hurtFlashUntil;
  }

  update(frame: InputFrame, deltaSeconds: number): void {
    if (frame.weaponIndex !== null && WEAPONS[frame.weaponIndex]) this.weaponIndex = frame.weaponIndex;
    if (frame.reload) this.ammo[this.weaponIndex] = this.weapon.magazine;

    this.camera.rotation.y += frame.lookX * 0.0023;
    this.camera.rotation.x += frame.lookY * 0.0018;
    this.camera.rotation.x = Math.max(-1.25, Math.min(1.25, this.camera.rotation.x));

    const yaw = this.camera.rotation.y;
    const forward = new Vector3(Math.sin(yaw), 0, Math.cos(yaw));
    const right = new Vector3(Math.cos(yaw), 0, -Math.sin(yaw));
    const move = forward.scale(frame.forward).add(right.scale(frame.strafe));
    if (move.lengthSquared() > 0) {
      move.normalize().scaleInPlace(GAME.playerSpeed * deltaSeconds);
      this.camera.position.addInPlace(move);
      const radialDistance = Math.hypot(this.camera.position.x, this.camera.position.z);
      if (radialDistance > GAME.arenaRadius) {
        this.camera.position.x *= GAME.arenaRadius / radialDistance;
        this.camera.position.z *= GAME.arenaRadius / radialDistance;
      }
    }
  }

  tryFire(now: number): boolean {
    if (now - this.lastShotAt < this.weapon.fireDelay || this.currentAmmo <= 0) return false;
    this.lastShotAt = now;
    this.ammo[this.weaponIndex] -= 1;
    return true;
  }

  takeDamage(amount: number): void {
    this.health = Math.max(0, this.health - amount);
    this.hurtFlashUntil = performance.now() + 110;
  }
}
