import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { updateInterviewStatus } from '@/lib/actions/interviews';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { status } = body;

    const interview = await updateInterviewStatus(params.id, status);
    return NextResponse.json(interview);
  } catch (error) {
    console.error('Error updating interview status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}