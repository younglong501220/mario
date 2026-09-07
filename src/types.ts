export type GameState = 'START' | 'PLAYING' | 'PAUSED' | 'WON' | 'GAMEOVER';

export interface Player {
  x: number;
  y: number;
  w: number;
  h: number;
  vx: number;
  vy: number;
  speed: number;
  jumpStrength: number;
  isGrounded: boolean;
  score: number;
  lives: number;
  isSuper: boolean; // Mushroom power-up
  isInvulnerable: boolean;
  invulnerableTimer: number;
  facing: 'left' | 'right';
  animFrame: number;
  animTimer: number;
  coinsCount: number;
}

export type GameZone = 'overworld' | 'underground';

export interface WarpTransition {
  active: boolean;
  direction: 'down' | 'up';
  progress: number;
  targetZone: GameZone;
  targetX: number;
  targetY: number;
}

export interface Platform {
  x: number;
  y: number;
  w: number;
  h: number;
  type?: 'ground' | 'brick' | 'pipe' | 'pipeTop' | 'underground_ground' | 'underground_brick';
  isWarpPipe?: boolean;
  warpTarget?: {
    zone: GameZone;
    x: number;
    y: number;
  };
}

export interface MysteryBlock {
  x: number;
  y: number;
  w: number;
  h: number;
  item: 'coin' | 'mushroom';
  hit: boolean;
  bumpOffset: number;
}

export interface Coin {
  id: string;
  x: number;
  y: number;
  collected: boolean;
  spinOffset: number;
}

export interface Enemy {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  vx: number;
  alive: boolean;
  squished: boolean;
  squishTimer: number;
  initialX: number;
}

export interface MushroomItem {
  x: number;
  y: number;
  w: number;
  h: number;
  vx: number;
  vy: number;
  active: boolean;
  emerging: boolean;
  emergeY: number;
}

export interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  life: number;
  maxLife: number;
  size: number;
  text?: string;
}

export interface GoalFlag {
  x: number;
  y: number;
  w: number;
  h: number;
  flagY: number;
  reached: boolean;
  sliding: boolean;
}

export interface ControlKeys {
  left: boolean;
  right: boolean;
  jump: boolean;
  down: boolean;
  run: boolean;
}
