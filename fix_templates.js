import fs from 'fs';

const files = [
  'src/features/account/components/AccountLayout.tsx',
  'src/features/account/components/AccountOverview.tsx',
  'src/features/account/components/OrderList.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');
  content = content.replace(/\\\$/g, '$').replace(/\\`/g, '`');
  fs.writeFileSync(file, content);
}
