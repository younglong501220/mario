import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GameState, GameZone, Player, Platform, MysteryBlock, Coin, Enemy, MushroomItem, Particle, GoalFlag, ControlKeys, WarpTransition } from './types';
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  GRAVITY,
  FRICTION,
  INITIAL_PLATFORMS,
  INITIAL_MYSTERY_BLOCKS,
  INITIAL_COINS,
  INITIAL_ENEMIES,
  INITIAL_GOAL,
  UNDERGROUND_PLATFORMS,
  UNDERGROUND_COINS,
  UNDERGROUND_MYSTERY_BLOCKS
} from './gameConstants';
import { drawBackground, drawPlatforms, drawMysteryBlocks, drawCoins, drawEnemies, drawMushroom, drawPlayer, drawGoal, drawParticles } from './renderers';
import { audio } from './audio';
import { GameHUD } from './components/GameHUD';
import { TouchControls } from './components/TouchControls';
import { OverlayModal } from './components/OverlayModal';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // High score in local storage
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem('mini_mario_high_score') || '0', 10);
    } catch {
      return 0;
    }
  });

  // Reactive game UI states
  const [gameState, setGameState] = useState<GameState>('PLAYING');
  const [score, setScore] = useState<number>(0);
  const [coinsCount, setCoinsCount] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [bgmEnabled, setBgmEnabled] = useState<boolean>(false);
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const [currentZone, setCurrentZone] = useState<GameZone>('overworld');

  // Ref holders for active game loop data (avoids stale closures)
  const keysRef = useRef<ControlKeys>({
    left: false,
    right: false,
    jump: false,
    down: false,
    run: false
  });

  const stateRef = useRef<{
    gameState: GameState;
    zone: GameZone;
    warp: WarpTransition | null;
    cameraX: number;
    player: Player;
    platforms: Platform[];
    mysteryBlocks: MysteryBlock[];
    coins: Coin[];
    enemies: Enemy[];
    mushroom: MushroomItem;
    goal: GoalFlag;
    particles: Particle[];
    overworldData: {
      platforms: Platform[];
      mysteryBlocks: MysteryBlock[];
      coins: Coin[];
      enemies: Enemy[];
      mushroom: MushroomItem;
    };
    undergroundData: {
      platforms: Platform[];
      mysteryBlocks: MysteryBlock[];
      coins: Coin[];
      enemies: Enemy[];
      mushroom: MushroomItem;
    };
  }>({
    gameState: 'PLAYING',
    zone: 'overworld',
    warp: null,
    cameraX: 0,
    player: {
      x: 50,
      y: 250,
      w: 28,
      h: 38,
      vx: 0,
      vy: 0,
      speed: 4.5,
      jumpStrength: -12.5,
      isGrounded: false,
      score: 0,
      lives: 3,
      isSuper: false,
      isInvulnerable: false,
      invulnerableTimer: 0,
      facing: 'right',
      animFrame: 0,
      animTimer: 0,
      coinsCount: 0
    },
    platforms: JSON.parse(JSON.stringify(INITIAL_PLATFORMS)),
    mysteryBlocks: JSON.parse(JSON.stringify(INITIAL_MYSTERY_BLOCKS)),
    coins: JSON.parse(JSON.stringify(INITIAL_COINS)),
    enemies: JSON.parse(JSON.stringify(INITIAL_ENEMIES)),
    mushroom: {
      x: 0,
      y: 0,
      w: 24,
      h: 24,
      vx: 1.5,
      vy: 0,
      active: false,
      emerging: false,
      emergeY: 0
    },
    goal: JSON.parse(JSON.stringify(INITIAL_GOAL)),
    particles: [],
    overworldData: {
      platforms: JSON.parse(JSON.stringify(INITIAL_PLATFORMS)),
      mysteryBlocks: JSON.parse(JSON.stringify(INITIAL_MYSTERY_BLOCKS)),
      coins: JSON.parse(JSON.stringify(INITIAL_COINS)),
      enemies: JSON.parse(JSON.stringify(INITIAL_ENEMIES)),
      mushroom: {
        x: 0,
        y: 0,
        w: 24,
        h: 24,
        vx: 1.5,
        vy: 0,
        active: false,
        emerging: false,
        emergeY: 0
      }
    },
    undergroundData: {
      platforms: JSON.parse(JSON.stringify(UNDERGROUND_PLATFORMS)),
      mysteryBlocks: JSON.parse(JSON.stringify(UNDERGROUND_MYSTERY_BLOCKS)),
      coins: JSON.parse(JSON.stringify(UNDERGROUND_COINS)),
      enemies: [],
      mushroom: {
        x: 0,
        y: 0,
        w: 24,
        h: 24,
        vx: 1.5,
        vy: 0,
        active: false,
        emerging: false,
        emergeY: 0
      }
    }
  });

  // Switch between Overworld and Underground
  const switchZone = (targetZone: GameZone, targetX: number, targetY: number) => {
    const s = stateRef.current;
    if (s.zone === targetZone) return;

    // Persist current zone state
    if (s.zone === 'overworld') {
      s.overworldData.platforms = s.platforms;
      s.overworldData.mysteryBlocks = s.mysteryBlocks;
      s.overworldData.coins = s.coins;
      s.overworldData.enemies = s.enemies;
      s.overworldData.mushroom = s.mushroom;
    } else {
      s.undergroundData.platforms = s.platforms;
      s.undergroundData.mysteryBlocks = s.mysteryBlocks;
      s.undergroundData.coins = s.coins;
      s.undergroundData.enemies = s.enemies;
      s.undergroundData.mushroom = s.mushroom;
    }

    s.zone = targetZone;

    // Load target zone state
    if (targetZone === 'overworld') {
      s.platforms = s.overworldData.platforms;
      s.mysteryBlocks = s.overworldData.mysteryBlocks;
      s.coins = s.overworldData.coins;
      s.enemies = s.overworldData.enemies;
      s.mushroom = s.overworldData.mushroom;
    } else {
      s.platforms = s.undergroundData.platforms;
      s.mysteryBlocks = s.undergroundData.mysteryBlocks;
      s.coins = s.undergroundData.coins;
      s.enemies = s.undergroundData.enemies;
      s.mushroom = s.undergroundData.mushroom;
    }

    s.player.x = targetX;
    s.player.y = targetY;
    s.player.vx = 0;
    s.player.vy = 0;
    setCurrentZone(targetZone);
  };

  // Helper for AABB collision
  const checkCollision = (r1: { x: number; y: number; w: number; h: number }, r2: { x: number; y: number; w: number; h: number }) => {
    return (
      r1.x < r2.x + r2.w &&
      r1.x + r1.w > r2.x &&
      r1.y < r2.y + r2.h &&
      r1.y + r1.h > r2.y
    );
  };

  const addScoreParticle = (text: string, x: number, y: number, color = '#ffd700') => {
    stateRef.current.particles.push({
      id: Math.random().toString(),
      x,
      y,
      vx: 0,
      vy: -1.2,
      color,
      life: 45,
      maxLife: 45,
      size: 14,
      text
    });
  };

  // Reset player after death / falling
  const respawnPlayer = () => {
    const p = stateRef.current.player;
    stateRef.current.zone = 'overworld';
    stateRef.current.platforms = stateRef.current.overworldData.platforms;
    stateRef.current.mysteryBlocks = stateRef.current.overworldData.mysteryBlocks;
    stateRef.current.coins = stateRef.current.overworldData.coins;
    stateRef.current.enemies = stateRef.current.overworldData.enemies;
    stateRef.current.mushroom = stateRef.current.overworldData.mushroom;
    stateRef.current.warp = null;

    const spawnX = Math.max(50, stateRef.current.cameraX + 40);
    p.x = spawnX;
    p.y = 200;
    p.vx = 0;
    p.vy = 0;
    p.isSuper = false;
    p.w = 28;
    p.h = 38;
    p.isInvulnerable = true;
    p.invulnerableTimer = 2.0;
    setCurrentZone('overworld');
  };

  // Restart complete game
  const handleRestart = useCallback(() => {
    setCurrentZone('overworld');
    const freshOverworldPlatforms = JSON.parse(JSON.stringify(INITIAL_PLATFORMS));
    const freshOverworldMystery = JSON.parse(JSON.stringify(INITIAL_MYSTERY_BLOCKS));
    const freshOverworldCoins = JSON.parse(JSON.stringify(INITIAL_COINS));
    const freshOverworldEnemies = JSON.parse(JSON.stringify(INITIAL_ENEMIES));

    stateRef.current = {
      gameState: 'PLAYING',
      zone: 'overworld',
      warp: null,
      cameraX: 0,
      player: {
        x: 50,
        y: 250,
        w: 28,
        h: 38,
        vx: 0,
        vy: 0,
        speed: 4.5,
        jumpStrength: -12.5,
        isGrounded: false,
        score: 0,
        lives: 3,
        isSuper: false,
        isInvulnerable: false,
        invulnerableTimer: 0,
        facing: 'right',
        animFrame: 0,
        animTimer: 0,
        coinsCount: 0
      },
      platforms: freshOverworldPlatforms,
      mysteryBlocks: freshOverworldMystery,
      coins: freshOverworldCoins,
      enemies: freshOverworldEnemies,
      mushroom: {
        x: 0,
        y: 0,
        w: 24,
        h: 24,
        vx: 1.5,
        vy: 0,
        active: false,
        emerging: false,
        emergeY: 0
      },
      goal: JSON.parse(JSON.stringify(INITIAL_GOAL)),
      particles: [],
      overworldData: {
        platforms: JSON.parse(JSON.stringify(INITIAL_PLATFORMS)),
        mysteryBlocks: JSON.parse(JSON.stringify(INITIAL_MYSTERY_BLOCKS)),
        coins: JSON.parse(JSON.stringify(INITIAL_COINS)),
        enemies: JSON.parse(JSON.stringify(INITIAL_ENEMIES)),
        mushroom: {
          x: 0,
          y: 0,
          w: 24,
          h: 24,
          vx: 1.5,
          vy: 0,
          active: false,
          emerging: false,
          emergeY: 0
        }
      },
      undergroundData: {
        platforms: JSON.parse(JSON.stringify(UNDERGROUND_PLATFORMS)),
        mysteryBlocks: JSON.parse(JSON.stringify(UNDERGROUND_MYSTERY_BLOCKS)),
        coins: JSON.parse(JSON.stringify(UNDERGROUND_COINS)),
        enemies: [],
        mushroom: {
          x: 0,
          y: 0,
          w: 24,
          h: 24,
          vx: 1.5,
          vy: 0,
          active: false,
          emerging: false,
          emergeY: 0
        }
      }
    };

    setGameState('PLAYING');
    setScore(0);
    setCoinsCount(0);
    setLives(3);

    if (bgmEnabled && !isMuted) {
      audio.startBGM();
    }
  }, [bgmEnabled, isMuted]);

  // Handle Audio Toggles
  const handleToggleMute = () => {
    const muted = audio.toggleMute();
    setIsMuted(muted);
  };

  const handleToggleBGM = () => {
    const enabled = audio.toggleBGM();
    setBgmEnabled(enabled);
  };

  const handleTogglePause = () => {
    setGameState((prev) => {
      const next = prev === 'PLAYING' ? 'PAUSED' : prev === 'PAUSED' ? 'PLAYING' : prev;
      stateRef.current.gameState = next;
      return next;
    });
  };

  // Touch control callback
  const handleTouchControl = (key: keyof ControlKeys, pressed: boolean) => {
    keysRef.current[key] = pressed;
  };

  // Keyboard Event Listeners
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
      }

      if (e.code === 'ArrowLeft' || e.code === 'KeyA') keysRef.current.left = true;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') keysRef.current.right = true;
      if (e.code === 'ArrowUp' || e.code === 'KeyW' || e.code === 'Space') keysRef.current.jump = true;
      if (e.code === 'ArrowDown' || e.code === 'KeyS') keysRef.current.down = true;
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight' || e.code === 'KeyJ') keysRef.current.run = true;

      if (e.code === 'KeyP' || e.code === 'Escape') {
        handleTogglePause();
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') keysRef.current.left = false;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') keysRef.current.right = false;
      if (e.code === 'ArrowUp' || e.code === 'KeyW' || e.code === 'Space') keysRef.current.jump = false;
      if (e.code === 'ArrowDown' || e.code === 'KeyS') keysRef.current.down = false;
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight' || e.code === 'KeyJ') keysRef.current.run = false;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  // Update High Score helper
  const updateHighScore = useCallback((newScore: number) => {
    setHighScore((prev) => {
      if (newScore > prev) {
        try {
          localStorage.setItem('mini_mario_high_score', newScore.toString());
        } catch {}
        return newScore;
      }
      return prev;
    });
  }, []);

  // Game Loop
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const updatePhysics = (dt: number) => {
      const { player, platforms, mysteryBlocks, coins, enemies, mushroom, goal, particles } = stateRef.current;
      const keys = keysRef.current;

      if (stateRef.current.gameState !== 'PLAYING') return;

      // Pipe Warp Animation & Transition
      if (stateRef.current.warp && stateRef.current.warp.active) {
        const warp = stateRef.current.warp;
        warp.progress += dt * 1.8;

        if (warp.direction === 'down') {
          player.y += dt * 42;
          player.vx = 0;
          player.vy = 0;
          if (warp.progress >= 1.0) {
            switchZone(warp.targetZone, warp.targetX, warp.targetY);
            warp.direction = 'up';
            warp.progress = 0;
            audio.playPipe();
          }
        } else if (warp.direction === 'up') {
          player.y -= dt * 36;
          player.vx = 0;
          player.vy = 0;
          if (warp.progress >= 1.0) {
            stateRef.current.warp = null;
            player.isGrounded = true;
            player.vy = 0;
          }
        }
        return;
      }

      // Update Invulnerability
      if (player.isInvulnerable) {
        player.invulnerableTimer -= dt;
        if (player.invulnerableTimer <= 0) {
          player.isInvulnerable = false;
        }
      }

      // Pipe Entry Check (Press Down while standing on warp pipe)
      if (keys.down && !stateRef.current.warp && player.isGrounded) {
        if (stateRef.current.zone === 'overworld') {
          const warpPipe = platforms.find(
            (p) =>
              p.type === 'pipe' &&
              p.isWarpPipe &&
              p.warpTarget &&
              player.x + player.w > p.x + 4 &&
              player.x < p.x + p.w - 4 &&
              Math.abs(player.y + player.h - p.y) < 12
          );
          if (warpPipe && warpPipe.warpTarget) {
            audio.playPipe();
            stateRef.current.warp = {
              active: true,
              direction: 'down',
              progress: 0,
              targetZone: warpPipe.warpTarget.zone,
              targetX: warpPipe.warpTarget.x,
              targetY: warpPipe.warpTarget.y
            };
            addScoreParticle('SECRET ROOM!', warpPipe.x + warpPipe.w / 2, warpPipe.y - 15, '#2ecc71');
            return;
          }
        }
      }

      // Underground Exit Pipe Check:
      // When in underground, exit pipe takes player back to surface
      if (stateRef.current.zone === 'underground' && !stateRef.current.warp) {
        const exitPipe = platforms.find((p) => p.isWarpPipe && p.warpTarget);
        if (exitPipe && exitPipe.warpTarget) {
          const isAtExit =
            player.x + player.w > exitPipe.x + 4 &&
            player.x < exitPipe.x + exitPipe.w + 14 &&
            player.y + player.h >= exitPipe.y - 14;
          if (isAtExit && (keys.down || keys.right || player.x >= exitPipe.x + 8)) {
            audio.playPipe();
            stateRef.current.warp = {
              active: true,
              direction: 'down',
              progress: 0,
              targetZone: exitPipe.warpTarget.zone,
              targetX: exitPipe.warpTarget.x,
              targetY: exitPipe.warpTarget.y
            };
            addScoreParticle('SURFACE!', exitPipe.x + exitPipe.w / 2, exitPipe.y - 15, '#2ecc71');
            return;
          }
        }
      }

      // 1. Horizontal Movement & Sprinting
      const speedMultiplier = keys.run ? 1.35 : 1.0;
      const targetSpeed = player.speed * speedMultiplier;

      if (keys.left) {
        player.vx = -targetSpeed;
        player.facing = 'left';
        player.animTimer += dt;
      } else if (keys.right) {
        player.vx = targetSpeed;
        player.facing = 'right';
        player.animTimer += dt;
      } else {
        player.vx *= FRICTION;
        if (Math.abs(player.vx) < 0.1) player.vx = 0;
      }

      // 2. Jumping
      if (keys.jump && player.isGrounded) {
        player.vy = player.jumpStrength * (player.isSuper ? 1.06 : 1.0);
        player.isGrounded = false;
        audio.playJump(player.isSuper);
      }

      // 3. Gravity
      player.vy += GRAVITY;

      // 4. Horizontal Collision with Platforms
      player.x += player.vx;
      if (player.x < 0) player.x = 0;

      // Check boundary & platform horizontal collisions
      platforms.forEach((p) => {
        if (checkCollision(player, p)) {
          if (player.vx > 0) player.x = p.x - player.w;
          else if (player.vx < 0) player.x = p.x + p.w;
        }
      });

      // 5. Vertical Collision with Platforms
      player.y += player.vy;
      player.isGrounded = false;

      platforms.forEach((p) => {
        if (checkCollision(player, p)) {
          if (player.vy > 0) {
            // Landing on top
            player.y = p.y - player.h;
            player.vy = 0;
            player.isGrounded = true;
          } else if (player.vy < 0) {
            // Hitting ceiling/underside
            player.y = p.y + p.h;
            player.vy = 0;
            audio.playBump();
          }
        }
      });

      // 6. Mystery Blocks Interactions
      mysteryBlocks.forEach((b) => {
        // Bump animation decay
        if (b.bumpOffset > 0) {
          b.bumpOffset = Math.max(0, b.bumpOffset - dt * 40);
        }

        // Check if player hits mystery block
        if (checkCollision(player, b)) {
          if (player.vy > 0) {
            // Standing on block
            player.y = b.y - player.h;
            player.vy = 0;
            player.isGrounded = true;
          } else if (player.vy < 0) {
            // Hitting from below!
            player.y = b.y + b.h;
            player.vy = 0;

            if (!b.hit) {
              b.hit = true;
              b.bumpOffset = 8;
              audio.playBump();

              if (b.item === 'coin') {
                audio.playCoin();
                player.score += 50;
                player.coinsCount += 1;
                addScoreParticle('+50', b.x + b.w / 2, b.y - 12);
              } else if (b.item === 'mushroom') {
                audio.playPowerupAppear();
                mushroom.active = true;
                mushroom.emerging = true;
                mushroom.emergeY = b.y;
                mushroom.x = b.x + 2;
                mushroom.y = b.y - mushroom.h;
                mushroom.vx = 1.6;
              }

              setScore(player.score);
              setCoinsCount(player.coinsCount);
              updateHighScore(player.score);
            }
          }
        }
      });

      // 7. Mushroom Movement & Collection
      if (mushroom.active) {
        if (mushroom.emerging) {
          mushroom.emergeY -= dt * 30;
          if (mushroom.emergeY <= mushroom.y) {
            mushroom.emerging = false;
          }
        } else {
          // Normal physics
          mushroom.vy += GRAVITY;
          mushroom.x += mushroom.vx;

          // Platform collisions
          platforms.forEach((p) => {
            if (checkCollision(mushroom, p)) {
              if (mushroom.vx > 0) {
                mushroom.x = p.x - mushroom.w;
                mushroom.vx = -mushroom.vx;
              } else if (mushroom.vx < 0) {
                mushroom.x = p.x + p.w;
                mushroom.vx = -mushroom.vx;
              }
            }
          });

          mushroom.y += mushroom.vy;
          platforms.forEach((p) => {
            if (checkCollision(mushroom, p)) {
              if (mushroom.vy > 0) {
                mushroom.y = p.y - mushroom.h;
                mushroom.vy = 0;
              }
            }
          });

          // Player touches mushroom
          if (checkCollision(player, mushroom)) {
            mushroom.active = false;
            player.isSuper = true;
            player.h = 52;
            player.y -= 14;
            player.score += 200;
            audio.playPowerupCollect();
            addScoreParticle('SUPER!', player.x + player.w / 2, player.y - 15, '#ff4444');
            setScore(player.score);
            updateHighScore(player.score);
          }
        }
      }

      // 8. Pitfall detection (falling below canvas)
      if (player.y > CANVAS_HEIGHT + 60) {
        player.lives--;
        setLives(player.lives);
        audio.playHurt();

        if (player.lives <= 0) {
          stateRef.current.gameState = 'GAMEOVER';
          setGameState('GAMEOVER');
          audio.playGameOver();
          updateHighScore(player.score);
        } else {
          respawnPlayer();
        }
      }

      // 9. Goomba Enemies Patrol & Collision
      enemies.forEach((enemy) => {
        if (enemy.squished) {
          enemy.squishTimer += dt;
          if (enemy.squishTimer > 0.6) {
            enemy.squished = false;
          }
          return;
        }
        if (!enemy.alive) return;

        enemy.x += enemy.vx;
        // Simple platform edge / bounds bounce
        if (enemy.x < 10 || enemy.x > 2200) enemy.vx *= -1;

        platforms.forEach((p) => {
          if (p.type === 'pipe' && checkCollision(enemy, p)) {
            enemy.vx *= -1;
          }
        });

        // Collision with Player
        if (checkCollision(player, enemy)) {
          // Stomp from above: player falling and player's feet near enemy top
          const isStomp = player.vy > 0 && player.y + player.h - player.vy <= enemy.y + 16;

          if (isStomp) {
            enemy.alive = false;
            enemy.squished = true;
            enemy.squishTimer = 0;
            player.vy = player.jumpStrength * 0.72; // bounce
            player.score += 100;
            audio.playStomp();
            addScoreParticle('+100', enemy.x + enemy.w / 2, enemy.y - 10);
            setScore(player.score);
            updateHighScore(player.score);
          } else if (!player.isInvulnerable) {
            // Side / bottom collision
            if (player.isSuper) {
              // Shrink from Super Mario to Normal Mario
              player.isSuper = false;
              player.h = 38;
              player.isInvulnerable = true;
              player.invulnerableTimer = 2.0;
              audio.playHurt();
              addScoreParticle('OUCH!', player.x + player.w / 2, player.y - 15, '#ff8888');
            } else {
              // Lose a life
              player.lives--;
              setLives(player.lives);
              audio.playHurt();

              if (player.lives <= 0) {
                stateRef.current.gameState = 'GAMEOVER';
                setGameState('GAMEOVER');
                audio.playGameOver();
                updateHighScore(player.score);
              } else {
                respawnPlayer();
              }
            }
          }
        }
      });

      // 10. Coin Collection
      coins.forEach((c) => {
        if (!c.collected) {
          if (checkCollision(player, { x: c.x, y: c.y, w: 16, h: 16 })) {
            c.collected = true;
            player.score += 50;
            player.coinsCount += 1;
            audio.playCoin();
            addScoreParticle('+50', c.x + 8, c.y - 10);
            setScore(player.score);
            setCoinsCount(player.coinsCount);
            updateHighScore(player.score);
          }
        }
      });

      // 11. Goal Flagpole Reached
      if (!goal.reached && checkCollision(player, { x: goal.x, y: goal.y, w: goal.w, h: goal.h })) {
        goal.reached = true;
        goal.sliding = true;
        player.score += 1000;
        audio.playWin();
        addScoreParticle('+1000 COURSE CLEAR!', goal.x + 20, goal.y + 40, '#2ecc71');
        setScore(player.score);
        updateHighScore(player.score);
      }

      // Animate Flag Sliding Down
      if (goal.sliding) {
        if (goal.flagY < goal.y + goal.h - 40) {
          goal.flagY += dt * 150;
        } else {
          goal.sliding = false;
          stateRef.current.gameState = 'WON';
          setGameState('WON');
        }
      }

      // 12. Camera Follows Mario
      if (stateRef.current.zone === 'underground') {
        stateRef.current.cameraX = 0;
      } else {
        const targetCam = player.x - 220;
        stateRef.current.cameraX = Math.max(0, Math.min(1500, targetCam));
      }

      // 13. Update Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const pt = particles[i];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.life--;
        if (pt.life <= 0) {
          particles.splice(i, 1);
        }
      }
    };

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const { cameraX, platforms, mysteryBlocks, coins, enemies, mushroom, player, goal, particles, zone } = stateRef.current;
      const nowMs = performance.now();
      const nowSec = nowMs / 1000;

      // Clear & Draw background
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      drawBackground(ctx, cameraX, CANVAS_WIDTH, CANVAS_HEIGHT, zone);

      // World objects with camera translation
      ctx.save();
      ctx.translate(-cameraX, 0);

      drawPlatforms(ctx, platforms, nowMs);
      drawMysteryBlocks(ctx, mysteryBlocks, nowMs);
      drawCoins(ctx, coins, nowSec);
      drawEnemies(ctx, enemies, nowSec);
      drawMushroom(ctx, mushroom);
      if (zone === 'overworld') {
        drawGoal(ctx, goal);
      }
      drawPlayer(ctx, player, stateRef.current.gameState === 'WON');
      drawParticles(ctx, particles);

      // Underground Room Banner
      if (zone === 'underground') {
        ctx.fillStyle = '#00e5ff';
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('★ 地下隱藏密室 BONUS COIN VAULT ★', CANVAS_WIDTH / 2, 26);
      }

      ctx.restore();
    };

    const loop = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      updatePhysics(dt);
      render();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [updateHighScore]);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-start select-none font-sans">
      {/* Retro Arcade HUD */}
      <GameHUD
        score={score}
        coins={coinsCount}
        lives={lives}
        highScore={highScore}
        isMuted={isMuted}
        bgmEnabled={bgmEnabled}
        isPaused={gameState === 'PAUSED'}
        zone={currentZone}
        onToggleMute={handleToggleMute}
        onToggleBGM={handleToggleBGM}
        onTogglePause={handleTogglePause}
        onRestart={handleRestart}
        onToggleHelp={() => setShowHelp(true)}
      />

      {/* Main Game Stage Container */}
      <div className="w-full flex-1 flex flex-col items-center justify-center p-2 sm:p-4 max-w-5xl">
        <div className="relative w-full max-w-[840px] aspect-[2/1] bg-neutral-900 rounded-xl overflow-hidden shadow-2xl border-4 border-neutral-800 flex items-center justify-center">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="w-full h-full object-contain block"
            style={{ imageRendering: 'pixelated' }}
          />

          {/* Interactive State Modals */}
          <OverlayModal
            gameState={gameState}
            score={score}
            coins={coinsCount}
            highScore={highScore}
            onRestart={handleRestart}
            onResume={handleTogglePause}
            showHelp={showHelp}
            onCloseHelp={() => setShowHelp(false)}
          />
        </div>

        {/* Keyboard instructions badge for desktop */}
        <div className="mt-3 hidden sm:flex items-center justify-center gap-6 text-xs text-neutral-400 font-mono bg-neutral-900/60 px-4 py-1.5 rounded-full border border-neutral-800">
          <span>【← / → 或 A / D】移動</span>
          <span>•</span>
          <span>【空白鍵 / ↑ 或 W】跳躍</span>
          <span>•</span>
          <span>【Shift】加速</span>
          <span>•</span>
          <span>【P】暫停</span>
        </div>
      </div>

      {/* Touch Screen Controls for Mobile */}
      <TouchControls onControlChange={handleTouchControl} />
    </div>
  );
}
