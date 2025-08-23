import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { getUserByClerkId } from '@/lib/actions/users';

export async function GET(
  request: NextRequest,
  { params }: { params: { clerkId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await getUserByClerkId(params.clerkId);
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error getting user by clerk ID:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}