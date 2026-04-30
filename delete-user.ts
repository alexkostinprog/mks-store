import { db } from './src/lib/db';
import { users } from './src/lib/schema';
import { eq } from 'drizzle-orm';

async function deleteUser() {
  const emailToDelete = 'hh8bb@mail.ru';

  await db.delete(users).where(eq(users.email, emailToDelete));

  console.log(`✅ Пользователь ${emailToDelete} удален из базы`);
}

deleteUser();
