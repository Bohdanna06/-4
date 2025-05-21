// Global data
let users = [];
let products = [];
let currentUser = null;

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded'); // Debug: DOM ready

    // Fetch users and products
    Promise.all([
        fetch('/users.json')
            .then(response => {
                if (!response.ok) throw new Error('Failed to load users.json');
                return response.json();
            }),
        fetch('/products.json')
            .then(response => {
                if (!response.ok) throw new Error('Failed to load products.json');
                return response.json();
            })
    ])
        .then(([usersData, productsData]) => {
            users = usersData;
            products = productsData || [];
            console.log('Users loaded:', users);
            console.log('Products loaded:', products);
            initializeAdmin();
        })
        .catch(error => {
            console.error('Error loading data:', error);
            // Fallback to localStorage data if fetch fails
            initializeAdmin();
        });
});

function initializeAdmin() {
    console.log('Initializing admin panel...');
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        console.log('User not logged in, redirecting...');
        alert('Будь ласка, увійдіть для доступу до адмін-панелі.');
        window.location.href = './index.html';
        return;
    }

    const username = localStorage.getItem('username');
    currentUser = users.find(user => user.username === username) || { username: username, role: 'user' };
    console.log('Current user:', currentUser);

    if (currentUser.role !== 'admin') {
        console.log('User is not an admin, redirecting...');
        alert('Доступ заборонено. Тільки для адміністраторів.');
        window.location.href = './index.html';
        return;
    }

    // Set admin details
    document.getElementById('adminRole').textContent = `Роль: ${currentUser.role}`;
    loadUsers();
    loadProducts();
    setupInteractivity();
}

function loadUsers() {
    const usersList = document.getElementById('usersList');
    usersList.innerHTML = '';
    users.forEach(user => {
        const userDiv = document.createElement('div');
        userDiv.className = 'user-item';
        userDiv.innerHTML = `
            <span>${user.username} (${user.role})</span>
            <div>
                <button onclick="editUser(${user.id})">Редагувати</button>
                <button onclick="deleteUser(${user.id})">Видалити</button>
            </div>
        `;
        usersList.appendChild(userDiv);
    });
}

function loadProducts() {
    const productsList = document.getElementById('productsList');
    productsList.innerHTML = '';
    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product-item';
        productDiv.innerHTML = `
            <span>${product.name} - ${product.price} грн</span>
            <div>
                <button onclick="editProduct(${product.id})">Редагувати</button>
                <button onclick="deleteProduct(${product.id})">Видалити</button>
            </div>
        `;
        productsList.appendChild(productDiv);
    });
}

function setupInteractivity() {
    console.log('Setting up interactivity...');
    const panels = document.querySelectorAll('.hexagon:not(.admin-hub)');
    const toggleButtons = document.querySelectorAll('.toggle-btn');

    console.log('Panels found:', panels.length);
    console.log('Toggle buttons found:', toggleButtons.length);

    if (panels.length === 0 || toggleButtons.length === 0) {
        console.error('One or more elements not found:', { panels, toggleButtons });
        return;
    }

    toggleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            console.log('Toggle button clicked:', btn.getAttribute('data-panel'));
            const panelType = btn.getAttribute('data-panel');
            toggleButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            panels.forEach(panel => {
                if (panel.classList.contains(`${panelType}-panel`)) {
                    panel.classList.add('active-panel');
                } else {
                    panel.classList.remove('active-panel');
                }
            });
        });
    });

    // User management
    document.getElementById('saveUser').addEventListener('click', () => {
        const username = document.getElementById('userUsername').value.trim();
        const password = document.getElementById('userPassword').value;
        const role = document.getElementById('userRole').value;
        const error = document.getElementById('userError');
        error.innerText = '';

        if (!username || !password) {
            error.innerText = 'Будь ласка, заповніть усі обов’язкові поля.';
            return;
        }

        if (password.length < 6) {
            error.innerText = 'Пароль має містити щонайменше 6 символів.';
            return;
        }

        const existingUser = users.find(user => user.username === username);
        if (existingUser) {
            existingUser.password = password;
            existingUser.role = role;
        } else {
            const newUser = {
                id: users.length ? Math.max(...users.map(u => u.id)) + 1 : 1,
                username,
                password,
                role
            };
            users.push(newUser);
        }

        loadUsers();
        document.getElementById('userUsername').value = '';
        document.getElementById('userPassword').value = '';
        error.innerHTML = '<span class="success">Користувача збережено!</span>';
        setTimeout(() => error.innerText = '', 2000);
    });

    // Product management
    document.getElementById('saveProduct').addEventListener('click', () => {
        const name = document.getElementById('productName').value.trim();
        const price = parseFloat(document.getElementById('productPrice').value);
        const error = document.getElementById('productError');
        error.innerText = '';

        if (!name || !price || price <= 0) {
            error.innerText = 'Будь ласка, заповніть усі обов’язкові поля коректно.';
            return;
        }

        const existingProduct = products.find(product => product.name === name);
        if (existingProduct) {
            existingProduct.price = price;
        } else {
            const newProduct = {
                id: products.length ? Math.max(...products.map(p => p.id)) + 1 : 1,
                name,
                price
            };
            products.push(newProduct);
        }

        loadProducts();
        document.getElementById('productName').value = '';
        document.getElementById('productPrice').value = '';
        error.innerHTML = '<span class="success">Товар збережено!</span>';
        setTimeout(() => error.innerText = '', 2000);
    });

    // Load initial panel
    toggleButtons[0].click();
}

function editUser(id) {
    const user = users.find(user => user.id === id);
    if (user) {
        document.getElementById('userUsername').value = user.username;
        document.getElementById('userPassword').value = user.password;
        document.getElementById('userRole').value = user.role;
    }
}

function deleteUser(id) {
    if (confirm('Ви впевнені, що хочете видалити цього користувача?')) {
        users = users.filter(user => user.id !== id);
        loadUsers();
    }
}

function editProduct(id) {
    const product = products.find(product => product.id === id);
    if (product) {
        document.getElementById('productName').value = product.name;
        document.getElementById('productPrice').value = product.price;
    }
}

function deleteProduct(id) {
    if (confirm('Ви впевнені, що хочете видалити цей товар?')) {
        products = products.filter(product => product.id !== id);
        loadProducts();
    }
}