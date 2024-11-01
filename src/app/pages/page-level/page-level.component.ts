import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CommonModule} from "@angular/common";
import {CardComponent} from '@components/card/card.component';
import {Level} from '@enums/level.enum';
import { setVideoAutoplay } from '@utils/video-autoplay';

@Component({
  selector: 'app-page-level',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './page-level.component.html',
  styleUrl: './page-level.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageLevelComponent implements OnInit{
  private router = inject(Router);
  private activeRouter = inject(ActivatedRoute);
  protected LEVEL = Level;

  ngOnInit(): void {
    setVideoAutoplay()
  }

  selectLevel(level: string) {
    switch (this.activeRouter.snapshot.url[1].path) {
      case('sudoku'):
        this.router.navigate([`/select-sudoku`, level]);
        break;
      case('puzzle'):
        this.router.navigate([`/select-puzzle`, level]);
        break;
      default:
        this.router.navigate([`/select-sudoku`, level]);
    }
  }

  goToStartPage() {
    this.router.navigate([`/`]);
  }
}
