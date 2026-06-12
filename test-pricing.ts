import { calculatePrice } from "./src/features/catalog/pricing";
import { Product } from "./src/types";

// Helper mock product creator
function mockProduct(pricing: any, options: any[] = []): Product {
  return {
    id: "p1", slug: "p1", categoryId: "c1", title: "Test", excerpt: "", description: "", coverImage: "", gallery: [],
    isActive: true, order: 1,
    pricing,
    options
  };
}

let passCount = 0;
let failCount = 0;

function assertEqual(label: string, actual: any, expected: any) {
  if (Math.abs(actual - expected) < 0.001) {
      passCount++;
  } else {
      console.error(`❌ [FAIL] ${label}: expected ${expected}, got ${actual}`);
      failCount++;
  }
}

// Test 1: Tier table
const pTier = mockProduct({
  type: "tier_table",
  tiers: [
      { quantity: 100, unitPrice: 50 },
      { quantity: 500, unitPrice: 40 },
  ]
});

let res = calculatePrice(pTier, { options: {}, quantity: 100 });
assertEqual("Tier <=100 base", res.baseUnitPrice, 50);

res = calculatePrice(pTier, { options: {}, quantity: 500 });
// Wait, our discount engine also applies 10% discount to total at >= 500. So we should test parts separately.
assertEqual("Tier >=500 base", res.baseUnitPrice, 40);
// 40 * 500 = 20000. 10% discount = 2000.
// unit price after discount = 40 * 0.9 = 36
assertEqual("Tier >=500 discounted unit", res.unitPrice, 36);


// Test 2: Area based
const pArea = mockProduct({
  type: "area_based",
  basePricePerSquareMeter: 10000,
  minArea: 1 // min 1 sq meter
}, [
  { id: "dim1", type: "dimensions", name: "Dim", minWidth: 10, maxWidth: 100, minHeight: 10, maxHeight: 100, unit: "cm" as any, required: true, label: "d", order: 1 }
]);

res = calculatePrice(pArea, { options: { dim1: "200x200" }, quantity: 1 });
// 2x2 = 4 sq meters. 4 * 10000 = 40000.
assertEqual("Area based large", res.baseUnitPrice, 40000);

res = calculatePrice(pArea, { options: { dim1: "50x50" }, quantity: 1 });
// 0.5x0.5 = 0.25 sq meters. Min area is 1. baseUnitPrice = 10000.
assertEqual("Area based min area", res.baseUnitPrice, 10000);

// Test 3: Per page
const pPage = mockProduct({
   type: "per_page",
   basePrice: 5000,
   pricePerPage: 100
}, [
   { id: "pages", type: "pages", name: "Pages", min: 1, max: 100, multiplier: 1, label: "p", required: true, order: 1 }
]);

res = calculatePrice(pPage, { options: { pages: 10 }, quantity: 1 });
// 5000 + (100 * 10) = 6000
assertEqual("Per page 10", res.baseUnitPrice, 6000);

// Test 4: Formula parsing
const pFormula = mockProduct({
   type: "formula",
   basePrice: 1000,
   formula: "basePrice + (width * height * 2) + 500"
}, [
   { id: "dim1", type: "dimensions", name: "Dim", minWidth: 10, maxWidth: 100, minHeight: 10, maxHeight: 100, unit: "cm" as any, required: true, label: "d", order: 1 }
]);

res = calculatePrice(pFormula, { options: { dim1: "10x10" }, quantity: 1 });
// 1000 + (10 * 10 * 2) + 500 = 1000 + 200 + 500 = 1700
assertEqual("Formula eval", res.baseUnitPrice, 1700);

// Test 5: Addons and Express Surcharge
const pAddons = mockProduct({
    type: "tier_table",
    tiers: [{ quantity: 1, unitPrice: 1000 }]
}, [
    { id: "select1", type: "select", name: "Coating", required: false, label: "c", order: 1, choices: [{ id: "v1", label: "Matte", value: "matte", priceImpact: 200 }] },
    { id: "turnaround1", type: "turnaround", name: "Speed", required: false, label: "s", order: 2, choices: [{ id: "t1", label: "Fast", days: 1, priceImpact: 500 }] },
    { id: "bool1", type: "boolean", name: "Rounded", required: false, label: "r", order: 3, priceImpact: 100 } as any
]);

res = calculatePrice(pAddons, { options: { select1: "matte", turnaround1: "t1", bool1: true }, quantity: 1 });
assertEqual("Addon Total", res.addonsTotal, 300); // 200 + 100
assertEqual("Express Surcharge Total", res.expressSurcharge, 500);

console.log(`Test suite completed: ${passCount} passed, ${failCount} failed.`);
if (failCount > 0) process.exit(1);
