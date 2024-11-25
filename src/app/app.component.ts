import { HeaderComponent } from '@components/header/header.component';
import { preloadResources } from '@constants/preload-resources';
import { PreloadService } from '@services/preload.service';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  inject,
  signal,
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
  preloadService = inject(PreloadService);

  protected isLoaded = signal<boolean>(false);

  // Блокируем масштабирование при жестах на тачпаде
  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent): void {
    if (event.ctrlKey) {
      event.preventDefault(); // Отменяем зум
    }
  }

  ngOnInit(): void {
    this.preloadService
      .preloadAll(preloadResources)
      .then(() => {
        console.log('Все ресурсы загружены и кэшированы');
        this.isLoaded.set(true);
      })
      .catch((err) => {
        console.error('Ошибка загрузки ресурсов:', err);
      });
  }
}
