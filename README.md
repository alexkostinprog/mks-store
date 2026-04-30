# 🎵 Mark Sergeevich Store (MSS)

![Next.js](https://shields.io)
![TailwindCSS](https://shields.io)
![Drizzle](https://shields.io)

Премиальный магазин цифрового аудио-контента. Стильный интерфейс, глубокая темная тема и бесшовная покупка эксклюзивных треков.

## ✨ Особенности

- **🎨 Дизайн**: Глубокая темная тема с эффектом Glassmorphism и неоновыми свечениями (Glow).
- **🛒 Корзина**: Умная корзина на Zustand с сохранением в LocalStorage (товары не пропадают при перезагрузке).
- **🔐 Авторизация**: NextAuth (Auth.js) v5 с поддержкой Credentials и входом через Google.
- **🛡️ Безопасность**: Верификация email через **Resend** (OTP-коды) при регистрации.
- **💳 Оплата**: Интеграция с **ЮKassa** (редирект на оплату и проверка статуса заказа).
- **📊 Админка**: Панель управления с аналитикой выручки, списком транзакций и выгрузкой отчетов в **Excel**.

## 🛠 Стек технологий

- **Frontend**: Next.js 15 (App Router), Tailwind CSS, Lucide Icons, Sonner (Toasts), Framer Motion.
- **Backend**: Next.js API Routes, Drizzle ORM.
- **Database**: SQLite (удобно для разработки и быстрого деплоя).
- **State Management**: Zustand + Persist Middleware.

## 🚀 Быстрый старт

### 1. Клонирование репозитория

```bash
git clone https://github.com
cd mks-store
```

### 2. Установка зависимостей

```bash
npm install
```

### 3. Настройка переменных окружения

Создайте файл `.env.local` и заполните его:

```env
# Database
DATABASE_URL="file:./sqlite.db"

# Auth.js
AUTH_SECRET="your_secret_key"
AUTH_GOOGLE_ID="your_google_id"
AUTH_GOOGLE_SECRET="your_google_secret"

# Payments (ЮKassa)
SHOP_ID="your_id"
SHOP_KEY="your_key"

# Email (Resend)
RESEND_API_KEY="re_your_key"
```

### 4. Подготовка базы данных

```bash
npx drizzle-kit push
npm run seed  # Если у вас есть скрипт для наполнения товарами
```

### 5. Запуск

```bash
npm run dev
```

## 📸 Скриншоты

_(Здесь можно добавить ссылки на скриншоты главной страницы и админки)_

---

Создано с любовью к музыке и чистому коду. 🎸 [Марк Сергеевич Store]
