// Mr Janin & Mrs Janin FPS — semantic controls for deterministic combat input.

export type InputFrame = {
  forward: number;
  strafe: number;
  lookX: number;
  lookY: number;
  fire: boolean;
  reload: boolean;
  weaponIndex: number | null;
};

export class InputManager {
  private readonly held = new Set<string>();
  private lookX = 0;
  private lookY = 0;
  private firePressed = false;
  private reloadPressed = false;
  private selectedWeapon: number | null = null;
  // Drag-to-aim fallback for when the browser refuses pointer lock (embedded
  // iframes, some mobile and privacy-restricted browsers).
  private dragging = false;
  private readonly onKeyDown: (event: KeyboardEvent) => void;
  private readonly onKeyUp: (event: KeyboardEvent) => void;
  private readonly onMouseMove: (event: PointerEvent) => void;
  private readonly onMouseDown: (event: PointerEvent) => void;
  private readonly onMouseUp: () => void;

  constructor(private readonly canvas: HTMLCanvasElement) {
    this.onKeyDown = (event) => {
      this.held.add(event.code);
      if (event.code === "KeyR") this.reloadPressed = true;
      if (["Digit1", "Digit2", "Digit3"].includes(event.code)) {
        this.selectedWeapon = Number(event.code.replace("Digit", "")) - 1;
      }
      if (["Space", "KeyW", "KeyA", "KeyS", "KeyD"].includes(event.code)) event.preventDefault();
    };
    this.onKeyUp = (event) => this.held.delete(event.code);
    this.onMouseMove = (event) => {
      if (!this.locked && !this.dragging) return;
      this.lookX += event.movementX;
      this.lookY += event.movementY;
    };
    this.onMouseDown = (event) => {
      if (event.button !== 0) return;
      if (this.locked) { this.firePressed = true; return; }
      if (event.target === this.canvas) { this.firePressed = true; this.dragging = true; }
    };
    this.onMouseUp = () => { this.dragging = false; };

    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
    // Pointer events, not mouse events: Babylon cancels pointerdown on its
    // canvas, and a cancelled pointerdown suppresses the mousedown/mouseup the
    // browser would otherwise send, so a mousedown listener never fires.
    window.addEventListener("pointermove", this.onMouseMove);
    window.addEventListener("pointerdown", this.onMouseDown);
    window.addEventListener("pointerup", this.onMouseUp);
  }

  private get locked(): boolean {
    return document.pointerLockElement === this.canvas;
  }

  requestPointerLock(): void {
    // Modern browsers return a promise that rejects when lock is refused; the
    // drag-to-aim fallback keeps the game playable then.
    try {
      const request = this.canvas.requestPointerLock?.() as Promise<void> | undefined;
      request?.catch?.(() => {});
    } catch {
      /* pointer lock unavailable */
    }
  }

  consumeFrame(): InputFrame {
    const frame: InputFrame = {
      forward: Number(this.held.has("KeyW")) - Number(this.held.has("KeyS")),
      strafe: Number(this.held.has("KeyD")) - Number(this.held.has("KeyA")),
      lookX: this.lookX,
      lookY: this.lookY,
      fire: this.firePressed,
      reload: this.reloadPressed,
      weaponIndex: this.selectedWeapon,
    };
    this.lookX = 0;
    this.lookY = 0;
    this.firePressed = false;
    this.reloadPressed = false;
    this.selectedWeapon = null;
    return frame;
  }

  dispose(): void {
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
    window.removeEventListener("pointermove", this.onMouseMove);
    window.removeEventListener("pointerdown", this.onMouseDown);
    window.removeEventListener("pointerup", this.onMouseUp);
  }
}
