// Mr Janin & Mrs Janin FPS — procedural hostile drone actor.

import type { Scene } from "@babylonjs/core/scene";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import type { Mesh } from "@babylonjs/core/Meshes/mesh";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { PointLight } from "@babylonjs/core/Lights/pointLight";
import { COLORS } from "./constants";

export class Enemy {
  readonly mesh: Mesh;
  private readonly core: Mesh;
  private readonly glow: PointLight;
  health: number;
  readonly speed: number;
  private drift = Math.random() * Math.PI * 2;

  constructor(scene: Scene, position: Vector3, wave: number) {
    this.health = 52 + wave * 13;
    this.speed = 2.1 + wave * 0.11;

    this.mesh = MeshBuilder.CreatePolyhedron("hostileDrone", { type: 1, size: 2.7 }, scene);
    this.mesh.position.copyFrom(position);
    const shell = new StandardMaterial("hostileShell", scene);
    shell.diffuseColor = Color3.FromHexString(COLORS.enemyMagenta);
    shell.emissiveColor = Color3.FromHexString(COLORS.enemyMagenta).scale(0.3);
    shell.specularColor = Color3.Black();
    this.mesh.material = shell;

    this.core = MeshBuilder.CreateSphere("hostileCore", { diameter: 0.85, segments: 12 }, scene);
    this.core.parent = this.mesh;
    const coreMat = new StandardMaterial("hostileCoreMat", scene);
    coreMat.emissiveColor = Color3.FromHexString(COLORS.clearLime);
    coreMat.diffuseColor = Color3.Black();
    this.core.material = coreMat;

    this.glow = new PointLight("hostileGlow", this.mesh.position.clone(), scene);
    this.glow.diffuse = Color3.FromHexString(COLORS.enemyMagenta);
    this.glow.intensity = 2.1;
    this.glow.range = 15;
  }

  update(deltaSeconds: number, target: Vector3, elapsed: number): void {
    const direction = target.subtract(this.mesh.position);
    direction.y = 0;
    const distance = direction.length();
    if (distance > 2.7) {
      direction.normalize();
      this.mesh.position.addInPlace(direction.scale(this.speed * deltaSeconds));
    }
    this.drift += deltaSeconds * 2.4;
    this.mesh.position.y = 2.8 + Math.sin(this.drift + elapsed * 0.0015) * 0.7;
    this.mesh.rotation.y += deltaSeconds * 1.6;
    this.glow.position.copyFrom(this.mesh.position);
  }

  takeDamage(amount: number): boolean {
    this.health -= amount;
    this.mesh.scaling.setAll(1.16);
    return this.health <= 0;
  }

  dispose(): void {
    this.glow.dispose();
    this.core.dispose();
    this.mesh.dispose();
  }
}
