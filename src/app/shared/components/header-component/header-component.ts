import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth-service';
import { LiveSearch } from '../../../features/products/live-search/live-search';
import { HasRoleDirective } from '../../directives/has-role.directive';

@Component({
  selector: 'app-header-component',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, LiveSearch, HasRoleDirective],
  templateUrl: './header-component.html',
  styleUrl: './header-component.css',
})
export class HeaderComponent {
  auth = inject(AuthService);

  logout() {
    this.auth.logout();
  }
}
