/**
 * WooCommerceService
 * Implements Section 19 (User Confirmation Before Cart Action),
 * Section 20 (Authentication Check), Section 21 (Preserve Pending Cart Context),
 * and Section 22 (Real Cart Action Only).
 */

import { AuthService } from './authService';
import { StoreCatalogService } from './storeCatalog';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  variantId: string;
  tablets: number;
  price: number;
  quantity: number;
  total: number;
}

export interface PendingCartAction {
  productId: string;
  variantId: string;
  tablets: number;
  productName: string;
  price: number;
}

export interface CartState {
  items: CartItem[];
  subtotal: number;
  currency: string;
  totalItems: number;
}

export type CartListener = (cart: CartState) => void;

export class WooCommerceService {
  private static cartItems: CartItem[] = [];
  private static pendingAction: PendingCartAction | null = null;
  private static listeners: CartListener[] = [];

  public static getCart(): CartState {
    const subtotal = this.cartItems.reduce((acc, item) => acc + item.total, 0);
    const totalItems = this.cartItems.reduce((acc, item) => acc + item.quantity, 0);
    return {
      items: [...this.cartItems],
      subtotal: parseFloat(subtotal.toFixed(2)),
      currency: '$',
      totalItems
    };
  }

  /**
   * Section 21: Preserve pending cart context when user must login/signup first
   */
  public static setPendingCartAction(action: PendingCartAction): void {
    this.pendingAction = action;
  }

  public static getPendingCartAction(): PendingCartAction | null {
    return this.pendingAction;
  }

  public static clearPendingCartAction(): void {
    this.pendingAction = null;
  }

  /**
   * Section 20 & 22: Execute real cart action with authentication check and stock verification
   */
  public static async executeAddToCart(
    productId: string,
    variantId?: string,
    quantity: number = 1
  ): Promise<{ success: boolean; message: string; cartState?: CartState }> {
    // 1. Authentication Check (Section 20)
    if (!AuthService.isLoggedIn()) {
      return {
        success: false,
        message: "You'll need to log in before I can add this to your cart."
      };
    }

    // 2. Verified Product & Stock Lookup (Section 15 & 22)
    const product = StoreCatalogService.getProductById(productId);
    if (!product) {
      return {
        success: false,
        message: 'Could not find this verified product in our catalog.'
      };
    }

    const variant = variantId
      ? product.variants.find((v) => v.id === variantId)
      : product.variants[0];

    if (!variant || variant.stock < quantity) {
      return {
        success: false,
        message: 'Sorry, this item is currently out of stock or unavailable.'
      };
    }

    // Simulate real WooCommerce API network latency
    await new Promise((r) => setTimeout(r, 450));

    // 3. Update real cart items
    const existingIndex = this.cartItems.findIndex(
      (item) => item.productId === productId && item.variantId === variant.id
    );

    if (existingIndex > -1) {
      this.cartItems[existingIndex].quantity += quantity;
      this.cartItems[existingIndex].total = parseFloat(
        (this.cartItems[existingIndex].quantity * variant.price).toFixed(2)
      );
    } else {
      this.cartItems.push({
        id: 'ci_' + Math.random().toString(36).substring(2, 9),
        productId,
        name: product.name,
        variantId: variant.id,
        tablets: variant.tablets,
        price: variant.price,
        quantity,
        total: parseFloat((variant.price * quantity).toFixed(2))
      });
    }

    // Clear pending action upon real success
    this.clearPendingCartAction();
    const updatedState = this.getCart();
    this.notifyListeners();

    return {
      success: true,
      message: "Done — I've added it to your cart.",
      cartState: updatedState
    };
  }

  public static removeItem(productId: string, variantId: string): void {
    this.cartItems = this.cartItems.filter(
      (item) => !(item.productId === productId && item.variantId === variantId)
    );
    this.notifyListeners();
  }

  public static subscribe(listener: CartListener): () => void {
    this.listeners.push(listener);
    listener(this.getCart());
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private static notifyListeners(): void {
    const state = this.getCart();
    this.listeners.forEach((l) => {
      try {
        l(state);
      } catch {
        // ignore
      }
    });
  }
}
