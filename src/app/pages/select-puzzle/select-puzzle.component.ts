import { CardComponent } from '@components/card/card.component';
import { Level } from '@enums/level.enum';
import { Puzzle } from '@interfaces/puzzle.interface';
import { PuzzleService } from '@services/puzzle.service';
import {
  SimplebarAngularComponent,
  SimplebarAngularModule,
} from 'simplebar-angular';

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

@Component({
  imports: [CommonModule, CardComponent, SimplebarAngularModule],
  selector: 'app-select-puzzle',
  templateUrl: './select-puzzle.component.html',
  styleUrls: ['./select-puzzle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectPuzzleComponent implements OnInit {
  protected puzzles: WritableSignal<Puzzle[]> = signal([]);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private puzzleService = inject(PuzzleService);
  private level = Level.Easy;
  protected optionsForSimpleBar = { autoHide: false, scrollbarMinSize: 100 };

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.level = params.get('level') as Level;
      this.puzzles.set(this.puzzleService.getPuzzles(this.level));
    });
  }

  selectPuzzle(puzzleId: number) {
    this.router.navigate(['/puzzle', this.level, puzzleId]);
  }

  goToSelectLevels() {
    this.router.navigate(['/level/puzzle']);
  }
}
