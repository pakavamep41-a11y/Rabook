// @ts-nocheck
import { useStore } from './store';
import { renderHook, act } from '@testing-library/react-hooks';

describe('Cart Store', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useStore());
    act(() => {
      result.current.clearCart();
    });
  });

  it('can add items to cart', () => {
    const { result } = renderHook(() => useStore());
    
    act(() => {
      result.current.addToCart({
         id: '1',
         productId: 'p1',
         productTitle: 'test',
         quantity: 1,
         unitPrice: 100,
         finalPrice: 100,
         options: {},
         uploads: [],
         notes: ''
      });
    });

    expect(result.current.cart.length).toBe(1);
    expect(result.current.cart[0].productTitle).toBe('test');
  });

  it('can remove items from cart', () => {
    const { result } = renderHook(() => useStore());
    
    act(() => {
      result.current.addToCart({
         id: '1',
         productId: 'p1',
         productTitle: 'test',
         quantity: 1,
         unitPrice: 100,
         finalPrice: 100,
         options: {},
         uploads: [],
         notes: ''
      });
    });

    expect(result.current.cart.length).toBe(1);

    act(() => {
      result.current.removeFromCart('1');
    });

    expect(result.current.cart.length).toBe(0);
  });
  
  it('handles impersonation state clear', () => {
    const { result } = renderHook(() => useStore());
    act(() => {
      result.current.startImpersonation({ id: 'u1', name: 'user 1', email: 'u1@sys', role: 'customer' } as any);
    });
    
    expect(result.current.impersonatedUser).not.toBeNull();
    
    act(() => {
      result.current.stopImpersonation();
    });
    
    expect(result.current.impersonatedUser).toBeNull();
  });
});
