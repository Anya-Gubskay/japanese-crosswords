import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PreloadService {
  private preloadedResources: Set<string> = new Set();

  constructor() {
    this.loadCache(); // Загружаем ранее кэшированные ресурсы
  }

  private loadCache(): void {
    const cachedResources = localStorage.getItem('preloadedResources');
    if (cachedResources) {
      this.preloadedResources = new Set(JSON.parse(cachedResources));
    }
  }

  private saveCache(): void {
    localStorage.setItem(
      'preloadedResources',
      JSON.stringify([...this.preloadedResources]),
    );
  }

  private preloadImage(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.preloadedResources.has(src)) {
        resolve(); // Если файл уже в кэше, не загружаем повторно
        return;
      }
      const img = new Image();
      img.src = src;
      img.onload = () => {
        this.preloadedResources.add(src);
        this.saveCache(); // Сохраняем кэш
        resolve();
      };
      img.onerror = (err) => reject(err);
    });
  }

  preloadVideo(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.preloadedResources.has(src)) {
        resolve();
        return;
      }
      fetch(src, { method: 'GET', mode: 'cors' })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to fetch video: ${response.statusText}`);
          }
          this.preloadedResources.add(src);
          this.saveCache();
          resolve();
        })
        .catch((err) => reject(err));
    });
  }

  public preloadAll(resources: string[]): Promise<void[]> {
    return Promise.all(
      resources.map((src) => {
        if (src.endsWith('.mp4') || src.endsWith('.webm')) {
          return this.preloadVideo(src);
        } else {
          return this.preloadImage(src);
        }
      }),
    );
  }
}
