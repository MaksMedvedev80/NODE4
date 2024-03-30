const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const usersFile = 'users.json';

app.use(express.json());

// Получение списка пользователей
app.get('/users', (req, res) => {
  fs.readFile(usersFile, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Ошибка сервера');
    }

    //обработка случая, когда файл пустой или не существует, чтобы избежать попытки разбора пустой строки.
    let users = [];
    try {
      if (data.length > 0) {
        users = JSON.parse(data);
      }
    } catch (error) {
      console.error(error);
      return res.status(500).send('Ошибка сервера: некорректные данные JSON');
    }

    res.json(users);
  });
});

// Получение информации о пользователе по ID
app.get('/users/:id', (req, res) => {
  const userId = req.params.id;

  fs.readFile(usersFile, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Ошибка сервера');
    }

    let users = [];
    try {
      if (data.length > 0) {
        users = JSON.parse(data);
      }
    } catch (error) {
      console.error(error);
      return res.status(500).send('Ошибка сервера: некорректные данные JSON');
    }

    const user = users.find(user => user.id === userId);
    if (!user) {
      return res.status(404).send('Пользователь не найден');
    }

    res.json(user);
  });
});

// Создание нового пользователя
app.post('/users', (req, res) => {
  fs.readFile(usersFile, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Ошибка сервера');
    }

    let users = [];
    try {
      if (data.length > 0) {
        users = JSON.parse(data);
      }
    } catch (error) {
      console.error(error);
      return res.status(500).send('Ошибка сервера: некорректные данные JSON');
    }

    const newUser = req.body;

    // Генерируем уникальный ID для нового пользователя
    newUser.id = uuidv4();

    users.push(newUser);

    fs.writeFile(usersFile, JSON.stringify(users, null, 2), err => {
      if (err) {
        console.error(err);
        return res.status(500).send('Ошибка сервера');
      }

      res.status(201).json(newUser);
    });
  });
});

// Обновление информации о пользователе
app.put('/users/:id', (req, res) => {
  const userId = req.params.id;

  fs.readFile(usersFile, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Ошибка сервера');
    }

    let users = [];
    try {
      if (data.length > 0) {
        users = JSON.parse(data);
      }
    } catch (error) {
      console.error(error);
      return res.status(500).send('Ошибка сервера: некорректные данные JSON');
    }

    const updateUser = req.body;

    const index = users.findIndex(user => user.id === userId);
    if (index === -1) {
      return res.status(404).send('Пользователь не найден');
    }

    users[index] = { ...users[index], ...updateUser };

    fs.writeFile(usersFile, JSON.stringify(users, null, 2), err => {
      if (err) {
        console.error(err);
        return res.status(500).send('Ошибка сервера');
      }

      res.json(users[index]);
    });
  });
});

// Удаление пользователя
app.delete('/users/:id', (req, res) => {
  const userId = req.params.id;

  fs.readFile(usersFile, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Ошибка сервера');
    }

    let users = [];
    try {
      if (data.length > 0) {
        users = JSON.parse(data);
      }
    } catch (error) {
      console.error(error);
      return res.status(500).send('Ошибка сервера: некорректные данные JSON');
    }

    const index = users.findIndex(user => user.id === userId);
    if (index === -1) {
      return res.status(404).send('Пользователь не найден');
    }

    const deletedUser = users.splice(index, 1)[0];

    fs.writeFile(usersFile, JSON.stringify(users, null, 2), err => {
      if (err) {
        console.error(err);
        return res.status(500).send('Ошибка сервера');
      }

      res.json(deletedUser);
    });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
