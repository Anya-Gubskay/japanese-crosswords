import {Directive, HostListener, Renderer2, OnDestroy, inject, output} from '@angular/core';

@Directive({
  standalone: true,
  selector: '[appMouseTracker]'
})
export class MouseTrackerDirective implements OnDestroy {
 mouseDownEvent = output<MouseEvent>();
 mouseUpEvent = output<void>();

  private mouseUpListener: (() => void) | null = null;
  private renderer = inject(Renderer2);

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    this.mouseDownEvent.emit(event); // Эмитим событие для родительского компонента
    this.mouseUpListener = this.renderer.listen('document', 'mouseup', () => {
      this.onGlobalMouseUp();
    });
  }

  private onGlobalMouseUp() {
    this.mouseUpEvent.emit();
    this.removeMouseUpListener();
  }

  private removeMouseUpListener() {
    if (this.mouseUpListener) {
      this.mouseUpListener();
      this.mouseUpListener = null;
    }
  }

  ngOnDestroy() {
    this.removeMouseUpListener();
  }
}

