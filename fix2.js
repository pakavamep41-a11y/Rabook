import fs from 'fs';
const f = 'src/features/account/components/tabs/OrdersTab.tsx';
let txt = fs.readFileSync(f, 'utf8');
txt = txt.replace(/\\\$/g, "$");
fs.writeFileSync(f, txt);
