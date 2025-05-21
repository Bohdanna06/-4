const coffeeData = [
    {
        image: '/image/coffe_cup3.jpg',
        name: 'Latte',
        description: 'A latte or caffè latte is a milk coffee that boasts a silky layer of foam as a real highlight to the drink',
        category: 'hot'
    },
    {
        image: '/image/iced-coffee-05.jpg',
        name: ' ice - Cappuccino',
        description: 'A cappuccino is a beloved espresso-based hot coffee drink made with layering of espresso, steamed milk, and milk foam on top',
        category: 'cold'

    },
    {
        image: '/image/Instant-Iced-Coffee-5-1.jpg',
        name: 'Macchiato',
        description: ' The macchiato is an espresso coffee drink, topped with a small amount of foamed or steamed milk to allow the taste of the espresso to still shine through.',
        category: 'cold'
    },
    {
        image: '/image/coffee1.webp',
        name: 'Americano with milk',
        description: 'Americano with milk is an espresso-based beverage made by adding hot water and milk to a shot of espresso',
        category: 'hot'
    },
    {
        image: '/image/nespresso-recipes-Granola-coffee.webp',
        name: 'Nespresso',
        description: ' Nespresso is a premium coffee brand, and by 2011 annual sales exceeded 3 billion Swiss francs. The word Nespresso is a combination of the words "Nestlé" and "Espresso", which are often used in other Nestlé brands.',
        category: 'hot'
    },
    {
        image: '/image/coffe3.jpeg',
        name: 'Ristretto',
        description: 'A ristretto is a short shot of espresso made with finely ground beans and less water.',
        category: 'hot'
    },
    {
        image: ' image/images.jpeg',
        name: 'Flat White',
        description: 'A flat white is a blend of microfoamed milk poured over a single or double shot of espresso.',
        category: 'hot'
    },
    {
        image: 'image/Beverages_Product_Images_1200x1200_CoffeeFrappe.webp',
        name: 'Frappe',
        description: 'The Frappé is generally made of water, espresso, sugar, milk, ice and is shaken, blended or beaten to combine the ingredients.',
        category: 'cold'
    }
];

let currentIndex = 0;
let filteredData = [...coffeeData];
function clearGallery() {
    const gallery = document.getElementById('coffee-gallery');
    if (gallery) gallery.innerHTML = '';
}

function loadCoffeeImages() {
    const gallery = document.getElementById('coffee-gallery');


    if (!gallery) {
        alert('Gallery not found');
        return;
    }

    // Перевірка, чи є зображення для завантаження
    if (coffeeData.length === 0) {
        alert('No coffee data available');
        return;
    }

    // Завантажуємо зображення
    for (let i = currentIndex; i < currentIndex + 2 && i < filteredData.length; i++) {
        const coffee = filteredData[i];

        const img = document.createElement('img');
        img.src = coffee.image;
        img.alt = coffee.name;
        img.classList.add('coffee-img');

        img.addEventListener('click', () => showCoffeeInfo(coffee));

        gallery.appendChild(img);
    }

    currentIndex += 2;

    if (currentIndex >= filteredData.length) {
        document.getElementById('loadMore').style.display = 'none';
    } else {
        document.getElementById('loadMore').style.display = 'block';
    }
}
function filterCoffeeByCategory(category) {
    if (category === 'all') {
        filteredData = [...coffeeData];
    } else {
        filteredData = coffeeData.filter(coffee => coffee.category === category);
    }

    currentIndex = 0;
    clearGallery();
    loadCoffeeImages();
}


// Функція для показу інформації про каву
function showCoffeeInfo(coffee) {
    const infoDiv = document.getElementById('coffeeInfo');

    if (!infoDiv) {
        alert('Coffee info div not found');
        return;
    }

    infoDiv.innerHTML =
        `<h2>${coffee.name}</h2>
    <p>${coffee.description}</p>
    <span id="closeBtn" class="close-btn">х</span>`;
    infoDiv.style.display = 'block';


    const closeBtn = document.getElementById('closeBtn');
    if (closeBtn) {
        // Спочатку видаляємо старий обробник події, якщо є
        closeBtn.removeEventListener('click', closeInfo);
        closeBtn.addEventListener('click', closeInfo);
    }
}


function closeInfo() {
    const infoDiv = document.getElementById('coffeeInfo');
    infoDiv.style.display = 'none';
}


document.getElementById('loadMore').addEventListener('click', loadCoffeeImages);


window.addEventListener("load", function () {
    loadCoffeeImages();
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            // Знімаємо активний стан з усіх кнопок
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            // Активуємо поточну кнопку
            this.classList.add('active');

            const selectedCategory = this.getAttribute('data-category');
            filterCoffeeByCategory(selectedCategory);
        });
    });
});
document.addEventListener('DOMContentLoaded', () => {
    fetch('/users.json')
        .then(response => response.json())
        .then(users => {
            const username = localStorage.getItem('username');
            const user = users.find(u => u.username === username);
            if (user && user.role === 'admin') {
                const adminLink = document.createElement('a');
                adminLink.className = 'link';
                adminLink.href = '/admin.html';
                adminLink.textContent = 'Admin Panel';
                document.getElementById('navMenu').appendChild(adminLink);
            }
        });
});