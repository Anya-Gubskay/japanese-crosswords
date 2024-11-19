import {Directive, ElementRef, Renderer2, HostListener, input, inject} from '@angular/core';
import { TooltipPosition } from '../enums/tooltip.enum';

@Directive({
  standalone: true,
  selector: '[appTooltip]'
})
export class TooltipDirective {
  appTooltip = input<string>('');
  appTooltipPosition = input<TooltipPosition>(TooltipPosition.Top);

 private el = inject(ElementRef);
 private renderer = inject(Renderer2);
 private tooltipElement: HTMLElement | null = null;

  @HostListener('mouseenter') onMouseEnter() {
    if (!this.tooltipElement) {
      this.showTooltip();
    }
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.hideTooltip();
  }

  showTooltip() {
    this.tooltipElement = this.renderer.createElement('span');
    this.tooltipElement!.innerText = this.appTooltip();  // Используем оператор "!"
    this.renderer.appendChild(document.body, this.tooltipElement);

    // Добавляем класс для стилей
    this.renderer.addClass(this.tooltipElement, 'tooltip');

    // Получаем позицию элемента-хоста и тултипа
    const hostPos = this.el.nativeElement.getBoundingClientRect();
    const tooltipPos = this.tooltipElement!.getBoundingClientRect();

    // Рассчитываем позицию тултипа в зависимости от выбранного направления
    let top, left;
    switch (this.appTooltipPosition()) {
      case TooltipPosition.Top:
        top = hostPos.top - tooltipPos.height - 10 + 'px';
        left = hostPos.left + (hostPos.width - tooltipPos.width) / 2 + 'px';
        break;
      case TooltipPosition.Bottom:
        top = hostPos.bottom + 10 + 'px';
        left = hostPos.left + (hostPos.width - tooltipPos.width) / 2 + 'px';
        break;
      case TooltipPosition.Left:
        top = hostPos.top + (hostPos.height - tooltipPos.height) / 2 + 'px';
        left = hostPos.left - tooltipPos.width - 10 + 'px';
        break;
      case TooltipPosition.Right:
        top = hostPos.top + (hostPos.height - tooltipPos.height) / 2 + 'px';
        left = hostPos.right + 10 + 'px';
        break;
      default:
        top = hostPos.top - tooltipPos.height - 10 + 'px';
        left = hostPos.left + (hostPos.width - tooltipPos.width) / 2 + 'px';
        break;
    }

    // Применяем позиционирование к тултипу
    this.renderer.setStyle(this.tooltipElement, 'top', top);
    this.renderer.setStyle(this.tooltipElement, 'left', left);

    // Добавляем класс для плавного появления
    setTimeout(() => {
      if (this.tooltipElement) {  // Проверка на null
        this.renderer.addClass(this.tooltipElement, 'tooltip-active');
      }
    }, 0);
  }

  hideTooltip() {
    if (this.tooltipElement) {
      this.renderer.removeClass(this.tooltipElement, 'tooltip-active');
      setTimeout(() => {
        if (this.tooltipElement) {
          this.renderer.removeChild(document.body, this.tooltipElement);
          this.tooltipElement = null;
        }
      }, 300);  // Время, соответствующее переходу `opacity`
    }
  }
}
