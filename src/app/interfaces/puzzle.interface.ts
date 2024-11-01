export interface Puzzle {
  id: number;
  name: string;
  classColorText: string;
  classBackground: string;
  size: number;
  sizeClasses: string;
  rowHints: number[][];
  colHints: number[][];
  solution: boolean[][];
  srcImg: string;
  textSizeClass?: string;
}

export interface Cell {
  filled: boolean | null;
  marked: boolean | null;
}

