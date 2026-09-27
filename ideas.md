# Mr Janin & Mrs Janin FPS — Design Direction

## Three Possible Directions

| Theme Name | Very Brief Intro | Probability |
|---|---|---:|
| Luminous Freightyard | A rain-soaked freight depot where liquid color pools against black steel. It would frame the game as a tactical night chase. | 0.07 |
| Brutalist Arcade Barricade | A compact concrete combat arena overlaid with high-energy arcade interfaces, painted signage, and laser-lit defensive structures. It treats every firefight as a visible score attack. | 0.04 |
| Soft Synth Safari | A surreal desert arena with warm gradients, inflated geometric props, and analog synth ornament. It would make the shooter playful and dreamlike. | 0.09 |

## Chosen Approach: Brutalist Arcade Barricade

### Design Movement
The game follows **neo-brutalist arcade design**: chunky concrete massing, sharp panel divisions, oversized technical labels, and unapologetically saturated gameplay signals.

### Core Principles
The arena should remain legible at speed, using dark negative space around action. Combat information receives the brightest color, physical world objects have simple geometric silhouettes, and interface elements read like fitted hardware rather than detached webpages. Every visual decision should reinforce directness, momentum, and score-chasing energy.

### Color Philosophy
Near-black blue slate holds the background so cyan navigational light and acid-lime success feedback feel electrically active. Magenta is reserved for danger and hostile energy. The controlled palette makes incoming enemies, the current weapon, and damage state instantly distinguishable.

### Layout Paradigm
The game has a **three-band cockpit layout** rather than a centered webpage: tactical identification occupies the upper left, mission status anchors the upper right, and the weapon/health instrument cluster spans the bottom. The world remains full-frame behind this physical HUD.

### Signature Elements
The game repeats a split cyan/magenta crosshair, hard-edged utility cards with corner brackets, and narrow scan-line separators. In the arena, neon corner pylons and scratched industrial blocks echo the interface geometry.

### Interaction Philosophy
Input should feel immediate and mechanical. Menus initiate with one decisive action, weapon switching is explicit, and hit feedback is brief, bright, and unambiguous. The player is never asked to navigate nested controls during combat.

### Animation
Combat feedback uses quick opacity and transform bursts under 180ms. HUD values snap rather than slowly interpolate. Ambient arena panels pulse gently, while the menu panel enters on a short horizontal slide and exits immediately when the match begins. Motion is reduced for users who request reduced motion.

### Typography System
Headlines use **Russo One** for compact arcade authority; technical labels and body copy use **IBM Plex Mono** for a readable equipment-panel rhythm. Headings are all caps with tracking, while numeric values are large and tightly spaced.

### Brand Essence
**A compact score-driven FPS for players who want immediate arena combat with theatrical neo-brutalist style.**

The personality is **kinetic, unapologetic, and tactical**.

### Brand Voice
Headlines are terse operational calls; CTAs use active, physical verbs; microcopy reports a status rather than selling an experience. Example lines: “LOCK THE ARENA.” and “WAVE 03 IS NOT WAITING.”

### Wordmark & Logo
The wordmark is a squared, split-weight stencil reading “MR JANIN // MRS JANIN”, flanked by two opposing chevrons that resemble a crosshair opening. The logo mark is a cyan-and-magenta divided target shield with no text.

### Signature Brand Color
**Janin Cyan — #00E5FF** is the ownable navigational and player-action color.

## Style Decisions

The first visible screen must feature the live arena rather than a marketing-style landing page. UI panels remain square or minimally rounded, avoiding soft consumer-app surfaces. Cyan always represents player action, magenta represents enemy pressure, and acid lime represents a confirmed hit, successful reload, or cleared mission state.

Every initial game state must place either the live arena with its full three-band HUD or an operational briefing directly over that arena. A blank slate field is never an acceptable first impression. The cyan player-action signal must be visible beside at least one hard-edged HUD element, and all button and status copy remains terse tactical reporting rather than generic promotional language.
