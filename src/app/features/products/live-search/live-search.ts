import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '../services/product-service';
import { Product } from '../../../core/models/product';
import { catchError, debounceTime, distinctUntilChanged, filter, of, Subject, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-live-search',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports:         [CommonModule, RouterLink],
  templateUrl: './live-search.html',
  styleUrl: './live-search.css',
})
export class LiveSearch {
    private productService = inject(ProductService);

  // Signals for UI state
  searchTerm = signal('');
  results    = signal<Product[]>([]);
  isLoading  = signal(false);
  isOpen     = signal(false);          // controls dropdown visibility
  hasSearched = signal(false);

  // Subject — the "trigger" that fires on every keystroke
  private searchInput$ = new Subject<string>();

  ngOnInit() {
    this.searchInput$.pipe(

      // 1. Wait 350ms after the user stops typing
      debounceTime(350),

      // 2. Skip if the value is identical to the last emitted value
      //    (e.g. user types "abc", deletes to "ab", retypes "c" → still "abc")
      distinctUntilChanged(),

      // 3. Don't search for very short or empty terms
      filter(term => term.trim().length === 0 || term.trim().length >= 2),

      // 4. Show loading state before the call fires
      tap(term => {
        this.isLoading.set(true);
        this.isOpen.set(term.trim().length >= 2);
      }),

      // 5. switchMap — cancels the previous HTTP call if a new term arrives
      switchMap(term => {
        if (term.trim().length < 2) {
          return of({ data: [], totalCount: 0 });   // empty result, no API call
        }

        return this.productService.getAll({ search: term, pageSize: 8 }).pipe(
          catchError(() => of({ data: [], totalCount: 0 }))  // fail gracefully
        );
      })

    ).subscribe(result => {
      this.results.set(result.data);
      this.isLoading.set(false);
      this.hasSearched.set(true);
    });
  }

  onInputChange(value: string) {
    this.searchTerm.set(value);
    this.searchInput$.next(value);
  }

  closeDropdown() {
    // Small delay so the click on a result fires before the dropdown closes
    setTimeout(() => this.isOpen.set(false), 150);
  }

  openDropdown() {
    if (this.searchTerm().trim().length >= 2) {
      this.isOpen.set(true);
    }
  }

  clearSearch() {
    this.searchTerm.set('');
    this.results.set([]);
    this.isOpen.set(false);
    this.hasSearched.set(false);
  }

}
