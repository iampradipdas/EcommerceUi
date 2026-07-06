import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart-service';
import { OrdersService } from '../../../core/services/orders-service';
import { ToastService } from '../../../core/services/toast-service';
import { CurrencyInrPipe } from '../../../shared/pipes/currency-inr.pipe';
import { HasUnsavedChanges } from '../../../core/guards/checkout-guard';

// 💡 INTERVIEW QUESTION: Custom Luhn Algorithm Validator for credit card number checksum
export function luhnCardValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value) return null;

  const sanitized = value.toString().replace(/[\s-]/g, '');
  if (!/^\d{13,19}$/.test(sanitized)) {
    return { invalidCardFormat: true };
  }

  let sum = 0;
  let shouldDouble = false;

  for (let i = sanitized.length - 1; i >= 0; i--) {
    let digit = parseInt(sanitized.charAt(i), 10);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0 ? null : { luhnFailed: true };
}

// 💡 INTERVIEW QUESTION: Custom credit card Expiry Date Validator (MM/YY)
export function expiryDateValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value) return null;

  const match = value.match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/);
  if (!match) {
    return { invalidExpiryFormat: true };
  }

  const month = parseInt(match[1], 10);
  const year = parseInt(match[2], 10) + 2000;

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return { cardExpired: true };
  }

  return null;
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, CurrencyInrPipe],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class CheckoutComponent implements HasUnsavedChanges {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  protected cartService = inject(CartService);
  private ordersService = inject(OrdersService);
  private toast = inject(ToastService);

  isSubmitting = signal(false);
  isOrderPlaced = false;

  // 💡 INTERVIEW QUESTION: Nested FormGroup structure in reactive forms
  checkoutForm: FormGroup = this.fb.group({
    shippingAddress: this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      addressLine: ['', [Validators.required]],
      city: ['', [Validators.required]],
      postalCode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]], // 6 digit Indian pin code
    }),
    paymentInfo: this.fb.group({
      cardName: ['', [Validators.required]],
      cardNumber: ['', [Validators.required, luhnCardValidator]],
      expiryDate: ['', [Validators.required, expiryDateValidator]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]], // 3 digit CVV
    }),
  });

  // Getters for form controls in HTML template
  get shippingGroup() {
    return this.checkoutForm.get('shippingAddress') as FormGroup;
  }

  get paymentGroup() {
    return this.checkoutForm.get('paymentInfo') as FormGroup;
  }

  // 💡 INTERVIEW QUESTION: CanDeactivate guard hooks here to check if form has unsaved modifications
  hasUnsavedChanges(): boolean {
    return this.checkoutForm.dirty && !this.isOrderPlaced;
  }

  onSubmit() {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      this.toast.show('Please fix the errors in the form before submitting.', 'error');
      return;
    }

    if (this.cartService.totalItems() === 0) {
      this.toast.show('Your cart is empty. Cannot place an order.', 'error');
      return;
    }

    this.isSubmitting.set(true);

    // Assemble the shipping address string from form values
    const shipVal = this.shippingGroup.value;
    const shippingAddressString = `${shipVal.fullName}, ${shipVal.addressLine}, ${shipVal.city} - ${shipVal.postalCode}`;

    const payload = {
      shippingAddress: shippingAddressString,
    };

    this.ordersService.placeOrder(payload).subscribe({
      next: (order) => {
        this.isOrderPlaced = true;
        this.cartService.clearCart(); // clear cart on the client-side as well
        this.toast.show('Order placed successfully!', 'success');
        this.router.navigate(['/orders', order.orderId]);
      },
      error: (err) => {
        this.toast.show(err.error?.message || 'An error occurred while placing the order.', 'error');
        this.isSubmitting.set(false);
      },
    });
  }
}
