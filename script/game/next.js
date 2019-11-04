import GameModule from './game-module.js';
import {clearCtx} from '../shortcuts.js';
import * as randomizer from './modules/randomizers.js';
import {PIECE_SETS, PIECES} from '../consts.js';

export default class Next extends GameModule {
  constructor(parent, ctx, ctxSub) {
    super(parent);
    this.ctx = ctx;
    this.reset();
    this.subCtx = ctxSub;
    this.nextLength = this.parent.userSettings.nextLength;
    this.queue = [];
    for (let i = 0; i < this.nextLength; i++) {
      this.generate();
    }
  }
  reset() {
    this.gen = randomizer.bag(PIECE_SETS.standard, PIECE_SETS.standardUnfavored);
  }
  next() {
    this.generate();
    this.isDirty = true;
    return this.queue.shift();
  }
  generate() {
    this.queue.push(this.gen.next().value);
  }
  drawMino(x, y) {
    const cellSize = this.parent.cellSize;
    const ctx = this.ctx;
    const xPos = x * cellSize;
    const yPos = y * cellSize;
    const img = document.getElementById(`mino-${this.color}`);
    img.height = cellSize;
    ctx.globalCompositeOperation = 'source-over';

    ctx.drawImage(img, xPos, Math.floor(yPos), cellSize, cellSize);
  }
  draw() {
    const piece = this.queue[0];
    const shape = PIECES[piece].shape[0];
    let cellSize = this.parent.cellSize;
    const offset = this.parent.nextOffsets[piece];
    let ctx = this.ctx;
    clearCtx(this.ctx);
    clearCtx(this.subCtx);
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        const color = this.parent.colors[piece];
        const img = document.getElementById(`mino-${color}`);
        const isFilled = shape[y][x];
        if (isFilled) {
          const xPos = x * cellSize + offset[0] * cellSize;
          const yPos = y * cellSize + offset[1] * cellSize;
          img.height = cellSize;
          ctx.drawImage(img, xPos, Math.floor(yPos), cellSize, cellSize);
        }
      }
    }
    cellSize = Math.floor(cellSize * .62);
    ctx = this.subCtx;
    const nextCount = this.nextLength - 1;
    const multiplier = 3;
    for (let nextSpace = 0; nextSpace < nextCount; nextSpace++) {
      const piece = this.queue[nextSpace + 1];
      const shape = PIECES[piece].shape[0];
      const offset = this.parent.nextOffsets[piece];
      for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
          const color = this.parent.colors[piece];
          const img = document.getElementById(`mino-${color}`);
          const isFilled = shape[y][x];
          if (isFilled) {
            const xPos = x * cellSize + offset[0] * cellSize;
            const yPos = y * cellSize + offset[1] * cellSize + nextSpace * cellSize * multiplier;
            img.height = cellSize;
            ctx.drawImage(img, xPos, Math.floor(yPos), cellSize, cellSize);
          }
        }
      }
    }
  }
}