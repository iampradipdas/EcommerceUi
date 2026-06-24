import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  isLoading = signal(false);
  private requestCount = 0;
  show() {
    this.requestCount++;
    this.isLoading.set(true);
  }

  hide() {
    this.requestCount--;
    // Only hide when ALL requests are done
    if (this.requestCount <= 0) {
      this.requestCount = 0;
      this.isLoading.set(false);
    }
  }
}
