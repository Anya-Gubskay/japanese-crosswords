import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-winning',
  standalone: true,
  templateUrl: './winning.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WinningComponent {
  imgSrc = input<string>();
}
