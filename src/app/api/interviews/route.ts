import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { getAllInterviews, getMyInterviews, createInterview } from '@/lib/actions/interviews';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (type === 'my') {
      const interviews = await getMyInterviews(userId);
      return NextResponse.json(interviews);
    } else {
      const interviews = await getAllInterviews();
      return NextResponse.json(interviews);
    }
  } catch (error) {
    console.error('Error getting interviews:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, startTime, status, streamCallId, candidateId, interviewerIds } = body;

    const interview = await createInterview({
      title,
      description,
      startTime: new Date(startTime),
      status,
      streamCallId,
      candidateId,
      interviewerIds,
    });

    return NextResponse.json(interview);
  } catch (error) {
    console.error('Error creating interview:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}