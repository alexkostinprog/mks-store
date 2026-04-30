import { Resend } from 'resend';
import { db } from '@/lib/db';
import { verificationTokens } from '@/lib/schema';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { email } = await req.json();
  const code = Math.floor(100000 + Math.random() * 900000).toString(); // Генерим 6 цифр

  try {
    // Сохраняем код в базу на 10 минут
    await db
      .insert(verificationTokens)
      .values({
        identifier: email,
        token: code,
        expires: new Date(Date.now() + 10 * 60 * 1000),
      })
      .onConflictDoUpdate({
        target: verificationTokens.identifier,
        set: { token: code, expires: new Date(Date.now() + 10 * 60 * 1000) },
      });

    // Шлем письмо
    await resend.emails.send({
      from: 'MSS Store <onboarding@resend.dev>', // Или твой домен
      to: email,
      subject: 'Код подтверждения MSS',
      html: `<h1>Ваш код: <strong>${code}</strong></h1><p>Он действует 10 минут.</p>`,
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Ошибка отправки' }, { status: 500 });
  }
}
