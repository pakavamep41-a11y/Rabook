import { Product, PricingEngine } from "../../types";

export interface SelectionState {
  options: { [optionId: string]: string | number | boolean };
  quantity: number;
}

export interface PricingResult {
  unitPrice: number;
  addonsTotal: number;
  expressSurcharge: number;
  baseUnitPrice: number;
  discountPercent: number;
  rawTotal: number;
  taxAmount: number;
  totalPrice: number;
}

export function calculatePrice(product: Product, selections: SelectionState): PricingResult {
  const { options, quantity } = selections;
  let baseUnitPrice = 0;
  
  // 1. Calculate base unit price based on pricing engine
  const engine = product.pricing;
  switch (engine.type) {
    case "tier_table": {
      // Sort tiers descending by quantity
      const sortedTiers = [...engine.tiers].sort((a, b) => b.quantity - a.quantity);
      const tier = sortedTiers.find(t => quantity >= t.quantity);
      baseUnitPrice = tier ? tier.unitPrice : (sortedTiers.length > 0 ? sortedTiers[sortedTiers.length - 1].unitPrice : 0);
      break;
    }
    case "area_based": {
      // Find dimensions option
      const dimOption = product.options.find(o => o.type === "dimensions");
      if (dimOption) {
        const val = options[dimOption.id] as string || "100x100";
        const parts = val.toLowerCase().split('x');
        const w = parseFloat(parts[0]) || 100;
        const h = parseFloat(parts[1]) || 100;
        // cm to sq meters
        let area = (w / 100) * (h / 100);
        if (area < engine.minArea) area = engine.minArea;
        baseUnitPrice = engine.basePricePerSquareMeter * area;
      }
      break;
    }
    case "per_page": {
      const pageOption = product.options.find(o => o.type === "pages");
      let pages = 1;
      if (pageOption) {
        pages = Number(options[pageOption.id]) || 1;
      }
      baseUnitPrice = engine.basePrice + (engine.pricePerPage * pages);
      break;
    }
    case "formula": {
      // Basic expression evaluator supporting variables and simple math Operations without eval/new Function
      let formulaStr = engine.formula;
      
      const vars: { [key: string]: number } = { basePrice: engine.basePrice, qty: quantity };
      
      for (const opt of product.options) {
        const val = options[opt.id];
        let numVal = 0;
        if (opt.type === "dimensions") {
           const parts = String(val || "100x100").split('x');
           vars["width"] = parseFloat(parts[0]) || 0;
           vars["height"] = parseFloat(parts[1]) || 0;
        } else if (typeof val === "number") {
           numVal = val;
        } else if (typeof val === "boolean") {
           numVal = val ? 1 : 0;
        }
        vars[opt.id] = numVal;
      }
      
      // A safe way to evaluate simple expressions like: basePrice + (width * height * 0.5)
      // Since it's restricted, we will just parse basic math.
      // E.g. basic math eval function
      const safeEval = (expr: string, context: Record<string, number>): number => {
          let s = expr;
          // replace variables
          for (const key of Object.keys(context)) {
              s = s.replace(new RegExp(`\\b${key}\\b`, 'g'), String(context[key]));
          }
          // Remove spaces
          s = s.replace(/\s+/g, '');
          
          // Helper for basic calculation. Extremely basic evaluator for simple expressions.
          try {
             const tokens = s.match(/([0-9.]+|[\+\-\*\/\(\)])/g) || [];
             let cur = 0;
             const parseExpr = (): number => {
                 const parseTerm = (): number => {
                     let val = 0;
                     if (tokens[cur] === '(') {
                        cur++; val = parseExpr(); cur++; // skip ')'
                     } else {
                        val = parseFloat(tokens[cur++]);
                     }
                     while(cur < tokens.length && (tokens[cur] === '*' || tokens[cur] === '/')) {
                        const op = tokens[cur++];
                        const right = tokens[cur] === '(' ? (cur++, (() => { const res = parseExpr(); cur++; return res; })()) : parseFloat(tokens[cur++]);
                        if (op === '*') val *= right; else val /= right;
                     }
                     return val;
                 };
                 let val = parseTerm();
                 while(cur < tokens.length && (tokens[cur] === '+' || tokens[cur] === '-')) {
                     const op = tokens[cur++];
                     const right = parseTerm();
                     if (op === '+') val += right; else val -= right;
                 }
                 return val;
             };
             return parseExpr();
          } catch(e) {
             return engine.basePrice;
          }
      };

      baseUnitPrice = safeEval(formulaStr, vars) || engine.basePrice;
      break;
    }
  }

  // 2. Addons Total per unit
  let addonsTotal = 0;
  let expressSurcharge = 0;

  for (const opt of product.options) {
    const val = options[opt.id];
    if (opt.type === "select" && val) {
      const choice = opt.choices.find(c => c.value === val);
      if (choice && choice.priceImpact) {
        addonsTotal += choice.priceImpact;
      }
    } else if (opt.type === "turnaround" && val) {
      const choice = opt.choices.find(c => c.id === val);
      if (choice && choice.priceImpact) {
        expressSurcharge += choice.priceImpact;
      }
    } else if (opt.type === "boolean" && val) {
        // boolean options usually need price impact metadata. We assume it's part of the option if extended, let's skip for simple type or assume options.priceImpact
        // for now just basic support
        if ((opt as any).priceImpact) addonsTotal += (opt as any).priceImpact;
    }
  }

  // 3. Discount logic
  let discountPercent = 0;
  if (quantity >= 1000) discountPercent = 15;
  else if (quantity >= 500) discountPercent = 10;

  // 4. Calculate everything
  const unitPrice = baseUnitPrice + addonsTotal + expressSurcharge;
  const rawTotal = unitPrice * quantity;
  
  const discountAmount = rawTotal * (discountPercent / 100);
  const totalAfterDiscount = rawTotal - discountAmount;
  
  const taxAmount = totalAfterDiscount * 0.10; // 10%
  const finalTotal = totalAfterDiscount + taxAmount;

  return {
    baseUnitPrice,
    addonsTotal,
    expressSurcharge,
    unitPrice: unitPrice - (unitPrice * (discountPercent/100)), // effective unit price
    discountPercent,
    rawTotal,
    taxAmount,
    totalPrice: finalTotal
  };
}
