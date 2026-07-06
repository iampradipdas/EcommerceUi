import { CanDeactivateFn } from '@angular/router';

export interface HasUnsavedChanges {
  hasUnsavedChanges(): boolean;
}

// 💡 INTERVIEW QUESTION: CanDeactivate guard checks if we can navigate away from a dirty route/form
export const checkoutGuard: CanDeactivateFn<HasUnsavedChanges> = (component) => {
  if (component && component.hasUnsavedChanges()) {
    return confirm(
      'You have unsaved changes in your checkout form. Are you sure you want to leave? Your progress will be lost.'
    );
  }
  return true;
};
