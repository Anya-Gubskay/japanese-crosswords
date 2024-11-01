import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
  OnInit,
  signal,
  WritableSignal
} from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { WinningComponent } from '@components/winning/winning.component';
import { Level } from '@enums/level.enum';
import { SudokuService } from '@services/sudoku.service';
import { CellSudoku, ItemSudoku } from '@interfaces/sudoku.interface';
import { ActionPanelComponent } from '@components/action-panel/action-panel.component';
import { LocalstorageGamesService } from '@services/localstorage-games.service';

@Component({
  standalone: true,
  imports: [CommonModule, WinningComponent, ActionPanelComponent],
  selector: 'app-sudoku-game',
  templateUrl: './sudoku-game.component.html',
  styleUrls: ['./sudoku-game.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SudokuGameComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private sudokuService = inject(SudokuService);
  private localstorageGamesService = inject(LocalstorageGamesService);

  protected grid: WritableSignal<CellSudoku[][]> = signal([]);
  protected completionMessage: WritableSignal<string> = signal('');
  protected isSolved: WritableSignal<boolean> = signal(false);
  protected selectedCell: WritableSignal<ItemSudoku | null> = signal(null);
  private solvedGrid: WritableSignal<number[][]> = signal([]);
  private level: WritableSignal<Level> = signal(Level.Easy);
  private puzzleId: WritableSignal<number> = signal(1);

  ngOnInit() {
    this.route.paramMap.subscribe(params => this.updateGameParams(params));
   this.localstorageGamesService.clearLocaleStorageToAnotherPageByKey('sudokuState');
  }

  private updateGameParams(params: ParamMap) {
    this.level.set(params.get('level') as Level || Level.Easy);
    this.puzzleId.set(+(params.get('id') as string) || 1);
    this.initializeGrid();
    this.checkCompletion();
  }

  private initializeGrid() {
    const savedState = this.localstorageGamesService.getDataLocalStorageByKey('sudokuState');
    const gridConfig = this.sudokuService.getGridConfig(this.level(), this.puzzleId())!;
    if (savedState) {
      this.grid.set(JSON.parse(savedState));
    } else {
      this.grid.set(this.sudokuService.convertGridToCells(gridConfig.initialGrid));
    }
    this.solvedGrid.set(gridConfig.solvedGrid);
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.selectedCell() && !this.isSolved()) {
      this.updateCellValue(Number(event.key));
    }
  }

  private updateCellValue(value: number) {
    const { row, col } = this.selectedCell()!;
    const currentGrid = this.grid();

    if (value >= 1 && value <= 9) {
      currentGrid[row][col] = {
        ...currentGrid[row][col],
        value: value,
        isValid: null,
        questionMark: false
      };

      this.grid.set([...currentGrid]); // Обновляем ссылку на массив для срабатывания detectChanges
      this.checkValidity(row, col);
      this.checkCompletion();
      this.saveGameState();
    }
  }

  protected onCellClick(row: number, col: number) {
    const cell = this.grid()[row][col];
    if (!cell.isFixed && !this.isSolved()) {
      this.selectedCell.set({ row, col });
    }
  }

  private checkValidity(row: number, col: number) {
    const currentCell = this.grid()[row][col];
    currentCell.isValid = currentCell.value === this.solvedGrid()[row][col];
  }

  private checkCompletion() {
    const isGameComplete = this.grid().every((row, rowIndex) =>
      row.every((cell, colIndex) => cell.value === this.solvedGrid()[rowIndex][colIndex])
    );
    if (isGameComplete) {
      this.completeGame();
    }
  }

  private completeGame() {
    this.completionMessage.set("Вы выиграли!");
    this.grid().forEach(row =>
      row.forEach(cell => {
        if (!cell.isFixed) {
          cell.isValid = true;
          cell.isFixed = true;
        }
      })
    );
    setTimeout(() => this.isSolved.set(true), 1000);
  }

  protected getDelay(rowIndex: number, colIndex: number): number {
    return (rowIndex * this.grid()[0].length + colIndex) * 25; // 50ms для ускорения анимации
  }

  private saveGameState() {
    this.localstorageGamesService.saveGridState<CellSudoku[][]>(this.grid(), 'sudokuState');
  }

  protected restartGame() {
    this.isSolved.set(false);
    this.completionMessage.set('');
    this.localstorageGamesService.clearLocalStorageByKey('sudokuState');
    this.initializeGrid();
  }

  protected goToSelectSudoku() {
    this.router.navigate(['/select-sudoku', this.level()]);
  }
}
