import { NextRequest, NextResponse } from 'next/server';

interface ChapterPage {
  id: string;
  chapter_id: string;
  page_number: number;
  image_url: string;
}

// Generate mock pages for a chapter
function generateMockPages(chapterId: string, pageCount: number): ChapterPage[] {
  const pages: ChapterPage[] = [];
  const imageUrls = [
    'https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?w=800&h=1200&fit=crop',
    'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=800&h=1200&fit=crop',
    'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&h=1200&fit=crop',
    'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&h=1200&fit=crop',
    'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=800&h=1200&fit=crop',
  ];

  for (let i = 1; i <= pageCount; i++) {
    pages.push({
      id: `${chapterId}-page-${i}`,
      chapter_id: chapterId,
      page_number: i,
      image_url: imageUrls[i % imageUrls.length],
    });
  }
  return pages;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const chapterId = resolvedParams.id;
    
    // Generate 10-15 pages per chapter
    const pageCount = Math.floor(Math.random() * 6) + 10;
    const pages = generateMockPages(chapterId, pageCount);

    return NextResponse.json({ 
      data: {
        chapter_id: chapterId,
        pages: pages
      }
    });
  } catch (error) {
    console.error('Error in /api/chapter/[id]/pages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chapter pages' },
      { status: 500 }
    );
  }
}
