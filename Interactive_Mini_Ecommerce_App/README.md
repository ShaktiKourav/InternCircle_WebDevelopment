# Cartly — Interactive Mini E-Commerce App

A responsive mini storefront built with HTML, CSS and vanilla JavaScript.

## Chosen option
**Mini E-Commerce App** (not the quiz option).

## Features
- Product catalog is stored as an array of JavaScript objects and rendered dynamically.
- Search products by name, category or description.
- Filter products by category.
- Add products to the cart using unique product IDs.
- Increase/decrease item quantities and remove individual products.
- Clear the entire cart, including testing the empty-cart state.
- Automatically calculates item count, subtotal, delivery fee and grand total.
- Cart is saved in `localStorage` and restored after reload.
- Checkout preview modal lists selected products and estimated total.
- Demo checkout does not collect card details or process payments.
- Responsive layout for mobile, tablet and desktop.
- Reduced-motion preference is respected.

## How totals are calculated
- Subtotal = sum of `(product numeric price × quantity)` for every cart item.
- Delivery = `$5` when subtotal is greater than `$0` and below `$60`.
- Delivery is free when subtotal is `$60` or more.
- Grand total = subtotal + delivery.
- Prices are stored as numbers and formatted as currency only when displayed.

## Run locally
1. create folder for `Interactive_Mini_Ecommerce_App`.
2. Open the folder in VS Code.
3. Open `index.html` in your browser, or use VS Code Live Server.
4. No installation, backend or API key is required.

## Test checklist
1. Add more than one product.
2. Add the same product again and check its quantity.
3. Increase and decrease quantities.
4. Decrease an item to zero and confirm it disappears.
5. Remove an item using the Remove button.
6. Clear the whole cart and confirm the empty-cart message.
7. Reload the page and confirm the cart is restored.
8. Test delivery below and above the `$60` free-delivery threshold.
9. Open the checkout preview and verify it shows the item list and correct total.
10. Check the page on a phone-sized viewport.

## Files
- `index.html` — semantic page structure and checkout modal
- `style.css` — theme, responsive layout and interactions
- `script.js` — product data, dynamic rendering, cart state, calculations and modal
