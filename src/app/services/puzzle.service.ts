import { inject, Injectable, WritableSignal } from '@angular/core';
import {Cell, Puzzle} from '@interfaces/puzzle.interface';
import {Level} from '@enums/level.enum';
import { LocalstorageGamesService } from '@services/localstorage-games.service';
import { PUZZLE } from '@constants/puzzle.constant';


@Injectable({
  providedIn: 'root',
})
export class PuzzleService {
  private localStorageGamesService = inject(LocalstorageGamesService)

  getPuzzles(level: Level): Puzzle[] {
    switch (level) {
      case Level.Easy:
        return PUZZLE.EASY;
      case Level.Medium:
        return PUZZLE.MEDIUM;
      case Level.Hard:
        return PUZZLE.HARD;
      default:
        return PUZZLE.EASY;
    }
  }

  getGridConfigByLevelAndId(level: string, id: number): Puzzle {
    switch (level) {
      case (Level.Easy):
        return PUZZLE.EASY[id-1];
      case (Level.Medium):
        return PUZZLE.MEDIUM[id-1];
      case (Level.Hard):
        return PUZZLE.HARD[id-1];
      default:
        return PUZZLE.EASY[id-1];
    }
  }

  createEmptyGrid(size: number): Cell[][] {
    return Array.from({ length: size }, () =>
      Array.from({ length: size }, () => ({
        filled: false,
        marked: false,
      }))
    );
  }

  public updateCell(row: number, col: number, grid: WritableSignal<Cell[][]>, isFilling: WritableSignal<boolean | null>, isMarking: WritableSignal<boolean | null>): void {
    grid.update(grid =>
      grid.map((r, i) => r.map((cell, j) => this.getUpdatedCell(cell, i === row && j === col, isFilling, isMarking)))
    );
    this.localStorageGamesService.saveGridState<Cell[][]>(grid(), 'puzzleGrid');
  }

  private getUpdatedCell(cell: Cell, isTargetCell: boolean, isFilling: WritableSignal<boolean | null>, isMarking: WritableSignal<boolean | null>): Cell {
    if (!isTargetCell) return cell;

    if (isFilling() !== null) {
      return this.applyFill(cell, isFilling);
    }

    if (isMarking() !== null) {
      return this.applyMark(cell, isMarking);
    }

    return cell;
  }

  private applyFill(cell: Cell, isFilling: WritableSignal<boolean | null>): Cell {
    return {
      ...cell,
      filled: isFilling(),
      marked: false, // Если закрашиваем, убираем крестики
    };
  }

  private applyMark(cell: Cell, isMarking: WritableSignal<boolean | null>): Cell {
    return {
      ...cell,
      marked: isMarking(),
      filled: false, // Если ставим крестик, убираем закрашивание
    };
  }
}
