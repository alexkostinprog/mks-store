import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // убедитесь, что импорт правильный (именованный или default)
import { users, verificationTokens } from '@/lib/schema';
import { and, eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
  try {
    const { email, password, name, code } = await req.json();
    console.log('Данные из тела: ', email, password, name);
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Заполните все поля' },
        { status: 400 },
      );
    }

    // 1. Проверяем, существует ли юзер (через Drizzle)
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'Пользователь уже существует' },
        { status: 400 },
      );
    }

    // Проверяем код в базе
    const storedToken = await db.query.verificationTokens.findFirst({
      where: and(
        eq(verificationTokens.identifier, email),
        eq(verificationTokens.token, code),
      ),
    });

    // Если кода нет или он протух
    if (!storedToken || storedToken.expires < new Date()) {
      return NextResponse.json(
        { message: 'Неверный или просроченный код' },
        { status: 400 },
      );
    }

    // Если всё ок — удаляем код, чтобы его нельзя было юзать дважды
    await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.identifier, email));

    // 2. Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    await db.insert(users).values({
      id: userId,
      email: email.toLowerCase(),
      password: hashedPassword,
      name: name || 'Юзер',
    });

    // console.log('РЕЗУЛЬТАТ ИЗ БАЗЫ:', result);

    return NextResponse.json(
      { message: 'Регистрация успешна' },
      { status: 201 },
    );
  } catch (error) {
    console.error(error); // Полезно для отладки
    return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 });
  }
}
