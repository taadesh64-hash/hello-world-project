export interface Content {
  id: string;
  title: string;
  type: string;
  status: string;
  coverImage: string;
  description?: string;
  author?: string;
  artist?: string;
  genres?: string[];
  releaseYear?: number;
  rating?: number;
}

export const mockContents: Content[] = [
  {
    id: '1',
    title: 'Solo Leveling',
    type: 'Manhwa',
    status: 'Completed',
    coverImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&h=600&fit=crop',
    description: 'In a world where hunters fight monsters, the weakest hunter becomes the strongest.',
    author: 'Chugong',
    artist: 'DUBU',
    genres: ['Action', 'Adventure', 'Fantasy'],
    releaseYear: 2018,
    rating: 4.9,
  },
  {
    id: '2',
    title: 'One Piece',
    type: 'Manga',
    status: 'Ongoing',
    coverImage: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&h=600&fit=crop',
    description: 'Follow Monkey D. Luffy on his quest to become the Pirate King.',
    author: 'Eiichiro Oda',
    artist: 'Eiichiro Oda',
    genres: ['Action', 'Adventure', 'Comedy'],
    releaseYear: 1997,
    rating: 4.8,
  },
  {
    id: '3',
    title: 'Tower of God',
    type: 'Manhwa',
    status: 'Ongoing',
    coverImage: 'https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?w=400&h=600&fit=crop',
    description: 'Follow Bam as he climbs the mysterious Tower to find his friend Rachel.',
    author: 'SIU',
    artist: 'SIU',
    genres: ['Action', 'Adventure', 'Mystery'],
    releaseYear: 2010,
    rating: 4.7,
  },
  {
    id: '4',
    title: 'The Beginning After The End',
    type: 'Novel',
    status: 'Ongoing',
    coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop',
    description: 'A king reincarnates into a magical world as a child.',
    author: 'TurtleMe',
    artist: 'Fuyuki23',
    genres: ['Fantasy', 'Adventure', 'Reincarnation'],
    releaseYear: 2016,
    rating: 4.8,
  },
  {
    id: '5',
    title: 'Demon Slayer',
    type: 'Anime',
    status: 'Completed',
    coverImage: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&h=600&fit=crop',
    description: 'A boy becomes a demon slayer to avenge his family and cure his sister.',
    author: 'Koyoharu Gotouge',
    artist: 'ufotable',
    genres: ['Action', 'Supernatural', 'Historical'],
    releaseYear: 2019,
    rating: 4.9,
  },
  {
    id: '6',
    title: 'Martial God Asura',
    type: 'Manhua',
    status: 'Ongoing',
    coverImage: 'https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?w=400&h=600&fit=crop',
    description: 'An ordinary boy discovers extraordinary martial arts powers.',
    author: 'Kindhearted Bee',
    artist: 'Mad Snail Studios',
    genres: ['Action', 'Martial Arts', 'Fantasy'],
    releaseYear: 2013,
    rating: 4.5,
  },
  {
    id: '7',
    title: 'Attack on Titan',
    type: 'Anime',
    status: 'Completed',
    coverImage: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&h=600&fit=crop',
    description: 'Humanity fights for survival against giant humanoid creatures.',
    author: 'Hajime Isayama',
    artist: 'MAPPA',
    genres: ['Action', 'Dark Fantasy', 'Post-Apocalyptic'],
    releaseYear: 2013,
    rating: 4.9,
  },
  {
    id: '8',
    title: 'Omniscient Readers Viewpoint',
    type: 'Manhwa',
    status: 'Ongoing',
    coverImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&h=600&fit=crop',
    description: 'The only reader of a web novel finds himself living in its world.',
    author: 'Sing Shong',
    artist: 'Sleepy-C',
    genres: ['Action', 'Fantasy', 'Survival'],
    releaseYear: 2020,
    rating: 4.8,
  },
];

export const chapterCounts: Record<string, number> = {
  '1': 179,
  '2': 50,
  '3': 30,
  '4': 139,
  '5': 40,
  '6': 35,
  '7': 25,
  '8': 30,
};

export interface Chapter {
  id: string;
  content_id: string;
  number: number;
  title: string;
}

export function generateMockChapters(contentId: string, count: number): Chapter[] {
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

export interface ChapterPage {
  id: string;
  chapter_id: string;
  page_number: number;
  image_url: string;
}

export function generateMockPages(chapterId: string, pageCount: number): ChapterPage[] {
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
