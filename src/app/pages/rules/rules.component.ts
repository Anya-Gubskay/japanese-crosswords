import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { setVideoAutoplay } from '@utils/video-autoplay';

@Component({
  selector: 'app-rules',
  standalone: true,
  templateUrl: './rules.component.html',
  styleUrl: './rules.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class RulesComponent implements OnInit {
  ngOnInit(): void {
    setVideoAutoplay();
  }
}
