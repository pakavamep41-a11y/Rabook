// @ts-nocheck
import { calculatePrice } from './pricing';

describe('Pricing Engine', () => {
  it('calculates print_options engine accurately', () => {
    const product = {
      priceEngine: 'print_options',
      basePrice: 1000,
      options: [
        { id: 'size', priceMap: { 'A4': 500 } }
      ]
    };
    const selections = {
      options: { size: 'A4' },
      quantity: 2
    };
    const res = calculatePrice(product as any, selections);
    // (1000 + 500) * 2 = 3000
    expect(res.finalPrice).toBe(3000);
    expect(res.unitPrice).toBe(1500);
  });

  it('calculates rigid_box engine accurately', () => {
    const product = {
      priceEngine: 'rigid_box',
      basePrice: 5000,
      options: [
        { id: 'length', default: 10 },
        { id: 'width', default: 10 },
        { id: 'height', default: 5 }
      ]
    };
    const selections = {
      options: { length: 20, width: 20, height: 10 },
      quantity: 100
    };
    const res = calculatePrice(product as any, selections);
    // Volume diff checking in pricing.ts should scale price.
    expect(res.finalPrice).toBeGreaterThan(5000);
    expect(res.discountAmount).toBeGreaterThanOrEqual(0);
  });
  
  it('calculates custom_label engine accurately', () => {
    const product = {
      priceEngine: 'custom_label',
      basePrice: 100, // per cm^2 baseline maybe
      options: [
        { id: 'width', default: 5 },
        { id: 'height', default: 5 }
      ]
    };
    const selections = {
      options: { width: 10, height: 10 },
      quantity: 500
    };
    const res = calculatePrice(product as any, selections);
    expect(res.finalPrice).toBeGreaterThan(0);
  });

  it('calculates promotional_gift engine accurately', () => {
    const product = {
      priceEngine: 'promotional_gift',
      basePrice: 20000,
      options: [
        { id: 'color', priceMap: { 'red': 2000 } }
      ]
    };
    const selections = {
      options: { color: 'red' },
      quantity: 50
    };
    const res = calculatePrice(product as any, selections);
    // (20000 + 2000) * 50 = 1,100,000
    expect(res.finalPrice).toBe(1100000);
  });
});
