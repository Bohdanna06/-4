import products from './products.js';

const cartItemsContainer = document.querySelector('.js-cart-items');
const emptyCartContainer = document.querySelector('.cart-empty-container');
const cartCount = document.querySelector('.js-cart-count');
const totalPriceElement = document.querySelector('.js-total-price');

let cartState = JSON.parse(localStorage.getItem('cartState')) || {};
const cartTotalContainer = document.querySelector('.js-cart-total');

const updateEmptyMessage = () => {
    const isEmpty = Object.keys(cartState).length === 0;
    emptyCartContainer.style.display = isEmpty ? 'block' : 'none';
    cartTotalContainer.style.display = isEmpty ? 'none' : 'block';
    localStorage.setItem('cartState', JSON.stringify(cartState));
};

const updateCartCountAndTotal = () => {
    let totalCount = 0;
    let totalPrice = 0;

    for (let id in cartState) {
        totalCount += cartState[id].quantity;
        totalPrice += cartState[id].quantity * cartState[id].product.price;
    }

    cartCount.textContent = totalCount;
    totalPriceElement.textContent = totalPrice.toFixed(2);
    localStorage.setItem('cartState', JSON.stringify(cartState));
};

const addToCart = (productId) => {
    const product = products.find(p => p.id == productId);
    if (!product) return;

    if (cartState[productId]) {
        // Збільшуємо кількість
        cartState[productId].quantity += 1;
        cartState[productId].element.querySelector('.product-quantity').textContent = `Кількість: ${cartState[productId].quantity}`;
    } else {
        const item = document.createElement('div');
        item.classList.add('product-card-container', 'cart-item');

        item.innerHTML = `
        <img src="${product.photo}" alt="coffe image" class="product-image-cart">
        <div class="product-info-cart">
            <h2 class="product-name"> ${product.name}</h2>
            <p class="product-price">${product.price} грн</p>
            <div class="quantity-controls">
                <button class="decrease-btn">−</button>
                <span class="product-quantity">1</span>
                <button class="increase-btn">+</button>
            </div>
        </div>
        <button class="remove-btn" aria-label="Видалити товар">×</button> 
    `;
        const quantityElement = item.querySelector('.product-quantity');
        const increaseBtn = item.querySelector('.increase-btn');
        const decreaseBtn = item.querySelector('.decrease-btn');

        increaseBtn.addEventListener('click', () => {
            cartState[productId].quantity += 1;
            quantityElement.textContent = cartState[productId].quantity;
            updateCartCountAndTotal();
        });
        decreaseBtn.addEventListener('click', () => {
            cartState[productId].quantity -= 1;

            if (cartState[productId].quantity === 0) {
                delete cartState[productId];
                item.remove();
            } else {
                quantityElement.textContent = cartState[productId].quantity;
            }

            updateEmptyMessage();
            updateCartCountAndTotal();
        });

        item.querySelector('.remove-btn').addEventListener('click', () => {
            delete cartState[productId];
            item.remove();
            updateEmptyMessage();
            updateCartCountAndTotal();
        });

        cartItemsContainer.appendChild(item);

        cartState[productId] = {
            product,
            quantity: 1,
            element: item
        };
    }

    updateEmptyMessage();
    updateCartCountAndTotal();
};

export default addToCart;