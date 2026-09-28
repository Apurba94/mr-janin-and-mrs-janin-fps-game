# Mr Janin & Mrs Janin — FPS

**Mr Janin & Mrs Janin** is a browser-based, wave-driven first-person arena shooter. It uses Babylon.js for the 3D scene and a React/Vite interface shell for the responsive arcade cockpit HUD.

## Play Locally

Install a current LTS version of Node.js, then run the following commands from the repository root.

```bash
pnpm install
pnpm dev
```

Open the local URL reported by Vite. Select **ENTER COMBAT**, then click the arena to lock the mouse.

| Control | Action |
|---|---|
| `W`, `A`, `S`, `D` | Move forward, left, backward, and right |
| Mouse | Look around after pointer lock is active |
| Left mouse button | Fire the active weapon |
| Drag with the left button | Look around when the browser refuses pointer lock (for example inside an embed) |
| `1`, `2`, `3` | Select Pulse Pistol, Janin Rifle, or Breacher |
| `R` | Refill the active weapon magazine |
| `Esc` | Release mouse capture |

For a deterministic active-arena preview, open the URL with `?demo` appended. It will launch the first wave automatically.

## Development Checks

```bash
pnpm check    # TypeScript
pnpm test     # headless combat tests on Babylon NullEngine
pnpm build
```

The game source is grouped deliberately by runtime ownership.

| Location | Responsibility |
|---|---|
| `client/src/game/` | Framework-agnostic Babylon.js scene, input, combat, enemies, player state, and match flow |
| `client/src/components/GameCanvas.tsx` | Lifecycle-safe canvas, HUD overlay, start/restart briefing, and HUD event bridge |
| `client/src/index.css` | The neo-brutalist arcade visual system and responsive presentation behavior |
| `ideas.md` | Design philosophy and visual rules |
| `PLAN.md`, `STRUCTURE.md`, `ASSETS.md` | Implementation plan, architecture, and generated-asset manifest |

## Asset Handling

The arena floor and wall textures are drawn procedurally at runtime (`client/src/game/textures.ts`), and the briefing art is `client/public/mr-mrs-janin.svg`, so the game needs no external image hosting.

## Deployment

This project builds as a static web application and can be deployed to any platform that supports a Vite production build. Run `pnpm build` and serve the generated `dist/` output according to the platform’s static-site documentation.

## Credits

Created by **Janin A Apurba**. Released under the [MIT License](LICENSE).

## Follow Janin on YouTube

If this project helped you, please follow and subscribe:

- **Study with Janin**: [youtube.com/@studywithjanin](https://www.youtube.com/@studywithjanin)
- **Pomodoro Study with Janin**: [youtube.com/@pomodorostudywithjanin3326](https://www.youtube.com/@pomodorostudywithjanin3326)
