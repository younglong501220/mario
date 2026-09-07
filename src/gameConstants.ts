import { Platform, MysteryBlock, Coin, Enemy, GoalFlag } from './types';

export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 400;
export const GRAVITY = 0.6;
export const FRICTION = 0.82;
export const LEVEL_END_X = 2300;

export const INITIAL_PLATFORMS: Platform[] = [
  // Ground segments with pits
  { x: 0, y: 350, w: 720, h: 50, type: 'ground' },
  { x: 790, y: 350, w: 620, h: 50, type: 'ground' },
  { x: 1480, y: 350, w: 900, h: 50, type: 'ground' },

  // Floating brick platforms
  { x: 200, y: 260, w: 90, h: 20, type: 'brick' },
  { x: 350, y: 200, w: 120, h: 20, type: 'brick' },
  { x: 550, y: 240, w: 90, h: 20, type: 'brick' },

  // Pipe obstacles
  {
    x: 650,
    y: 290,
    w: 48,
    h: 60,
    type: 'pipe',
    isWarpPipe: true,
    warpTarget: { zone: 'underground', x: 80, y: 280 }
  },
  { x: 1200, y: 270, w: 48, h: 80, type: 'pipe' },
  {
    x: 1400,
    y: 300,
    w: 48,
    h: 50,
    type: 'pipe'
  },

  // Mid level bricks & platforms
  { x: 900, y: 260, w: 100, h: 20, type: 'brick' },
  { x: 1050, y: 190, w: 120, h: 20, type: 'brick' },
  { x: 1280, y: 250, w: 90, h: 20, type: 'brick' },

  // Staircase up to flag
  { x: 1650, y: 290, w: 60, h: 60, type: 'brick' },
  { x: 1710, y: 250, w: 60, h: 100, type: 'brick' },
  { x: 1770, y: 210, w: 60, h: 140, type: 'brick' },
  { x: 1830, y: 170, w: 60, h: 180, type: 'brick' },

  // Castle floor at end
  { x: 2150, y: 260, w: 120, h: 90, type: 'brick' }
];

export const INITIAL_MYSTERY_BLOCKS: MysteryBlock[] = [
  { x: 230, y: 200, w: 28, h: 28, item: 'coin', hit: false, bumpOffset: 0 },
  { x: 390, y: 140, w: 28, h: 28, item: 'mushroom', hit: false, bumpOffset: 0 },
  { x: 940, y: 200, w: 28, h: 28, item: 'coin', hit: false, bumpOffset: 0 },
  { x: 1100, y: 130, w: 28, h: 28, item: 'coin', hit: false, bumpOffset: 0 }
];

export const INITIAL_COINS: Coin[] = [
  { id: 'c1', x: 230, y: 230, collected: false, spinOffset: 0 },
  { id: 'c2', x: 260, y: 230, collected: false, spinOffset: 0.5 },
  { id: 'c3', x: 370, y: 160, collected: false, spinOffset: 1 },
  { id: 'c4', x: 410, y: 160, collected: false, spinOffset: 1.5 },
  { id: 'c5', x: 570, y: 200, collected: false, spinOffset: 2 },
  { id: 'c6', x: 920, y: 220, collected: false, spinOffset: 2.5 },
  { id: 'c7', x: 970, y: 220, collected: false, spinOffset: 3 },
  { id: 'c8', x: 1080, y: 150, collected: false, spinOffset: 3.5 },
  { id: 'c9', x: 1130, y: 150, collected: false, spinOffset: 4 },
  { id: 'c10', x: 1310, y: 210, collected: false, spinOffset: 4.5 },
  { id: 'c11', x: 1845, y: 130, collected: false, spinOffset: 5 }
];

export const INITIAL_ENEMIES: Enemy[] = [
  { id: 'e1', x: 450, y: 320, w: 28, h: 28, vx: -1.2, alive: true, squished: false, squishTimer: 0, initialX: 450 },
  { id: 'e2', x: 960, y: 320, w: 28, h: 28, vx: -1.3, alive: true, squished: false, squishTimer: 0, initialX: 960 },
  { id: 'e3', x: 1110, y: 162, w: 28, h: 28, vx: -1.0, alive: true, squished: false, squishTimer: 0, initialX: 1110 },
  { id: 'e4', x: 1340, y: 320, w: 28, h: 28, vx: -1.4, alive: true, squished: false, squishTimer: 0, initialX: 1340 },
  { id: 'e5', x: 1580, y: 320, w: 28, h: 28, vx: -1.5, alive: true, squished: false, squishTimer: 0, initialX: 1580 }
];

export const INITIAL_GOAL: GoalFlag = {
  x: 2050,
  y: 110,
  w: 12,
  h: 240,
  flagY: 120,
  reached: false,
  sliding: false
};

// Underground Zone (Bonus Coin Room)
export const UNDERGROUND_PLATFORMS: Platform[] = [
  // Underground ceiling
  { x: 0, y: 0, w: 800, h: 40, type: 'underground_brick' },
  // Underground floor
  { x: 0, y: 350, w: 800, h: 50, type: 'underground_ground' },
  // Left entrance pipe coming down
  { x: 50, y: 40, w: 48, h: 60, type: 'pipe' },
  // Middle brick platforms holding coins
  { x: 160, y: 260, w: 180, h: 20, type: 'underground_brick' },
  { x: 380, y: 210, w: 180, h: 20, type: 'underground_brick' },
  // Exit pipe at right (jump into it or stand next to it to return)
  {
    x: 680,
    y: 280,
    w: 50,
    h: 70,
    type: 'pipe',
    isWarpPipe: true,
    warpTarget: { zone: 'overworld', x: 1400, y: 250 }
  }
];

export const UNDERGROUND_COINS: Coin[] = [
  // Coins on bottom floor
  { id: 'ug_c1', x: 180, y: 310, collected: false, spinOffset: 0 },
  { id: 'ug_c2', x: 220, y: 310, collected: false, spinOffset: 0.3 },
  { id: 'ug_c3', x: 260, y: 310, collected: false, spinOffset: 0.6 },
  { id: 'ug_c4', x: 300, y: 310, collected: false, spinOffset: 0.9 },
  { id: 'ug_c5', x: 340, y: 310, collected: false, spinOffset: 1.2 },
  // Coins on middle platform 1
  { id: 'ug_c6', x: 180, y: 220, collected: false, spinOffset: 0.2 },
  { id: 'ug_c7', x: 220, y: 220, collected: false, spinOffset: 0.5 },
  { id: 'ug_c8', x: 260, y: 220, collected: false, spinOffset: 0.8 },
  { id: 'ug_c9', x: 300, y: 220, collected: false, spinOffset: 1.1 },
  // Coins on high platform 2
  { id: 'ug_c10', x: 400, y: 170, collected: false, spinOffset: 0.1 },
  { id: 'ug_c11', x: 440, y: 170, collected: false, spinOffset: 0.4 },
  { id: 'ug_c12', x: 480, y: 170, collected: false, spinOffset: 0.7 },
  { id: 'ug_c13', x: 520, y: 170, collected: false, spinOffset: 1.0 },
  // Bonus coin arc
  { id: 'ug_c14', x: 600, y: 240, collected: false, spinOffset: 1.3 },
  { id: 'ug_c15', x: 630, y: 210, collected: false, spinOffset: 1.6 }
];

export const UNDERGROUND_MYSTERY_BLOCKS: MysteryBlock[] = [
  { x: 460, y: 120, w: 28, h: 28, item: 'mushroom', hit: false, bumpOffset: 0 }
];

