import { inject, Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class LocalstorageGamesService {
  private router = inject(Router);

  public saveGridState<T>(grid: T, key: string) {
    localStorage.setItem(key, JSON.stringify(grid));
  }

  public clearLocalStorageByKey(key: string) {
    localStorage.removeItem(key);
  }

  public getDataLocalStorageByKey(key: string): string | null {
    return localStorage.getItem(key);
  }

  public clearLocaleStorageToAnotherPageByKey(key: string) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.clearLocalStorageByKey(key); // Очистка состояния
      }
    });
  }
}
