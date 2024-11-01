import {Injectable} from "@angular/core";
import {CellSudoku, Sudoku, SudokuForms} from '@interfaces/sudoku.interface';
import {Level} from '@enums/level.enum';
import { SUDOKU } from '@constants/sudoku.constant';

@Injectable({providedIn: 'root'})
export class SudokuService {
  getSudoku(level: Level): Sudoku[] {
    switch (level) {
      case Level.Easy:
        return SUDOKU.EASY;
      case Level.Medium:
        return SUDOKU.MEDIUM;
      case Level.Hard:
        return SUDOKU.HARD;
      default:
        return SUDOKU.EASY;
    }
  }

  getGridConfig(level: string, id: number): SudokuForms | null {
    switch (level) {
      case (Level.Easy):
        return { initialGrid: SUDOKU.EASY[id-1]?.grid, solvedGrid: SUDOKU.EASY[id-1]?.solvedGrid }
      case (Level.Medium):
        return { initialGrid: SUDOKU.MEDIUM[id-1]?.grid, solvedGrid: SUDOKU.MEDIUM[id-1]?.solvedGrid }
      case (Level.Hard):
        return { initialGrid: SUDOKU.HARD[id-1]?.grid, solvedGrid: SUDOKU.HARD[id-1]?.solvedGrid }
      default:
        return { initialGrid: SUDOKU.EASY[id-1]?.grid, solvedGrid: SUDOKU.EASY[id-1]?.solvedGrid }
    }
  }

  convertGridToCells(grid: (number | null)[][]): CellSudoku[][] {
    return grid.map(row =>
      row.map(value => ({
        value,
        questionMark: false,
        isFixed: value !== null,
        isValid: null
      }))
    );
  }
}
