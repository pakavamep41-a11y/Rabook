# API Documentation (Mock Contract)

This document defines the REST API contract used by the frontend. The backend agent must implement these endpoints to fully replace the current MSW mock server.

## Authentication
- \`POST /api/auth/login\`
  - Payload: \`{ email, password }\`
  - Response: \`{ user: User, token: string }\`
- \`POST /api/auth/register\`
  - Payload: \`{ name, email, password, phone }\`
  - Response: \`{ user: User, token: string }\`

## Catalog & Products
- \`GET /api/products?cat={categorySlug}\`
  - Response: \`Product[]\`
- \`GET /api/products/:id\`
  - Response: \`Product\`

## Orders & Checkout
- \`POST /api/orders\`
  - Payload: \`{ products: Array<{ productId, options, quantity, notes, uploads }> }\`
  - Response: \`{ success: true, orderId: string, trackId: string }\`
- \`GET /api/orders\` (Auth required)
  - Response: \`Order[]\`
- \`GET /api/orders/:id\` (Auth required)
  - Response: \`Order\`

## Support Tickets
- \`GET /api/tickets\` (Auth required)
  - Response: \`Ticket[]\`
- \`GET /api/tickets/:id\` (Auth required)
  - Response: \`Ticket & { messages: Message[] }\`
- \`POST /api/tickets\` (Auth required)
  - Payload: \`{ subject, department, text }\`
  - Response: \`{ success: true, ticketId: string }\`
- \`POST /api/tickets/:id/messages\` (Auth required)
  - Payload: \`{ text }\`
  - Response: \`{ success: true, messageId: string }\`

## Admin & CMS
- \`GET /api/pages\`
  - Response: \`Page[]\`
- \`GET /api/pages/:slug\`
  - Response: \`Page & { sections: Section[] }\`

*Note: All dates exchanged with the API MUST be in ISO-8601 (Gregorian) format. The frontend will perform Jalali conversions for presentation.*
