import { NextRequest, NextResponse } from 'next/server';

interface Chapter {
  id: string;
  content_id: string;
  number: number;
  title: string;
}

// Generate mock chapters for each content
function generateMockChapters(contentId: string, count: number): Chapter[] {
  const chapters: Chapter[] = [];
  for (let i = 1; i <= count; i++) {
    chapters.push({
      id: `${contentId}-ch-${i}`,
      content_id: contentId,
      number: i,
      title: `Chapter ${i}`,
    });
  }
  return chapters;
}

const chapterCounts: Record<string, number> = {
  '1': 179,
  '2': 50, // Reduced for demo
  '3': 30,
  '4': 139,
  '5': 40,
  '6': 35,
  '7': 25,
  '8': 30,
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const contentId = resolvedParams.id;
    
    const count = chapterCounts[contentId] || 10;
    const chapters = generateMockChapters(contentId, count);

    return NextResponse.json({ data: chapters });
  } catch (error) {
    console.error('Error in /api/chapters/[id]:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chapters' },
      { status: 500 }
    );
  }
}
