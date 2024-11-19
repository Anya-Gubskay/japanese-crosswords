import { HeaderComponent } from '@components/header/header.component';

import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  // Блокируем масштабирование при жестах на тачпаде
  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent): void {
    if (event.ctrlKey) {
      event.preventDefault(); // Отменяем зум
    }
  }
}
