import renderProductCards from "./productCards.js";
import products from "./products.js";
import { closeCart, openCart } from "./cartPopup.js";
import addToCart from './cartLogic.js';

window.addEventListener('DOMContentLoaded', () => {
    const productContainer = document.querySelector('.js-products-list');

    renderProductCards(products, productContainer);
    openCart();
    closeCart();

    productContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('js-add-to-cart')) {
            const productId = e.target.dataset.productId;
            addToCart(productId);
        }
    });
});
const scrollBtn = document.getElementById('scrollToTopBtn');

window.addEventListener('scroll', () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const scrolled = window.scrollY;

  if (scrolled > (scrollable * 2 / 3)) {
    scrollBtn.style.display = 'block';
  } else {
    scrollBtn.style.display = 'none';
  }
});

scrollBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
