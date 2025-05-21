// Global user data and orders
let users = [];
let currentUser = null;
let orders = [];

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded'); // Debug: DOM ready

    // Fetch users from users.json
    fetch('/users.json')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok: ' + response.statusText);
            return response.json();
        })
        .then(data => {
            console.log('Users loaded:', data); // Debug: Confirm users are loaded
            users = data;
            initializeProfile();
        })
        .catch(error => {
            console.error('Error loading users.json:', error);
            // Fallback to localStorage data if fetch fails
            initializeProfile();
        });
});

function generateOrders(username) {
    return [
        { id: 1, username: username, date: '2025-05-20', items: 'Colombian Supremo x2', total: '400 грн' },
        { id: 2, username: username, date: '2025-05-19', items: 'Robusta Strong x1', total: '350 грн' },
        { id: 3, username: 'admin', date: '2025-05-18', items: 'Ethiopian Yirgacheffe x3', total: '975 грн' },
        { id: 4, username: 'user1', date: '2025-05-17', items: 'Brazil Santos x1', total: '350 грн' },
        { id: 5, username: username, date: '2025-05-16', items: 'Kenya AA x2', total: '550 грн' }
    ].filter(order => order.username === username || username === 'admin');
}

let currentOrderPage = 0;
const ordersPerPage = 2;

function initializeProfile() {
    console.log('Initializing profile...'); // Debug: Start of initialization
    // Check if user is logged in
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        console.log('User not logged in, redirecting...');
        alert('Будь ласка, увійдіть для доступу до особистого кабінету.');
        window.location.href = './index.html';
        return;
    }

    const username = localStorage.getItem('username');
    console.log('Logged-in username:', username); // Debug: Logged-in user
    currentUser = users.find(user => user.username === username) || { username: username, role: 'user' };
    console.log('Current user:', currentUser); // Debug: Current user object

    if (!currentUser) {
        console.log('User not found in users.json, redirecting...');
        alert('Користувач не знайдено.');
        window.location.href = './index.html';
        return;
    }

    // Set profile details
    document.getElementById('profileName').textContent = currentUser.username;
    document.getElementById('profileRole').textContent = `Role: ${currentUser.role}`;
    document.getElementById('usernameInput').value = currentUser.username;
    document.getElementById('emailInput').value = localStorage.getItem('email') || '';

    orders = generateOrders(username);
    setupInteractivity();
}

function setupInteractivity() {
    console.log('Setting up interactivity...'); // Debug: Start of interactivity setup
    const panels = document.querySelectorAll('.hexagon:not(.profile-hub)');
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    const logoutBtn = document.getElementById('logoutBtn');

    console.log('Panels found:', panels.length); // Debug: Number of panels
    console.log('Toggle buttons found:', toggleButtons.length); // Debug: Number of toggle buttons
    console.log('Logout button found:', !!logoutBtn); // Debug: Logout button existence

    if (panels.length === 0 || toggleButtons.length === 0 || !logoutBtn) {
        console.error('One or more elements not found:', { panels, toggleButtons, logoutBtn });
        return;
    }

    toggleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            console.log('Toggle button clicked:', btn.getAttribute('data-panel')); // Debug: Button click
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

            if (panelType === 'orders') loadOrders();
        });
    });

    logoutBtn.addEventListener('click', () => {
        console.log('Logout button clicked'); // Debug: Logout button click
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        localStorage.removeItem('email');
        window.location.href = './index.html';
    });

    // Email update
    document.getElementById('saveEmail').addEventListener('click', () => {
        console.log('Save email clicked'); // Debug: Save email click
        const email = document.getElementById('emailInput').value.trim();
        const error = document.getElementById('emailError');
        error.innerText = '';

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            error.innerText = 'Неправильний формат email.';
            return;
        }

        localStorage.setItem('email', email);
        error.innerHTML = '<span class="success">Email оновлено!</span>';
        setTimeout(() => error.innerText = '', 2000);
    });

    // Password update
    document.getElementById('savePassword').addEventListener('click', () => {
        console.log('Save password clicked'); // Debug: Save password click
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const error = document.getElementById('passwordError');
        error.innerText = '';

        if (!currentPassword || !newPassword || !confirmPassword) {
            error.innerText = 'Будь ласка, заповніть усі обов’язкові поля (позначені *).';
            return;
        }

        if (currentPassword !== currentUser.password) {
            error.innerText = 'Неправильний поточний пароль.';
            return;
        }

        if (newPassword.length < 6) {
            error.innerText = 'Новий пароль має містити щонайменше 6 символів.';
            return;
        }

        if (newPassword !== confirmPassword) {
            error.innerText = 'Паролі не співпадають.';
            return;
        }

        currentUser.password = newPassword;
        error.innerHTML = '<span class="success">Пароль оновлено!</span>';
        setTimeout(() => error.innerText = '', 2000);
    });

    // Load initial panel
    toggleButtons[0].click();
}

function loadOrders() {
    const ordersList = document.getElementById('ordersList');
    const start = currentOrderPage * ordersPerPage;
    const end = start + ordersPerPage;
    const pageOrders = orders.slice(start, end);

    if (start === 0) ordersList.innerHTML = '';

    if (start >= orders.length) {
        document.getElementById('loadMoreOrders').style.display = 'none';
        return;
    }

    pageOrders.forEach(order => {
        const orderDiv = document.createElement('div');
        orderDiv.className = 'order-item';
        orderDiv.innerHTML = `
            <p>Order #${order.id} - ${order.date}</p>
            <p>Items: ${order.items}</p>
            <p>Total: ${order.total}</p>
        `;
        ordersList.appendChild(orderDiv);
    });

    if (end >= orders.length) {
        document.getElementById('loadMoreOrders').style.display = 'none';
    } else {
        document.getElementById('loadMoreOrders').style.display = 'block';
    }

    document.getElementById('loadMoreOrders').onclick = () => {
        currentOrderPage++;
        loadOrders();
    };
}