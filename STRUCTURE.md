# Runtime Structure

| File | Ownership |
|---|---|
| `client/src/components/GameCanvas.tsx` | React picture frame, lifecycle-safe Babylon canvas, DOM HUD, and start/restart overlays. |
| `client/src/game/scene.ts` | Babylon scene construction, arena geometry, lights, and frame update hook. |
| `client/src/game/world.ts` | Match state, spawning, waves, shooting, collision checks, and telemetry events. |
| `client/src/game/input.ts` | Keyboard, pointer-lock, mouse, and fire-button listeners. |
| `client/src/game/player.ts` | Player health, weapon magazine state, movement camera, and damage state. |
| `client/src/game/enemy.ts` | Drone mesh, pursuit behavior, hit response, and cleanup. |
| `client/src/game/constants.ts` | Game tuning, weapon data, colors, and generated asset URLs. |

React is deliberately not used for per-frame game updates. The world pushes a small HUD telemetry payload into the browser, and the interface only re-renders when that telemetry changes.
