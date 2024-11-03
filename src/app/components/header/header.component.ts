import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router, RouterStateSnapshot } from '@angular/router';
import {CommonModule} from "@angular/common";
import {TooltipDirective} from '@directives/tooltip.directive';
import { TooltipPosition } from '@enums/tooltip.enum';
import { distinctUntilChanged, filter } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule, TooltipDirective],
  selector: 'app-header',
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private router = inject(Router)
  protected TooltipPosition = TooltipPosition;
  protected url = signal('/')

  constructor() {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        distinctUntilChanged()
      )
      .subscribe((event: NavigationEnd) => {
        this.url.set(event.urlAfterRedirects);
      });
  }

  protected goToStart() {
    this.router.navigate(['/']);
  }

  protected goToRules() {
    this.router.navigate(['/rules']);
  }
}
