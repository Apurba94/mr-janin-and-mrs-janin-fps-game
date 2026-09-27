// Brutalist Arcade Barricade component: full-screen arena with a three-band cockpit HUD.

import { useEffect, useRef, useState } from "react";
import { Engine } from "@babylonjs/core/Engines/engine";
import { ASSETS } from "@/game/constants";
import { createGameScene, type GameHandle } from "@/game/scene";
import type { HudTelemetry } from "@/game/world";

const EMPTY_HUD: HudTelemetry = {
  health: 100,
  ammo: 18,
  magazine: 18,
  score: 0,
  wave: 1,
  kills: 0,
  weapon: "PULSE PISTOL",
  enemyCount: 0,
  status: "BRIEFING",
  hit: false,
};

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const startedRef = useRef(false);
  const [hud, setHud] = useState<HudTelemetry>(EMPTY_HUD);
  const menuVisible = hud.status === "BRIEFING" || hud.status === "DEFEAT" || hud.status === "VICTORY";

  useEffect(() => {
    const onHud = (event: Event) => setHud((event as CustomEvent<HudTelemetry>).detail);
    window.addEventListener("janin-hud", onHud);
    return () => window.removeEventListener("janin-hud", onHud);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || startedRef.current) return;
    startedRef.current = true;
    const engine = new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, adaptToDeviceRatio: true });
    let handle: GameHandle | null = null;
    let active = true;
    createGameScene(engine, canvas).then((gameHandle) => {
      if (!active) {
        gameHandle.dispose();
        return;
      }
      handle = gameHandle;
      engine.runRenderLoop(() => gameHandle.scene.render());
    });
    const onResize = () => engine.resize();
    window.addEventListener("resize", onResize);
    return () => {
      active = false;
      window.removeEventListener("resize", onResize);
      handle?.dispose();
      engine.dispose();
      startedRef.current = false;
    };
  }, []);

  const beginMatch = () => canvasRef.current?.click();
  const healthWidth = `${Math.max(0, Math.min(100, hud.health))}%`;

  return (
    <main className={`janin-game ${hud.hit ? "janin-game--hit" : ""}`} aria-label="Mr Janin and Mrs Janin FPS game">
      <canvas ref={canvasRef} className="janin-game__canvas" aria-label="3D arena" />
      <div className="janin-game__vignette" aria-hidden="true" />
      <section className="hud hud--identity" aria-label="Game identity">
        <p className="eyebrow">TWO AGAINST THE ARENA</p>
        <h1>MR JANIN <span>//</span> MRS JANIN</h1>
        <p className="sector-label">SECTOR 01 · BARRICADE PROTOCOL</p>
      </section>
      <section className="hud hud--mission" aria-label="Mission status">
        <p className="eyebrow">HOSTILE SIGNALS</p>
        <strong>{String(hud.enemyCount).padStart(2, "0")}</strong>
        <span>IN RANGE</span>
      </section>
      <div className="crosshair" aria-hidden="true"><i /><b /><em /></div>
      <section className="hud hud--cockpit" aria-label="Player status">
        <div className="health-panel">
          <div className="health-panel__title"><span>INTEGRITY</span><strong>{String(hud.health).padStart(3, "0")}</strong></div>
          <div className="health-track"><i style={{ width: healthWidth }} /></div>
          <p>{hud.health > 35 ? "JANIN SYSTEMS NOMINAL" : "HULL BREACH — MOVE NOW"}</p>
        </div>
        <div className="weapon-panel">
          <p className="eyebrow">ACTIVE TOOL</p>
          <strong>{hud.weapon}</strong>
          <div className="ammo-line"><b>{String(hud.ammo).padStart(2, "0")}</b><span>/ {String(hud.magazine).padStart(2, "0")}</span></div>
          <p className="weapon-keys">[1] PULSE&nbsp;&nbsp;[2] RIFLE&nbsp;&nbsp;[3] BREACHER&nbsp;&nbsp;[R] REFILL</p>
        </div>
        <div className="score-panel">
          <p className="eyebrow">TACTICAL RECORD</p>
          <strong>{String(hud.score).padStart(6, "0")}</strong>
          <span>WAVE {String(hud.wave).padStart(2, "0")} · {hud.kills} ELIMINATED</span>
        </div>
      </section>
      {menuVisible && (
        <section className="briefing" role="dialog" aria-modal="true" aria-label="Match briefing">
          <div className="briefing__art"><img src={ASSETS.briefingArt} alt="Mr Janin and Mrs Janin helmets" /></div>
          <div className="briefing__copy">
            <p className="eyebrow">{hud.status === "DEFEAT" ? "ARENA OVERRAN" : hud.status === "VICTORY" ? "ARENA SECURED" : "TRANSMISSION RECEIVED"}</p>
            <h2>{hud.status === "DEFEAT" ? "RE-ENTER THE BARRICADE" : hud.status === "VICTORY" ? "JANIN PROTOCOL COMPLETE" : "LOCK THE ARENA."}</h2>
            <p>{hud.status === "VICTORY" ? "Seven waves cleared. The signal collapses under Janin control." : "WASD to move. Mouse to look. Click to fire. Keys 1–3 switch your instrument of choice."}</p>
            <button type="button" onClick={beginMatch}>{hud.status === "DEFEAT" ? "RESTART MATCH" : hud.status === "VICTORY" ? "RUN IT AGAIN" : "ENTER COMBAT"}</button>
          </div>
        </section>
      )}
      {hud.status === "CLEAR" && <div className="wave-alert" role="status">WAVE CLEARED — NEXT SIGNAL INBOUND</div>}
    </main>
  );
}
