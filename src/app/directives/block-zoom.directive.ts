import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appBlockZoom]',
  standalone: true,
})
export class BlockZoomDirective {
  //  Блокируем масштабирование при жестах на тачпаде
  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent): void {
    if (event.ctrlKey) {
      event.preventDefault(); // Отменяем зум
    }
  }
}
