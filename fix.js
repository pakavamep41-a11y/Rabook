import fs from 'fs';
const f = 'src/features/catalog/components/CheckoutSuccess.tsx';
let txt = fs.readFileSync(f, 'utf8');
txt = txt.replace(/\\`/g, "`");
txt = txt.replace(/\\\$/g, "$");
fs.writeFileSync(f, txt);
