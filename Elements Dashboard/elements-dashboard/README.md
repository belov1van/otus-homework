# Elements Dashboard

<div align="center">
  
  **Интерактивный каталог web-компонентов**, созданных на разных фреймворках (Lit, Stencil, Vue и др.)
  
  Каждая карточка включает рейтинг, описание, ссылки на демо и документацию.
  
  Можно открыть страницу отдельного элемента с живой демонстрацией и документацией.
  
</div>


## Особенности

<div align="center">
  
| Функциональность | Статус |
|------------------|--------|
| Отображение списка web-компонентов 
| Рейтинг и описание компонентов 
| Live preview демонстрации 
| Анимированные карточки с эффектами 
| REST API архитектура 
| Полный стек: React + Node.js + Express + MongoDB 

</div>


## Технологический стек

### Frontend
- **React 18** - современная библиотека для построения пользовательских интерфейсов
- **Vite** - быстрый инструмент для сборки и разработки
- **React Router DOM** - маршрутизация в React приложениях
- **Tailwind CSS** - утилитарный CSS фреймворк
- **Framer Motion** - библиотека для анимаций
- **Lucide React** - набор иконок

### Backend
- **Node.js** - серверная платформа JavaScript
- **Express** - веб-фреймворк для Node.js
- **Mongoose** - ODM для MongoDB
- **dotenv** - управление переменными окружения


## Быстрый старт

### 1. Клонирование репозитория

```bash
git clone <repository-url>
cd elements-dashboard
```

### 2. Настройка серверной части

```bash
cd server
npm install
```

Создайте файл `.env` в папке `server/`:

```env
PORT=4000
MONGO_URI=your_mongodb_connection_string
```

> Для MongoDB Atlas используйте строку подключения формата:
> `mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority`

### 3. Инициализация базы данных

```bash
npm run seed
```

Это создаст тестовые элементы каталога.

### 4. Запуск сервера

```bash
npm start
```

Сервер будет доступен по адресу: `http://localhost:4000`

### 5. Запуск клиентской части

```bash
cd ../client
npm install
npm run dev
```

Приложение откроется по адресу: `http://localhost:5173`


## Документация API

### Получение всех элементов
```http
GET /api/elements
```

### Получение элемента по ID
```http
GET /api/elements/:id
```

## Структура проекта

```
elements-dashboard/
├── client/                    # React фронтенд
│   ├── src/
│   │   ├── components/         # UI-компоненты
│   │   │   └── ElementCard.jsx
│   │   ├── pages/             # Страницы приложения
│   │   │   ├── Home.jsx
│   │   │   └── ElementPage.jsx
│   │   ├── api.js             # API клиент
│   │   └── App.jsx            # Корневой компонент
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/                    # Node.js бэкенд
│   ├── src/
│   │   ├── models/           # Mongoose модели
│   │   │   └── Element.js
│   │   ├── routes/           # REST API маршруты
│   │   │   └── elements.js
│   │   ├── db.js             # Подключение к MongoDB
│   │   ├── app.js            # Express приложение
│   │   └── seed.js           # Инициализация базы данных
│   ├── public/               # Статические файлы
│   ├── package.json
│   └── .env                  # Переменные окружения
└── README.md
```