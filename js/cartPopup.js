const cart = document.querySelector('.js-cart');
const overlay = document.querySelector('.js-overlay');
const openCartButton = document.querySelector('.js-open-cart');
const closeCartElements = document.querySelectorAll('.js-close-cart');

// Функція для визначення ширини скролбару
const getScrollbarWidth = () => {
    let div = document.createElement('div');
    div.style.width = '100px';
    div.style.height = '100px';
    div.style.overflowY = 'scroll';
    div.style.visibility = 'hidden';
    document.body.append(div);
    let scrollbarWidth = div.offsetWidth - div.clientWidth;
    div.remove();
    return scrollbarWidth;
};

const scroll = getScrollbarWidth();

// Функція відкриття/закриття корзини
const toggleCart = (isActive) => {
    cart.classList.toggle('active', isActive);
    overlay.classList.toggle('active', isActive);
};

// Відкриття корзини по кліку
const openCart = () => {
    openCartButton.addEventListener('click', () => {
        toggleCart(true);
    });
};

// Закриття корзини
const closeCart = () => {
    closeCartElements.forEach((item) => {
        item.addEventListener('click', () => {
            toggleCart(false);
        });
    });
};

// Обробник кнопки "Оформити замовлення"
document.addEventListener('DOMContentLoaded', () => {
    const placeOrderButton = document.getElementById('placeOrder');
    if (placeOrderButton) {
        placeOrderButton.addEventListener('click', () => {
            const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
            if (!isLoggedIn) {
                const choice = confirm('Ви не авторизовані. Бажаєте увійти чи зареєструватися?');
                if (choice) {
                    document.getElementById('loginModal').classList.remove('hidden');
                } else {
                    document.getElementById('registerModal').classList.remove('hidden');
                }
            } else {
                alert('Замовлення успішно оформлено!');
            }
        });
    }
});

// Ініціалізація
openCart();
closeCart();

export { openCart, closeCart };