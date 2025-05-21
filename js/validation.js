document.getElementById('registerIcon').onclick = () => {
    document.getElementById('registerModal').classList.remove('hidden');
};

document.getElementById('loginIcon').onclick = () => {
    document.getElementById('loginModal').classList.remove('hidden');
};

// Закриття форми реєстрації
document.querySelector('.js-close-register').onclick = () => {
    document.getElementById('registerModal').classList.add('hidden');
};

// Закриття форми входу
const loginCloseBtn = document.querySelector('.js-close-login');
if (loginCloseBtn) {
    loginCloseBtn.onclick = () => {
        document.getElementById('loginModal').classList.add('hidden');
    };
}

// Load users from users.json
let users = [];
fetch('/users.json')
    .then(response => response.json())
    .then(data => {
        users = data;
        console.log('Users loaded:', users); // Debug: Confirm users are loaded
    })
    .catch(error => {
        console.error('Error loading users.json:', error);
    });

// Обробка реєстрації
document.getElementById('registerForm').onsubmit = function (e) {
    e.preventDefault();
    const login = document.getElementById('regLogin').value.trim();
    const password = document.getElementById('regPassword').value;
    const repeat = document.getElementById('regRepeatPassword').value;
    const email = document.getElementById('regEmail').value.trim();
    const error = document.getElementById('registerError');

    error.innerText = '';

    // Check mandatory fields
    if (!login || !password || !repeat) {
        error.innerText = 'Будь ласка, заповніть усі обов’язкові поля (позначені *).';
        return;
    }

    // Password length validation
    if (password.length < 6) {
        error.innerText = 'Пароль має містити щонайменше 6 символів.';
        return;
    }

    // Password match validation
    if (password !== repeat) {
        error.innerText = 'Паролі не співпадають.';
        return;
    }

    // Optional email validation
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        error.innerText = 'Неправильний формат email.';
        return;
    }

    // Check if username already exists
    if (users.some(user => user.username === login)) {
        error.innerText = 'Користувач з таким логіном уже існує.';
        return;
    }

    // Simulate adding new user (in production, this would be a POST request)
    const newUser = {
        id: users.length + 1,
        username: login,
        password: password,
        role: 'user'
    };
    users.push(newUser);
    console.log('New user added:', newUser); // Debug: Confirm user addition

    // Success
    error.innerHTML = '<span class="success">Реєстрація успішна!</span>';
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('username', login);
    localStorage.setItem('email', email || '');
    setTimeout(() => {
        document.getElementById('registerModal').classList.add('hidden');
        document.getElementById('registerForm').reset();
    }, 1500);
};

// Обробка входу
document.getElementById('loginForm').onsubmit = function (e) {
    e.preventDefault();
    const login = document.getElementById('login').value.trim();
    const password = document.getElementById('loginPassword').value;
    const error = document.getElementById('loginError');

    error.innerText = '';

    // Check mandatory fields
    if (!login || !password) {
        error.innerText = 'Авторизація не пройшла.';
        return;
    }

    // Debug: Log the input values
    console.log('Login attempt:', { username: login, password: password });

    // Check credentials against users.json
    const user = users.find(user => user.username === login && user.password === password);
    if (user) {
        error.innerHTML = '<span class="success">Авторизація успішна!</span>';
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', login);
        setTimeout(() => {
            document.getElementById('loginModal').classList.add('hidden');
            document.getElementById('loginForm').reset();
        }, 1500);
    } else {
        error.innerText = 'Авторизація не пройшла.';
    }
};