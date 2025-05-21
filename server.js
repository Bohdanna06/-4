const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Шлях до файлів
const dbPath = path.join(__dirname, 'db.json');
const productsPath = path.join(__dirname, 'products.json');

// Читання та запис в db.json
function readDB() {
    return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
}

function writeDB(data) {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
}

// Реєстрація нового користувача
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    const db = readDB();

    const existingUser = db.users.find(u => u.username === username);
    if (existingUser) {
        return res.status(400).json({ message: 'Користувач вже існує' });
    }

    const newUser = {
        id: Date.now(),
        username: username,
        password: password,
        role: 'user' // роль за замовчуванням
    };

    db.users.push(newUser);
    writeDB(db);

    res.status(201).json({ message: 'Користувача зареєстровано успішно' });
});

// Логін користувача
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const db = readDB();

    const user = db.users.find(u => u.username === username && u.password === password);
    if (!user) {
        return res.status(401).json({ message: 'Невірний логін або пароль' });
    }

    res.json({
        message: 'Вхід успішний',
        user: {
            id: user.id,
            username: user.username,
            role: user.role
        }
    });
});

// Отримати всі товари
app.get('/api/products', (req, res) => {
  fs.readFile(productsPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Помилка при читанні файлу товарів');
    }
    res.json(JSON.parse(data));
  });
});

// CRUD операції для товарів
app.post('/api/products', (req, res) => {
  const { role } = req.body; // припускаємо, що роль користувача передається в тілі запиту
  if (role !== 'admin') {
    return res.status(403).json({ message: 'Тільки адміністратор може додавати товари' });
  }

  const newProduct = req.body.product; // Отримуємо новий товар з тіла запиту
  fs.readFile(productsPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Помилка при читанні файлу товарів');
    }

    const products = JSON.parse(data);
    newProduct.id = Date.now(); // Генерація нового id
    products.push(newProduct);

    fs.writeFile(productsPath, JSON.stringify(products, null, 2), 'utf8', (err) => {
      if (err) {
        return res.status(500).send('Помилка при збереженні товару');
      }
      res.status(201).json(newProduct);
    });
  });
});

// Оновлення товару
app.put('/api/products/:id', (req, res) => {
  const { role } = req.body; // перевіряємо роль користувача
  if (role !== 'admin') {
    return res.status(403).json({ message: 'Тільки адміністратор може оновлювати товари' });
  }

  const productId = parseInt(req.params.id);
  const updatedProduct = req.body.product;

  fs.readFile(productsPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Помилка при читанні файлу товарів');
    }

    let products = JSON.parse(data);
    const productIndex = products.findIndex(p => p.id === productId);

    if (productIndex === -1) {
      return res.status(404).json({ message: 'Товар не знайдений' });
    }

    products[productIndex] = { ...products[productIndex], ...updatedProduct };

    fs.writeFile(productsPath, JSON.stringify(products, null, 2), 'utf8', (err) => {
      if (err) {
        return res.status(500).send('Помилка при оновленні товару');
      }
      res.json(products[productIndex]);
    });
  });
});

// Видалення товару
app.delete('/api/products/:id', (req, res) => {
  const { role } = req.body; // перевіряємо роль користувача
  if (role !== 'admin') {
    return res.status(403).json({ message: 'Тільки адміністратор може видаляти товари' });
  }

  const productId = parseInt(req.params.id);

  fs.readFile(productsPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Помилка при читанні файлу товарів');
    }

    let products = JSON.parse(data);
    const productIndex = products.findIndex(p => p.id === productId);

    if (productIndex === -1) {
      return res.status(404).json({ message: 'Товар не знайдений' });
    }

    products.splice(productIndex, 1); // Видаляємо товар

    fs.writeFile(productsPath, JSON.stringify(products, null, 2), 'utf8', (err) => {
      if (err) {
        return res.status(500).send('Помилка при видаленні товару');
      }
      res.json({ message: 'Товар успішно видалений' });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Сервер працює на http://localhost:${PORT}`);
});
