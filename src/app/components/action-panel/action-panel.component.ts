import { ChangeDetectionStrategy, Component, output } from '@angular/core';

@Component({
  selector: 'app-action-panel',
  templateUrl: './action-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionPanelComponent {
  protected reset = output<void>();
  protected chooseAnotherCrossword = output<void>();
}
