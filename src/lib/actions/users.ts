import { db } from '../db';
import { users, type User, type NewUser } from '../schema';
import { eq } from 'drizzle-orm';

export async function syncUser(userData: Omit<NewUser, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, userData.clerkId))
      .limit(1);

    if (existingUser.length > 0) {
      return existingUser[0];
    }

    const [newUser] = await db
      .insert(users)
      .values({
        ...userData,
        role: 'candidate',
      })
      .returning();

    return newUser;
  } catch (error) {
    console.error('Error syncing user:', error);
    throw new Error('Failed to sync user');
  }
}

export async function getUsers(): Promise<User[]> {
  try {
    return await db.select().from(users);
  } catch (error) {
    console.error('Error getting users:', error);
    throw new Error('Failed to get users');
  }
}

export async function getUserByClerkId(clerkId: string): Promise<User | null> {
  try {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, clerkId))
      .limit(1);

    return result[0] || null;
  } catch (error) {
    console.error('Error getting user by clerk ID:', error);
    throw new Error('Failed to get user');
  }
}