import { ChangeDetectionStrategy, Component, output } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {
  onClickCard = output<void>();
}
