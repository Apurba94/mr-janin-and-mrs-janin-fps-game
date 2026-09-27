# Mr Janin & Mrs Janin FPS — Implementation Plan

The game is a single-arena, wave-based first-person shooter that emphasizes movement, hitscan shooting, enemy pressure, and score visibility. The core runtime lives under `client/src/game`, where it is kept separate from the React view shell.

| Risk slice | Implementation | Browser proof |
|---|---|---|
| First-person controls | Custom keyboard and pointer-lock input updates a Babylon `UniversalCamera`. | WASD moves in local camera directions; mouse look rotates the view. |
| Shooting | A hitscan ray from the active camera tests enemy meshes. | Clicking consumes ammo, flashes the reticle, and removes damaged targets. |
| Enemy pressure | Procedural drone meshes seek the camera and attack at close range. | Visible drones cross the arena, health drops on contact, and new waves spawn. |
| HUD and game flow | React overlays listen for game telemetry events. | Health, ammo, weapon, score, and wave update during a match. |
| Deterministic proof | `?demo` starts a timed cinematic/autoplay mode. | A screenshot can show active enemies and populated HUD without manual input. |

The game is intentionally a focused vertical slice rather than a networked multiplayer title. The victory condition is clearing seven escalating waves; the fail condition is losing all health.
