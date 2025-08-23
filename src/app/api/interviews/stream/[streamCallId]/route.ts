import { NextRequest, NextResponse } from 'next/server';
import { getInterviewByStreamCallId } from '@/lib/actions/interviews';

export async function GET(
  request: NextRequest,
  { params }: { params: { streamCallId: string } }
) {
  try {
    const interview = await getInterviewByStreamCallId(params.streamCallId);
    return NextResponse.json(interview);
  } catch (error) {
    console.error('Error getting interview by stream call ID:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}