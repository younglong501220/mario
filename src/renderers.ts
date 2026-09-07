import { Player, Platform, MysteryBlock, Coin, Enemy, MushroomItem, Particle, GoalFlag, GameZone } from './types';

export function drawBackground(ctx: CanvasRenderingContext2D, cameraX: number, width: number, height: number, zone: GameZone = 'overworld') {
  if (zone === 'underground') {
    // Classic pitch black underground cavern
    ctx.fillStyle = '#050510';
    ctx.fillRect(0, 0, width, height);

    // Subtle background cavern pillars
    ctx.fillStyle = '#0d1527';
    for (let i = 0; i < 6; i++) {
      const px = i * 160 - (cameraX * 0.2) % 160;
      ctx.fillRect(px, 40, 40, height - 80);
    }
    return;
  }

  // Overworld Sky
  ctx.fillStyle = '#5c94fc';
  ctx.fillRect(0, 0, width, height);

  const hillOffset = -(cameraX * 0.3) % 800;
  ctx.fillStyle = '#22b14c';
  for (let i = -1; i < 4; i++) {
    const baseX = hillOffset + i * 400;
    ctx.beginPath();
    ctx.arc(baseX + 120, height - 50, 160, Math.PI, 0);
    ctx.fill();
  }

  const cloudOffset = -(cameraX * 0.15) % 600;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  for (let i = -1; i < 4; i++) {
    const cx = cloudOffset + i * 360;
    ctx.beginPath();
    ctx.arc(cx + 60, 70, 22, 0, Math.PI * 2);
    ctx.arc(cx + 90, 58, 30, 0, Math.PI * 2);
    ctx.arc(cx + 120, 70, 22, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function drawPlatforms(ctx: CanvasRenderingContext2D, platforms: Platform[], timeMs: number = 0) {
  platforms.forEach((p) => {
    if (p.type === 'pipe') {
      ctx.fillStyle = '#00a800';
      ctx.fillRect(p.x - 4, p.y, p.w + 8, 16);
      ctx.fillStyle = '#00d800';
      ctx.fillRect(p.x - 2, p.y + 2, 6, 12);
      ctx.strokeStyle = '#004800';
      ctx.lineWidth = 2;
      ctx.strokeRect(p.x - 4, p.y, p.w + 8, 16);

      ctx.fillStyle = '#00a800';
      ctx.fillRect(p.x, p.y + 16, p.w, p.h - 16);
      ctx.fillStyle = '#00d800';
      ctx.fillRect(p.x + 2, p.y + 16, 6, p.h - 16);
      ctx.strokeStyle = '#004800';
      ctx.strokeRect(p.x, p.y + 16, p.w, p.h - 16);

      // If this pipe is a warp pipe, draw a pulsing arrow / hint!
      if (p.isWarpPipe) {
        const bounce = Math.sin(timeMs * 0.008) * 4;
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        // Downward arrow
        ctx.moveTo(p.x + p.w / 2, p.y - 10 + bounce);
        ctx.lineTo(p.x + p.w / 2 - 8, p.y - 20 + bounce);
        ctx.lineTo(p.x + p.w / 2 + 8, p.y - 20 + bounce);
        ctx.closePath();
        ctx.fill();

        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('▼ 按下進入', p.x + p.w / 2, p.y - 24 + bounce);
      }
    } else if (p.type === 'underground_brick') {
      // Blue subterranean bricks
      ctx.fillStyle = '#0058a0';
      ctx.fillRect(p.x, p.y, p.w, p.h);
      ctx.strokeStyle = '#002040';
      ctx.lineWidth = 2;
      ctx.strokeRect(p.x, p.y, p.w, p.h);

      const brickSize = 30;
      const count = Math.floor(p.w / brickSize);
      ctx.fillStyle = '#0080d0';
      for (let b = 0; b < count; b++) {
        const bx = p.x + b * brickSize;
        ctx.fillRect(bx + 2, p.y + 2, brickSize - 4, p.h - 4);
      }
    } else if (p.type === 'underground_ground') {
      // Blue stone floor
      ctx.fillStyle = '#004080';
      ctx.fillRect(p.x, p.y, p.w, p.h);
      ctx.fillStyle = '#0070c0';
      ctx.fillRect(p.x, p.y, p.w, 8);
      ctx.strokeStyle = '#001830';
      ctx.strokeRect(p.x, p.y, p.w, p.h);
    } else if (p.type === 'brick') {
      ctx.fillStyle = '#b84418';
      ctx.fillRect(p.x, p.y, p.w, p.h);
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.strokeRect(p.x, p.y, p.w, p.h);

      const brickSize = 30;
      const count = Math.floor(p.w / brickSize);
      ctx.fillStyle = '#d45324';
      for (let b = 0; b < count; b++) {
        const bx = p.x + b * brickSize;
        ctx.fillRect(bx + 2, p.y + 2, brickSize - 4, p.h - 4);
      }
    } else {
      ctx.fillStyle = '#8b4513';
      ctx.fillRect(p.x, p.y, p.w, p.h);
      ctx.fillStyle = '#00aa00';
      ctx.fillRect(p.x, p.y, p.w, 8);
    }
  });
}

export function drawMysteryBlocks(ctx: CanvasRenderingContext2D, blocks: MysteryBlock[], timeMs: number) {
  blocks.forEach((b) => {
    const yPos = b.y - b.bumpOffset;
    if (b.hit) {
      ctx.fillStyle = '#8b5a2b';
      ctx.fillRect(b.x, yPos, b.w, b.h);
      ctx.strokeStyle = '#4a2810';
      ctx.lineWidth = 2;
      ctx.strokeRect(b.x, yPos, b.w, b.h);
    } else {
      const pulse = Math.sin(timeMs * 0.006) > 0;
      ctx.fillStyle = pulse ? '#fc9838' : '#e47814';
      ctx.fillRect(b.x, yPos, b.w, b.h);
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.strokeRect(b.x, yPos, b.w, b.h);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('?', b.x + b.w / 2, yPos + b.h / 2 + 1);
    }
  });
}

export function drawCoins(ctx: CanvasRenderingContext2D, coins: Coin[], timeSec: number) {
  coins.forEach((c) => {
    if (c.collected) return;
    const spin = Math.abs(Math.sin(timeSec * 5 + c.spinOffset));
    const width = Math.max(3, 14 * spin);

    ctx.save();
    ctx.translate(c.x + 8, c.y + 8);
    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.ellipse(0, 0, width / 2, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#b8860b';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
  });
}

export function drawEnemies(ctx: CanvasRenderingContext2D, enemies: Enemy[], timeSec: number) {
  enemies.forEach((enemy) => {
    if (!enemy.alive && !enemy.squished) return;

    if (enemy.squished) {
      ctx.fillStyle = '#a52a2a';
      ctx.fillRect(enemy.x, enemy.y + 18, enemy.w, 10);
      return;
    }

    const step = Math.sin(timeSec * 10) > 0;
    ctx.fillStyle = '#a52a2a';
    ctx.fillRect(enemy.x, enemy.y, enemy.w, enemy.h);

    ctx.fillStyle = '#fff';
    ctx.fillRect(enemy.x + 4, enemy.y + 6, 6, 8);
    ctx.fillRect(enemy.x + enemy.w - 10, enemy.y + 6, 6, 8);
    ctx.fillStyle = '#000';
    ctx.fillRect(enemy.x + 6, enemy.y + 8, 3, 4);
    ctx.fillRect(enemy.x + enemy.w - 8, enemy.y + 8, 3, 4);

    ctx.fillStyle = '#000';
    if (step) {
      ctx.fillRect(enemy.x - 2, enemy.y + enemy.h - 4, 10, 4);
      ctx.fillRect(enemy.x + enemy.w - 8, enemy.y + enemy.h - 4, 8, 4);
    } else {
      ctx.fillRect(enemy.x + 2, enemy.y + enemy.h - 4, 8, 4);
      ctx.fillRect(enemy.x + enemy.w - 10, enemy.y + enemy.h - 4, 10, 4);
    }
  });
}

export function drawMushroom(ctx: CanvasRenderingContext2D, m: MushroomItem) {
  if (!m.active) return;
  const y = m.emerging ? m.emergeY : m.y;

  ctx.fillStyle = '#e52521';
  ctx.beginPath();
  ctx.arc(m.x + m.w / 2, y + 10, 12, Math.PI, 0);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(m.x + m.w / 2, y + 5, 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#fce4c8';
  ctx.fillRect(m.x + 4, y + 10, m.w - 8, 12);
  ctx.fillStyle = '#000000';
  ctx.fillRect(m.x + 6, y + 12, 2, 4);
  ctx.fillRect(m.x + m.w - 8, y + 12, 2, 4);
}

export function drawPlayer(ctx: CanvasRenderingContext2D, p: Player, isWon: boolean) {
  if (p.isInvulnerable && Math.floor(p.invulnerableTimer * 20) % 2 === 0) {
    return;
  }

  ctx.save();
  ctx.translate(p.x, p.y);

  if (p.facing === 'left') {
    ctx.translate(p.w, 0);
    ctx.scale(-1, 1);
  }

  const hRatio = p.isSuper ? 1.35 : 1.0;
  const isJumping = !p.isGrounded;

  // Hat & Visor
  ctx.fillStyle = '#e52521';
  ctx.fillRect(4, 0, p.w - 6, 8 * hRatio);
  ctx.fillRect(10, 4 * hRatio, p.w - 6, 4 * hRatio);

  // Face
  ctx.fillStyle = '#fce4c8';
  ctx.fillRect(6, 8 * hRatio, p.w - 12, 10 * hRatio);
  // Mustache & Eye
  ctx.fillStyle = '#000000';
  ctx.fillRect(16, 9 * hRatio, 3, 4 * hRatio);
  ctx.fillRect(14, 14 * hRatio, 10, 3 * hRatio);

  // Red Shirt
  ctx.fillStyle = '#e52521';
  ctx.fillRect(4, 18 * hRatio, p.w - 8, 10 * hRatio);
  if (isJumping || isWon) {
    ctx.fillRect(p.w - 8, 12 * hRatio, 6, 8 * hRatio);
  }

  // Blue Overalls
  ctx.fillStyle = '#0026ff';
  ctx.fillRect(6, 24 * hRatio, p.w - 12, 10 * hRatio);
  ctx.fillRect(7, 18 * hRatio, 4, 8 * hRatio);
  ctx.fillRect(p.w - 11, 18 * hRatio, 4, 8 * hRatio);

  // Buttons
  ctx.fillStyle = '#ffd700';
  ctx.fillRect(8, 23 * hRatio, 2, 2 * hRatio);
  ctx.fillRect(p.w - 10, 23 * hRatio, 2, 2 * hRatio);

  // Shoes
  ctx.fillStyle = '#6a2800';
  ctx.fillRect(2, p.h - 6, 10, 6);
  ctx.fillRect(p.w - 12, p.h - 6, 10, 6);

  ctx.restore();
}

export function drawGoal(ctx: CanvasRenderingContext2D, goal: GoalFlag) {
  ctx.fillStyle = '#3a873a';
  ctx.fillRect(goal.x - 6, goal.y + goal.h - 16, goal.w + 12, 16);

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(goal.x, goal.y, goal.w, goal.h - 16);

  ctx.fillStyle = '#ffd700';
  ctx.beginPath();
  ctx.arc(goal.x + goal.w / 2, goal.y - 4, 7, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#2ecc71';
  ctx.beginPath();
  ctx.moveTo(goal.x + goal.w, goal.flagY);
  ctx.lineTo(goal.x + goal.w + 36, goal.flagY + 18);
  ctx.lineTo(goal.x + goal.w, goal.flagY + 36);
  ctx.closePath();
  ctx.fill();

  const castleX = 2170;
  const castleY = 190;
  const castleW = 120;
  const castleH = 160;

  ctx.fillStyle = '#9e9e9e';
  ctx.fillRect(castleX, castleY, castleW, castleH);
  ctx.fillRect(castleX, castleY - 16, 24, 16);
  ctx.fillRect(castleX + 36, castleY - 16, 24, 16);
  ctx.fillRect(castleX + 72, castleY - 16, 24, 16);
  ctx.fillRect(castleX + 96, castleY - 16, 24, 16);

  ctx.fillStyle = '#111111';
  ctx.beginPath();
  ctx.arc(castleX + castleW / 2, castleY + castleH - 40, 20, Math.PI, 0);
  ctx.rect(castleX + castleW / 2 - 20, castleY + castleH - 40, 40, 40);
  ctx.fill();
}

export function drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[]) {
  particles.forEach((p) => {
    const alpha = Math.max(0, p.life / p.maxLife);
    ctx.save();
    ctx.globalAlpha = alpha;
    if (p.text) {
      ctx.fillStyle = p.color;
      ctx.font = 'bold 15px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(p.text, p.x, p.y);
    } else {
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    }
    ctx.restore();
  });
}
