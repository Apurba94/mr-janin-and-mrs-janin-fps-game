// Mr Janin & Mrs Janin FPS — neon brutalist arena construction and game frame loop.

import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Color3, Color4 } from "@babylonjs/core/Maths/math.color";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { PointLight } from "@babylonjs/core/Lights/pointLight";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { GlowLayer } from "@babylonjs/core/Layers/glowLayer";
import { COLORS } from "./constants";
import { createFloorTexture, createWallTexture } from "./textures";
import { GameWorld } from "./world";

export type GameHandle = { scene: Scene; dispose: () => void };

export async function createGameScene(engine: Engine, canvas: HTMLCanvasElement): Promise<GameHandle> {
  const scene = new Scene(engine);
  scene.clearColor = Color4.FromHexString("#06101cff");
  scene.ambientColor = Color3.FromHexString("#11253c");

  const glow = new GlowLayer("arcadeGlow", scene, { blurKernelSize: 40 });
  glow.intensity = 0.72;
  makeArena(scene);

  const world = new GameWorld(scene, canvas);
  // Cap the step: after a paused or background tab the first frame can report
  // seconds of elapsed time, which would teleport enemies and apply all of that
  // contact damage at once.
  scene.onBeforeRenderObservable.add(() => world.update(Math.min(engine.getDeltaTime() / 1000, 0.05)));

  if (new URLSearchParams(window.location.search).has("demo")) {
    window.setTimeout(() => world.start(), 700);
  }

  return {
    scene,
    dispose: () => {
      world.dispose();
      glow.dispose();
      scene.dispose();
    },
  };
}

function makeArena(scene: Scene): void {
  const ambient = new HemisphericLight("skyFill", new Vector3(0, 1, 0), scene);
  ambient.diffuse = Color3.FromHexString("#6bb7ff");
  ambient.groundColor = Color3.FromHexString("#07111f");
  ambient.intensity = 0.55;

  const cyanLight = new PointLight("cyanPylonLight", new Vector3(-38, 18, -12), scene);
  cyanLight.diffuse = Color3.FromHexString(COLORS.janinCyan);
  cyanLight.intensity = 1.85;
  cyanLight.range = 95;
  const pinkLight = new PointLight("pinkPylonLight", new Vector3(38, 15, 25), scene);
  pinkLight.diffuse = Color3.FromHexString(COLORS.enemyMagenta);
  pinkLight.intensity = 1.45;
  pinkLight.range = 95;

  const floor = MeshBuilder.CreateGround("arenaFloor", { width: 184, height: 184, subdivisions: 40 }, scene);
  const floorMat = new StandardMaterial("arenaFloorMat", scene);
  floorMat.diffuseColor = Color3.FromHexString("#13253a");
  floorMat.specularColor = Color3.FromHexString("#1c4b69");
  const floorTexture = createFloorTexture(scene);
  floorTexture.uScale = 7;
  floorTexture.vScale = 7;
  floorMat.diffuseTexture = floorTexture;
  floor.material = floorMat;

  const wallMat = new StandardMaterial("arenaWallMat", scene);
  wallMat.diffuseColor = Color3.FromHexString("#1d2b3c");
  wallMat.specularColor = Color3.Black();
  const wallTexture = createWallTexture(scene);
  wallTexture.uScale = 4;
  wallTexture.vScale = 2;
  wallMat.diffuseTexture = wallTexture;

  const walls = [
    { x: 0, z: 92, width: 184, depth: 4 },
    { x: 0, z: -92, width: 184, depth: 4 },
    { x: 92, z: 0, width: 4, depth: 184 },
    { x: -92, z: 0, width: 4, depth: 184 },
  ];
  walls.forEach((spec, index) => {
    const wall = MeshBuilder.CreateBox(`arenaWall${index}`, { width: spec.width, depth: spec.depth, height: 20 }, scene);
    wall.position.set(spec.x, 10, spec.z);
    wall.material = wallMat;
  });

  const concreteMat = new StandardMaterial("concreteMat", scene);
  concreteMat.diffuseColor = Color3.FromHexString("#26374d");
  concreteMat.specularColor = Color3.FromHexString("#0a111c");
  const emitMat = new StandardMaterial("cyanEmitMat", scene);
  emitMat.diffuseColor = Color3.Black();
  emitMat.emissiveColor = Color3.FromHexString(COLORS.janinCyan);
  const enemyEmitMat = new StandardMaterial("pinkEmitMat", scene);
  enemyEmitMat.diffuseColor = Color3.Black();
  enemyEmitMat.emissiveColor = Color3.FromHexString(COLORS.enemyMagenta);

  const blocks = [
    [-26, -12, 12, 8, 10], [22, -16, 9, 7, 14], [-18, 24, 14, 6, 8], [30, 25, 10, 9, 11], [0, 4, 8, 5, 8],
  ];
  blocks.forEach(([x, z, width, height, depth], index) => {
    const block = MeshBuilder.CreateBox(`barricade${index}`, { width, height, depth }, scene);
    block.position.set(x, height / 2, z);
    block.material = concreteMat;
    const stripe = MeshBuilder.CreateBox(`barricadeStripe${index}`, { width: width + 0.04, height: 0.32, depth: 0.34 }, scene);
    stripe.position.set(x, height * 0.72, z - depth / 2 - 0.03);
    stripe.material = index % 2 ? enemyEmitMat : emitMat;
  });

  [[-70, -70], [70, -70], [-70, 70], [70, 70]].forEach(([x, z], index) => {
    const pylon = MeshBuilder.CreateBox(`pylon${index}`, { width: 3.2, height: 19, depth: 3.2 }, scene);
    pylon.position.set(x, 9.5, z);
    pylon.material = concreteMat;
    const beacon = MeshBuilder.CreateCylinder(`beacon${index}`, { diameter: 1.2, height: 5.4, tessellation: 8 }, scene);
    beacon.position.set(x, 16.5, z);
    beacon.material = index % 2 ? enemyEmitMat : emitMat;
  });
}
