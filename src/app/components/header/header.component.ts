import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {Router} from '@angular/router';
import {CommonModule} from "@angular/common";
import {TooltipDirective} from '@directives/tooltip.directive';
import { TooltipPosition } from '@enums/tooltip.enum';

@Component({
  standalone: true,
  imports: [CommonModule, TooltipDirective],
  selector: 'app-header',
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private router = inject(Router);
  protected TooltipPosition = TooltipPosition;

  protected isRouteActive(url: string) {
   return this.router.url === url
  }

  protected goToStart() {
    this.router.navigate(['/']);
  }

  protected goToRules() {
    this.router.navigate(['/rules']);
  }
}
