import { ChangeDetectionStrategy, Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ActivatedRoute, Router} from "@angular/router";
import {Level} from '@enums/level.enum';
import {Sudoku} from '@interfaces/sudoku.interface';
import {SudokuService} from '@services/sudoku.service';

@Component({
  selector: 'app-select-sudoku',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './select-sudoku.component.html',
  styleUrl: './select-sudoku.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectSudokuComponent implements OnInit{
  protected sudoku:WritableSignal<Sudoku[]> = signal([]);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private sudokuService = inject(SudokuService);
  private level = Level.Easy;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.level = params.get('level') as Level;
      this.sudoku.set(this.sudokuService.getSudoku(this.level));
    });
  }

  selectSudoku(sudokuId: number) {
    this.router.navigate(['/sudoku', this.level, sudokuId]);
  }

  goToSelectLevels() {
    this.router.navigate(['/level/sudoku']);
  }
}
