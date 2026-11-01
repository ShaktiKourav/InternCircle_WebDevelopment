// Product data lives in JavaScript objects; cards are rendered from this array.
const products = [
  { id: "p101", name: "Cloud Mug", category: "Lifestyle", price: 18, emoji: "☕", color: "#f3e7df", tag: "BESTSELLER", description: "A cozy start to every morning." },
  { id: "p102", name: "Studio Notebook", category: "Desk", price: 14, emoji: "📓", color: "#e8e7fb", tag: "NEW", description: "A little space for big ideas." },
  { id: "p103", name: "Everyday Tote", category: "Accessories", price: 22, emoji: "👜", color: "#f7e8d8", tag: "POPULAR", description: "Your grab-and-go sidekick." },
  { id: "p104", name: "Soft Desk Lamp", category: "Desk", price: 36, emoji: "💡", color: "#e6eee8", tag: "DESK FAVORITE", description: "A warm glow for late ideas." },
  { id: "p105", name: "Mini Plant Pal", category: "Lifestyle", price: 12, emoji: "🪴", color: "#e4efe2", tag: "LITTLE JOY", description: "A fresh touch for your space." },
  { id: "p106", name: "Daily Headphones", category: "Accessories", price: 48, emoji: "🎧", color: "#eee5f2", tag: "TOP PICK", description: "Find your focus, anywhere." },
  { id: "p107", name: "Color Pen Set", category: "Desk", price: 9, emoji: "🖊️", color: "#f8e8eb", tag: "UNDER $10", description: "Bright ideas deserve good ink." },
  { id: "p108", name: "Weekend Bottle", category: "Lifestyle", price: 25, emoji: "🧴", color: "#e3edf5", tag: "EVERYDAY", description: "Hydration for the long way." }
];

const FREE_DELIVERY_THRESHOLD = 60;
const DELIVERY_FEE = 5;
const CART_STORAGE_KEY = "cartly-shopping-cart";

const productGrid = document.querySelector("#product-grid");
const cartItems = document.querySelector("#cart-items");
const searchInput = document.querySelector("#product-search");
const emptyProducts = document.querySelector("#empty-products");
const modal = document.querySelector("#checkout-modal");
const toast = document.querySelector("#toast");

let selectedCategory = "All";
let cart = loadCart();
let toastTimer;

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");
    if (!Array.isArray(saved)) return [];
    return saved
      .filter(item => products.some(product => product.id === item.id))
      .map(item => ({ id: item.id, quantity: Math.max(1, Math.floor(Number(item.quantity) || 1)) }));
  } catch {
    return [];
  }
}

function saveCart() {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

function money(amount) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

function getCartQuantity() {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function getSubtotal() {
  return cart.reduce((sum, item) => {
    const product = products.find(product => product.id === item.id);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);
}

function getDelivery(subtotal) {
  if (subtotal === 0 || subtotal >= FREE_DELIVERY_THRESHOLD) return 0;
  return DELIVERY_FEE;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2100);
}

function renderProducts() {
  const query = searchInput.value.trim().toLowerCase();
  const visibleProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch = `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  productGrid.replaceChildren();
  emptyProducts.hidden = visibleProducts.length !== 0;

  visibleProducts.forEach(product => {
    const card = document.createElement("article");
    card.className = "product-card";

    const art = document.createElement("div");
    art.className = "product-art";
    art.style.backgroundColor = product.color;

    const tag = document.createElement("span");
    tag.className = "product-tag";
    tag.textContent = product.tag;

    const emoji = document.createElement("span");
    emoji.className = "product-emoji";
    emoji.textContent = product.emoji;
    emoji.setAttribute("aria-hidden", "true");
    art.append(tag, emoji);

    const info = document.createElement("div");
    info.className = "product-info";

    const category = document.createElement("div");
    category.className = "product-category";
    category.textContent = product.category;

    const name = document.createElement("h3");
    name.textContent = product.name;

    const description = document.createElement("p");
    description.className = "product-description";
    description.textContent = product.description;

    const bottom = document.createElement("div");
    bottom.className = "product-bottom";

    const price = document.createElement("strong");
    price.className = "product-price";
    price.textContent = money(product.price);

    const addButton = document.createElement("button");
    addButton.className = "add-button";
    addButton.type = "button";
    addButton.textContent = cart.some(item => item.id === product.id) ? "Add another +" : "Add to bag +";
    addButton.setAttribute("aria-label", `Add ${product.name} to bag`);
    addButton.addEventListener("click", () => addToCart(product.id));

    bottom.append(price, addButton);
    info.append(category, name, description, bottom);
    card.append(art, info);
    productGrid.append(card);
  });
}

function addToCart(productId) {
  const product = products.find(item => item.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) existing.quantity += 1;
  else cart.push({ id: productId, quantity: 1 });

  saveCart();
  renderAll();
  showToast(`${product.name} added to your bag`);
}

function changeQuantity(productId, change) {
  const item = cart.find(entry => entry.id === productId);
  if (!item) return;
  item.quantity += change;
  if (item.quantity <= 0) cart = cart.filter(entry => entry.id !== productId);
  saveCart();
  renderAll();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  renderAll();
  showToast("Item removed from your bag");
}

function renderCart() {
  cartItems.replaceChildren();
  const totalItems = getCartQuantity();
  const subtotal = getSubtotal();
  const delivery = getDelivery(subtotal);
  const total = subtotal + delivery;

  document.querySelector("#header-cart-count").textContent = totalItems;
  document.querySelector("#cart-heading-count").textContent = `${totalItems} ${totalItems === 1 ? "item" : "items"}`;
  document.querySelector("#subtotal").textContent = money(subtotal);
  document.querySelector("#delivery").textContent = delivery === 0 ? (subtotal === 0 ? money(0) : "FREE") : money(delivery);
  document.querySelector("#grand-total").textContent = money(total);
  document.querySelector("#checkout-button").disabled = totalItems === 0;
  document.querySelector("#clear-cart").hidden = totalItems === 0;

  document.querySelector("#delivery-hint").textContent = subtotal === 0
    ? "Add items to see delivery."
    : subtotal >= FREE_DELIVERY_THRESHOLD
      ? "You've unlocked free delivery!"
      : `Add ${money(FREE_DELIVERY_THRESHOLD - subtotal)} more for free delivery.`;

  if (cart.length === 0) {
    const empty = document.createElement("div");
    empty.className = "cart-empty";
    const message = document.createElement("div");
    const title = document.createElement("strong");
    title.textContent = "Your bag is taking a little break";
    const detail = document.createElement("span");
    detail.textContent = "Add something lovely from the collection above.";
    message.append(title, detail);
    empty.append(message);
    cartItems.append(empty);
    return;
  }

  cart.forEach(item => {
    const product = products.find(entry => entry.id === item.id);
    if (!product) return;

    const row = document.createElement("article");
    row.className = "cart-row";

    const thumb = document.createElement("div");
    thumb.className = "cart-thumb";
    thumb.style.backgroundColor = product.color;
    thumb.textContent = product.emoji;
    thumb.setAttribute("aria-hidden", "true");

    const details = document.createElement("div");
    const name = document.createElement("div");
    name.className = "cart-product-name";
    name.textContent = product.name;
    const category = document.createElement("div");
    category.className = "cart-product-category";
    category.textContent = `${product.category} · ${money(product.price)} each`;
    details.append(name, category);

    const quantity = document.createElement("div");
    quantity.className = "quantity-control";
    const minus = document.createElement("button");
    minus.type = "button";
    minus.textContent = "−";
    minus.setAttribute("aria-label", `Decrease ${product.name} quantity`);
    minus.addEventListener("click", () => changeQuantity(product.id, -1));
    const count = document.createElement("span");
    count.textContent = item.quantity;
    const plus = document.createElement("button");
    plus.type = "button";
    plus.textContent = "+";
    plus.setAttribute("aria-label", `Increase ${product.name} quantity`);
    plus.addEventListener("click", () => changeQuantity(product.id, 1));
    quantity.append(minus, count, plus);

    const lineTotal = document.createElement("div");
    lineTotal.className = "cart-line-total";
    lineTotal.textContent = money(product.price * item.quantity);
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "remove-button";
    remove.textContent = "Remove";
    remove.addEventListener("click", () => removeFromCart(product.id));
    lineTotal.append(remove);

    row.append(thumb, details, quantity, lineTotal);
    cartItems.append(row);
  });
}

function openCheckoutPreview() {
  if (cart.length === 0) return;

  const modalItems = document.querySelector("#modal-items");
  modalItems.replaceChildren();

  cart.forEach(item => {
    const product = products.find(entry => entry.id === item.id);
    if (!product) return;
    const row = document.createElement("div");
    row.className = "modal-item";
    const label = document.createElement("span");
    label.textContent = `${product.name} × ${item.quantity}`;
    const amount = document.createElement("strong");
    amount.textContent = money(product.price * item.quantity);
    row.append(label, amount);
    modalItems.append(row);
  });

  const subtotal = getSubtotal();
  document.querySelector("#modal-total").textContent = money(subtotal + getDelivery(subtotal));
  modal.hidden = false;
  document.querySelector("#modal-close").focus();
}

function closeCheckoutPreview() {
  modal.hidden = true;
  document.querySelector("#checkout-button").focus();
}

function renderAll() {
  renderProducts();
  renderCart();
}

document.querySelector("#category-filters").addEventListener("click", event => {
  const button = event.target.closest("button[data-category]");
  if (!button) return;
  selectedCategory = button.dataset.category;
  document.querySelectorAll(".filter-chip").forEach(chip => {
    chip.classList.toggle("active", chip === button);
  });
  renderProducts();
});

searchInput.addEventListener("input", renderProducts);
document.querySelector("#clear-cart").addEventListener("click", () => {
  cart = [];
  saveCart();
  renderAll();
  showToast("Your bag is now empty");
});
document.querySelector("#checkout-button").addEventListener("click", openCheckoutPreview);
document.querySelector("#modal-close").addEventListener("click", closeCheckoutPreview);
document.querySelector("#done-button").addEventListener("click", closeCheckoutPreview);
modal.addEventListener("click", event => {
  if (event.target === modal) closeCheckoutPreview();
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && !modal.hidden) closeCheckoutPreview();
});
document.querySelector("#cart-jump").addEventListener("click", () => {
  document.querySelector("#cart-section").scrollIntoView({ behavior: "smooth" });
});

renderAll();
