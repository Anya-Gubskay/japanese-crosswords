import { CardComponent } from '@components/card/card.component';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  imports: [CardComponent],
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StartScreenComponent {
  private router = inject(Router);

  constructor() {
    localStorage.clear();
  }

  goToPuzzles() {
    this.router.navigate(['/level', 'puzzle']);
  }

  goToSudoku() {
    this.router.navigate(['/level', 'sudoku']);
  }
}
