import { Directive, Input, TemplateRef, ViewContainerRef, inject, effect, signal } from '@angular/core';
import { AuthService } from '../../core/services/auth-service';

// 💡 INTERVIEW QUESTION: Structural directive conditionally includes/excludes elements in the DOM template
@Directive({
  selector: '[appHasRole]',
  standalone: true,
})
export class HasRoleDirective {
  private templateRef = inject(TemplateRef<any>);
  private viewContainer = inject(ViewContainerRef);
  private auth = inject(AuthService);

  private allowedRoles = signal<string[]>([]);
  private hasView = false;

  // Input receives role list, e.g. *appHasRole="'Admin'" or *appHasRole="['Admin', 'Manager']"
  @Input() set appHasRole(roles: string[] | string) {
    const rolesArray = Array.isArray(roles) ? roles : [roles];
    this.allowedRoles.set(rolesArray);
  }

  constructor() {
    // 💡 INTERVIEW QUESTION: Reactive effect monitors signal updates automatically
    effect(() => {
      const user = this.auth.currentUser();
      const allowed = this.allowedRoles();
      
      const isAuthorized = user && allowed.includes(user.role);

      if (isAuthorized && !this.hasView) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.hasView = true;
      } else if (!isAuthorized && this.hasView) {
        this.viewContainer.clear();
        this.hasView = false;
      }
    });
  }
}
