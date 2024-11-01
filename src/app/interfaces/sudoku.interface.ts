export interface Sudoku {
  id: number,
  grid: (number | null)[][],
  solvedGrid: number[][],
  srcImg: string,
}

export interface CellSudoku {
  value: number | null;
  questionMark: boolean;
  isFixed: boolean;
  isValid: boolean | null; // Для подсветки правильности
}

export interface SudokuForms {
initialGrid: (number | null)[][],
  solvedGrid: number[][]
}

export interface ItemSudoku {
  row: number,
  col: number
}
