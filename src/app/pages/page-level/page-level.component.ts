import { CardComponent } from '@components/card/card.component';
import { videosLevel } from '@constants/videos-level.constant';
import { Level } from '@enums/level.enum';
import { setVideoAutoplay } from '@utils/video-autoplay';

import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-page-level',
  standalone: true,
  imports: [CardComponent, CommonModule],
  templateUrl: './page-level.component.html',
  styleUrl: './page-level.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageLevelComponent implements OnInit {
  private router = inject(Router);
  private activeRouter = inject(ActivatedRoute);

  protected videos = signal<string[]>([]);
  protected LEVEL = Level;
  protected levels = [
    { label: 'Простой', level: this.LEVEL.Easy },
    { label: 'Средний', level: this.LEVEL.Medium },
    { label: 'Сложный', level: this.LEVEL.Hard },
  ];

  ngOnInit(): void {
    switch (this.activeRouter.snapshot.url[1].path) {
      case 'sudoku':
        this.videos.set(videosLevel.sudoku);
        break;
      case 'puzzle':
        this.videos.set(videosLevel.puzzle);
        break;
      default:
        this.videos.set(videosLevel.sudoku);
    }
  }

  ngAfterViewInit() {
    setVideoAutoplay();
  }

  selectLevel(level: string) {
    switch (this.activeRouter.snapshot.url[1].path) {
      case 'sudoku':
        this.router.navigate([`/select-sudoku`, level]);
        break;
      case 'puzzle':
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
