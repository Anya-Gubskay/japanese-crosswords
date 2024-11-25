import { ActionPanelComponent } from '@components/action-panel/action-panel.component';
import { WinningComponent } from '@components/winning/winning.component';
import { MouseTrackerDirective } from '@directives/mouse-tracker.directive';
import { Level } from '@enums/level.enum';
import { Cell, Puzzle } from '@interfaces/puzzle.interface';
import { LocalstorageGamesService } from '@services/localstorage-games.service';
import { PuzzleService } from '@services/puzzle.service';

import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { imagesWinnerByGame } from './../../constants/images-winner.constant';

@Component({
    imports: [
        CommonModule,
        WinningComponent,
        MouseTrackerDirective,
        ActionPanelComponent,
    ],
    selector: 'app-puzzle-game',
    templateUrl: './puzzle-game.component.html',
    styleUrls: ['./puzzle-game.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PuzzleGameComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private puzzleService = inject(PuzzleService);
  private localstorageGamesService = inject(LocalstorageGamesService);

  protected puzzle!: Puzzle;
  protected isSolved: WritableSignal<boolean> = signal(false);
  protected level: WritableSignal<Level> = signal(Level.Easy);
  protected grid: WritableSignal<Cell[][]> = signal([]);
  protected completionMessage: WritableSignal<string> = signal('');

  private highlightedRow: WritableSignal<number | null> = signal(null);
  private highlightedCol: WritableSignal<number | null> = signal(null);

  // Переменные для отслеживания процесса выделения
  private isDragging = signal(false);
  private isFilling: WritableSignal<boolean | null> = signal(null); // true для закраски, false для очистки
  private isMarking: WritableSignal<boolean | null> = signal(null); // true для крестиков, false для удаления крестиков
  private isPainting: WritableSignal<boolean> = signal(false);

  protected imgSrc = imagesWinnerByGame.puzzle;

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.completionMessage.set('');
      this.isSolved.set(false);
      const puzzleId = +params.get('id')!;
      this.level.set(params.get('level') as Level);
      this.loadPuzzle(puzzleId, this.level());
    });
    this.loadGridState();
    this.checkSolution();
    this.localstorageGamesService.clearLocaleStorageToAnotherPageByKey(
      'puzzleGrid',
    );
  }

  private loadPuzzle(id: number, level: Level) {
    const puzzle = this.puzzleService.getGridConfigByLevelAndId(level, id);
    if (puzzle) {
      this.puzzle = puzzle;
      this.grid.set(this.puzzleService.createEmptyGrid(this.puzzle.size));
      this.completionMessage.set('');
      this.isSolved.set(false);
    } else {
      alert('Кроссворд не найден');
      this.router.navigate(['/select-puzzle']);
    }
  }

  protected onMouseDown(
    row: number,
    col: number,
    event: MouseEvent | TouchEvent,
  ) {
    event.preventDefault(); // Предотвращаем стандартное поведение

    if (this.isSolved()) return;

    const cell = this.grid()[row][col];
    this.isDragging.set(true);

    // Независимо от типа события, выполняем действие на ячейке
    this.processCellAction(cell, row, col);
  }

  private processCellAction(cell: Cell, row: number, col: number) {
    if (!cell.filled && !cell.marked) {
      // Первый клик: закрашивание
      this.isFilling.set(true);
      this.isMarking.set(null);
    } else if (cell.filled) {
      // Второй клик: установка крестика
      this.isFilling.set(null);
      this.isMarking.set(true);
      cell.filled = false;
    } else if (cell.marked) {
      // Третий клик: очистка клетки
      this.isFilling.set(false);
      this.isMarking.set(false);
    }
    this.puzzleService.updateCell(
      row,
      col,
      this.grid,
      this.isFilling,
      this.isMarking,
    );
  }

  protected onMouseUp() {
    this.isDragging.set(false);
    this.isFilling.set(null);
    this.isMarking.set(null);
    this.isPainting.set(false);
    this.checkSolution();
  }

  protected onMouseMove(row: number, col: number): void {
    this.highlightedRow.set(row);
    this.highlightedCol.set(col);

    if (!this.isDragging() || this.isSolved()) return;

    this.puzzleService.updateCell(
      row,
      col,
      this.grid,
      this.isFilling,
      this.isMarking,
    );
  }

  protected onTouchStart(row: number, col: number, event: TouchEvent) {
    event.preventDefault();
    this.onMouseDown(row, col, event);
  }

  protected onTouchEnd() {
    this.onMouseUp();
  }

  private loadGridState() {
    const savedGrid =
      this.localstorageGamesService.getDataLocalStorageByKey('puzzleGrid');
    if (savedGrid) {
      const parsedGrid: Cell[][] = JSON.parse(savedGrid);
      this.grid.set(parsedGrid); // Загрузка состояния из localStorage
    }
  }

  private checkSolution(): void {
    if (!this.puzzle) return;

    const { solution, name } = this.puzzle;
    const currentGrid = this.grid();

    // Проверка на соответствие текущего состояния решению
    const hasMistakes = currentGrid.some((row, i) =>
      row.some((cell, j) => cell.filled !== solution[i][j]),
    );

    if (hasMistakes) {
      this.isSolved.set(false);
      this.completionMessage.set('');
      return;
    }

    // Если ошибок нет, считаем головоломку решенной
    this.isSolved.set(true);
    this.completionMessage.set(name);

    // Обновление состояния ячеек (снимаем отметку "marked")
    this.grid.update((grid) =>
      grid.map((row) =>
        row.map((cell) => ({
          ...cell,
          marked: false,
        })),
      ),
    );
  }

  protected restartGame(): void {
    if (!this.puzzle) return;
    this.completionMessage.set('');
    this.isSolved.set(false);
    this.grid.set(this.puzzleService.createEmptyGrid(this.puzzle.size));
    this.localstorageGamesService.clearLocalStorageByKey('puzzleGrid');
  }

  protected goToSelectPuzzle() {
    this.router.navigate(['/select-puzzle', this.level()]);
  }

  protected getDelay(rowIndex: number, colIndex: number): number {
    return (rowIndex * this.puzzle.size + colIndex) * 20; // 20 мс на клетку
  }

  get maxColHints(): number {
    return Math.max(...this.puzzle.colHints.map((hints) => hints.length));
  }

  get maxRowHints(): number {
    return Math.max(...this.puzzle.rowHints.map((hints) => hints.length));
  }

  protected generateArray(n: number): number[] {
    return Array.from({ length: n }, (_, i) => i);
  }

  protected isHighlightedRow(rowIndex: number): boolean {
    return this.isSolved() ? false : this.highlightedRow() === rowIndex;
  }

  protected isHighlightedCol(colIndex: number): boolean {
    return this.isSolved() ? false : this.highlightedCol() === colIndex;
  }

  // Проверка, решен ли ряд
  protected isRowSolved(rowIndex: number): boolean {
    const solutionRow = this.puzzle.solution[rowIndex];
    const gridRow = this.grid()[rowIndex];
    const isRowSolved = solutionRow.every(
      (value, colIndex) => gridRow[colIndex].filled === value,
    );
    if (isRowSolved) {
      gridRow
        .filter((cell) => !cell.filled)
        .forEach((cell) => (cell.marked = true));
    }

    return isRowSolved;
  }

  // Проверка, решен ли столбец
  protected isColumnSolved(colIndex: number): boolean {
    const solutionCol = this.puzzle.solution.map((row) => row[colIndex]);
    const gridCol = this.grid().map((row) => row[colIndex]);
    const isColumnSolved = solutionCol.every(
      (value, rowIndex) => gridCol[rowIndex].filled === value,
    );
    if (isColumnSolved) {
      gridCol
        .filter((cell) => !cell.filled)
        .forEach((cell) => (cell.marked = true));
    }
    return isColumnSolved;
  }
}
