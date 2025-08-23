import { db } from '../db';
import { comments, type Comment, type NewComment } from '../schema';
import { eq } from 'drizzle-orm';

export async function addComment(commentData: Omit<NewComment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Comment> {
  try {
    const [newComment] = await db
      .insert(comments)
      .values(commentData)
      .returning();

    return newComment;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw new Error('Failed to add comment');
  }
}

export async function getComments(interviewId: string): Promise<Comment[]> {
  try {
    return await db
      .select()
      .from(comments)
      .where(eq(comments.interviewId, interviewId));
  } catch (error) {
    console.error('Error getting comments:', error);
    throw new Error('Failed to get comments');
  }
}