import { NextRequest, NextResponse } from 'next/server';

interface Content {
  id: string;
  title: string;
  type: string;
  status: string;
  cover_image_url?: string;
  author?: string;
  average_rating?: number;
  genres?: string[];
  description?: string;
  chapter_count?: number;
  year_published?: number;
}

const mockContents: Content[] = [
  {
    id: '1',
    title: 'Solo Leveling',
    type: 'manhwa',
    status: 'completed',
    cover_image_url: 'https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?w=400&h=600&fit=crop',
    author: 'Chugong',
    average_rating: 4.8,
    genres: ['Action', 'Fantasy', 'Adventure'],
    description: 'Ten years ago, "the Gate" appeared and connected the real world with the realm of magic and monsters. To combat these vile beasts, ordinary people received superhuman powers and became known as "Hunters." Twenty-year-old Sung Jin-Woo is one such Hunter, but he is known as the "World\'s Weakest," owing to his pathetic power compared to even a measly E-Rank. Still, he hunts monsters tirelessly in low-rank Gates to pay for his mother\'s medical bills.',
    chapter_count: 179,
    year_published: 2018,
  },
  {
    id: '2',
    title: 'One Piece',
    type: 'manga',
    status: 'ongoing',
    cover_image_url: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&h=600&fit=crop',
    author: 'Eiichiro Oda',
    average_rating: 4.9,
    genres: ['Action', 'Adventure', 'Comedy'],
    description: 'Monkey D. Luffy refuses to let anyone or anything stand in the way of his quest to become king of all pirates. With a course charted for the treacherous waters of the Grand Line, this is one captain who\'ll never drop anchor until he\'s claimed the greatest treasure on Earth—the Legendary One Piece!',
    chapter_count: 1098,
    year_published: 1997,
  },
  {
    id: '3',
    title: 'Tower of God',
    type: 'manhwa',
    status: 'ongoing',
    cover_image_url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&h=600&fit=crop',
    author: 'SIU',
    average_rating: 4.7,
    genres: ['Fantasy', 'Action', 'Mystery'],
    description: 'Reach the top, and everything will be yours. At the top of the tower exists everything in this world, and all of it can be yours. You can become a god. This is the story of the beginning and the end of Rachel, the girl who climbed the tower so she could see the stars, and Bam, the boy who needed nothing but her.',
    chapter_count: 595,
    year_published: 2010,
  },
  {
    id: '4',
    title: 'Attack on Titan',
    type: 'anime',
    status: 'completed',
    cover_image_url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&h=600&fit=crop',
    author: 'Hajime Isayama',
    average_rating: 4.9,
    genres: ['Action', 'Drama', 'Dark Fantasy'],
    description: 'Humanity lives in fear of Titans, gigantic creatures who devoured humans alive. The Titans have nearly driven mankind to extinction. A century later, all that remains of humanity are three concentric walls that protect them from the Titans. Eren Yeager vows to wipe out every single Titan after witnessing their brutal killing of his mother.',
    chapter_count: 139,
    year_published: 2009,
  },
  {
    id: '5',
    title: 'The Beginning After The End',
    type: 'novel',
    status: 'ongoing',
    cover_image_url: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop',
    author: 'TurtleMe',
    average_rating: 4.8,
    genres: ['Fantasy', 'Adventure', 'Reincarnation'],
    description: 'King Grey has unrivaled strength, wealth, and prestige in a world governed by martial ability. However, solitude lingers closely behind those with great power. Beneath the glamorous exterior of a powerful king lurks the shell of man, devoid of purpose and will. Reincarnated into a new world filled with magic and monsters, the king has a second chance to relive his life.',
    chapter_count: 453,
    year_published: 2016,
  },
  {
    id: '6',
    title: 'Battle Through the Heavens',
    type: 'manhua',
    status: 'ongoing',
    cover_image_url: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&h=600&fit=crop',
    author: 'Heavenly Silkworm Potato',
    average_rating: 4.5,
    genres: ['Action', 'Fantasy', 'Martial Arts'],
    description: 'In a land where there is no magic, a land where the strong makes the rules and weak has to obey, a land filled with alluring treasures and beauty yet also filled with unforeseen danger. Xiao Yan, who has shown talents none had seen in decades, suddenly lost everything three years ago - his powers, his reputation, and his promise to his mother.',
    chapter_count: 387,
    year_published: 2009,
  },
  {
    id: '7',
    title: 'Jujutsu Kaisen',
    type: 'manga',
    status: 'ongoing',
    cover_image_url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&h=600&fit=crop',
    author: 'Gege Akutami',
    average_rating: 4.7,
    genres: ['Action', 'Supernatural', 'Dark Fantasy'],
    description: 'Yuji Itadori is a boy with tremendous physical strength, though he lives a completely ordinary high school life. One day, to save a classmate who has been attacked by curses, he eats the finger of Ryomen Sukuna, taking the curse into his own soul.',
    chapter_count: 246,
    year_published: 2018,
  },
  {
    id: '8',
    title: 'The God of High School',
    type: 'manhwa',
    status: 'completed',
    cover_image_url: 'https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?w=400&h=600&fit=crop',
    author: 'Yongje Park',
    average_rating: 4.6,
    genres: ['Action', 'Martial Arts', 'Supernatural'],
    description: 'While an island half-disappearing from the face of the earth, a mysterious organization is sending out invitations for a tournament to every skilled fighter in the world. "If you win you can have ANYTHING you want." They\'re recruiting only the best to fight the best and claim the title of The God of High School!',
    chapter_count: 569,
    year_published: 2011,
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const contentType = searchParams.get('contentType');
    const search = searchParams.get('search');
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset') || '0';

    let filtered = [...mockContents];

    if (contentType && contentType !== 'all') {
      filtered = filtered.filter(content => content.type === contentType);
    }

    if (search) {
      const query = search.toLowerCase();
      filtered = filtered.filter(content =>
        content.title.toLowerCase().includes(query) ||
        content.author?.toLowerCase().includes(query) ||
        content.genres?.some(genre => genre.toLowerCase().includes(query))
      );
    }

    const offsetNum = parseInt(offset);
    const limitNum = limit ? parseInt(limit) : filtered.length;
    
    const paginatedData = filtered.slice(offsetNum, offsetNum + limitNum);
    const hasMore = offsetNum + limitNum < filtered.length;

    return NextResponse.json({
      data: paginatedData,
      hasMore,
      total: filtered.length,
    });
  } catch (error) {
    console.error('Error in /api/content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contents' },
      { status: 500 }
    );
  }
}
