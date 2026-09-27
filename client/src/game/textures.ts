// Procedural arena textures, drawn at runtime so the game ships no image files.
import type { Scene } from "@babylonjs/core/scene";
import { DynamicTexture } from "@babylonjs/core/Materials/Textures/dynamicTexture";
import { COLORS } from "./constants";

const SIZE = 512;

/** Dark concrete tiles with cyan seams and a magenta accent notch per tile. */
export function createFloorTexture(scene: Scene) {
  const texture = new DynamicTexture("arenaFloorTexture", SIZE, scene, true);
  const ctx = texture.getContext();
  const tile = SIZE / 4;
  ctx.fillStyle = "#101d2e";
  ctx.fillRect(0, 0, SIZE, SIZE);
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      ctx.fillStyle = (row + col) % 2 === 0 ? "#13253a" : "#0f2033";
      ctx.fillRect(col * tile + 3, row * tile + 3, tile - 6, tile - 6);
      ctx.fillStyle = COLORS.enemyMagenta;
      ctx.fillRect(col * tile + 12, row * tile + 12, 14, 3);
    }
  }
  ctx.strokeStyle = COLORS.janinCyan;
  ctx.lineWidth = 3;
  for (let i = 0; i <= 4; i++) {
    ctx.beginPath(); ctx.moveTo(i * tile, 0); ctx.lineTo(i * tile, SIZE); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, i * tile); ctx.lineTo(SIZE, i * tile); ctx.stroke();
  }
  texture.update();
  return texture;
}

/** Poured-concrete wall panels with a magenta hazard band. */
export function createWallTexture(scene: Scene) {
  const texture = new DynamicTexture("arenaWallTexture", SIZE, scene, true);
  const ctx = texture.getContext();
  ctx.fillStyle = COLORS.concrete;
  ctx.fillRect(0, 0, SIZE, SIZE);
  const panel = SIZE / 2;
  ctx.strokeStyle = COLORS.arenaInk;
  ctx.lineWidth = 6;
  for (let i = 0; i <= 2; i++) {
    ctx.beginPath(); ctx.moveTo(i * panel, 0); ctx.lineTo(i * panel, SIZE); ctx.stroke();
  }
  ctx.fillStyle = "#1d2b3c";
  for (let y = 40; y < SIZE; y += 96) ctx.fillRect(0, y, SIZE, 4);
  ctx.fillStyle = COLORS.enemyMagenta;
  ctx.fillRect(0, SIZE * 0.78, SIZE, 18);
  ctx.fillStyle = COLORS.janinCyan;
  ctx.fillRect(0, SIZE * 0.78 + 24, SIZE, 4);
  texture.update();
  return texture;
}
