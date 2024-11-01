import {Routes} from '@angular/router';
import { SelectPuzzleComponent } from './pages/select-puzzle/select-puzzle.component';
import { PuzzleGameComponent } from './pages/puzzle-game/puzzle-game.component';
import {StartScreenComponent} from "./pages/start-screen/start-screen.component";
import {SudokuGameComponent} from "./pages/sudoku-game/sudoku-game.component";
import {PageLevelComponent} from "./pages/page-level/page-level.component";
import {RulesComponent} from "./pages/rules/rules.component";
import {SelectSudokuComponent} from "./pages/select-sudoku/select-sudoku.component";

export const routes: Routes = [
  { path: '', component: StartScreenComponent},
  { path: 'rules', component: RulesComponent},
  { path: 'select-puzzle/:level', component: SelectPuzzleComponent },
  { path: 'select-sudoku/:level', component: SelectSudokuComponent },
  { path: 'puzzle/:level/:id', component: PuzzleGameComponent },
  { path: 'sudoku/:level/:id', component: SudokuGameComponent },
  { path: 'level/:level', component: PageLevelComponent },
  { path: 'sudoku-game/:level', component: SudokuGameComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

