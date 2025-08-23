import { db } from '../db';
import { interviews, type Interview, type NewInterview } from '../schema';
import { eq } from 'drizzle-orm';

export async function getAllInterviews(): Promise<Interview[]> {
  try {
    return await db.select().from(interviews);
  } catch (error) {
    console.error('Error getting all interviews:', error);
    throw new Error('Failed to get interviews');
  }
}

export async function getMyInterviews(candidateId: string): Promise<Interview[]> {
  try {
    return await db
      .select()
      .from(interviews)
      .where(eq(interviews.candidateId, candidateId));
  } catch (error) {
    console.error('Error getting my interviews:', error);
    throw new Error('Failed to get interviews');
  }
}

export async function getInterviewByStreamCallId(streamCallId: string): Promise<Interview | null> {
  try {
    const result = await db
      .select()
      .from(interviews)
      .where(eq(interviews.streamCallId, streamCallId))
      .limit(1);

    return result[0] || null;
  } catch (error) {
    console.error('Error getting interview by stream call ID:', error);
    throw new Error('Failed to get interview');
  }
}

export async function createInterview(interviewData: Omit<NewInterview, 'id' | 'createdAt' | 'updatedAt'>): Promise<Interview> {
  try {
    const [newInterview] = await db
      .insert(interviews)
      .values(interviewData)
      .returning();

    return newInterview;
  } catch (error) {
    console.error('Error creating interview:', error);
    throw new Error('Failed to create interview');
  }
}

export async function updateInterviewStatus(id: string, status: string): Promise<Interview> {
  try {
    const updateData: Partial<Interview> = {
      status,
      updatedAt: new Date(),
    };

    if (status === 'completed') {
      updateData.endTime = new Date();
    }

    const [updatedInterview] = await db
      .update(interviews)
      .set(updateData)
      .where(eq(interviews.id, id))
      .returning();

    return updatedInterview;
  } catch (error) {
    console.error('Error updating interview status:', error);
    throw new Error('Failed to update interview status');
  }
}