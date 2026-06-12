import fs from 'fs';

let content = fs.readFileSync('src/mocks/db.ts', 'utf-8');
content = content.replace(/"completed"/g, '"delivered"').replace(/"pending_files"/g, '"in_review"');
fs.writeFileSync('src/mocks/db.ts', content);

let cartPage = fs.readFileSync('src/features/catalog/components/CartPage.tsx', 'utf-8');
cartPage = cartPage.replace(/import useState/g, '// import useState').replace(/import React, { useState } from "react";/, 'import { useState } from "react";');
fs.writeFileSync('src/features/catalog/components/CartPage.tsx', cartPage);
