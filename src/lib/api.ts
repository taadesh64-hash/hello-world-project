export interface Content {
    id: string;
    title: string;
    type: string;
    status: string;
    cover_image_url?: string;
    author?: string;
    average_rating?: number;
    genres?: string[];
    description?: string;
    chapters?: number;
    release_year?: number;
    chapter_count?: number;
    year_published?: number;
    banner_image_url?: string;
    illustrator?: string;
    publisher?: string;
    licensed_by?: string;
    volume_count?: number;
    original_language?: string;
    translation_status?: string;
    themes?: string[];
    content_warnings?: string[];
    average_score?: number;
    total_reviews?: number;
    total_readers?: number;
    total_rating_votes?: number;
    created_at?: string;
    updated_at?: string;
    published_at?: string;
    is_featured?: boolean;
    is_approved?: boolean;
}

interface FetchContentsParams {
    contentType?: string;
    search?: string;
    limit?: number;
}

// Mock data for demonstration
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
    },
];

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

interface FetchContentsResult {
    data: Content[];
    hasMore?: boolean;
    total?: number;
}

export async function fetchContents(params: FetchContentsParams & { offset?: number }): Promise<FetchContentsResult> {
    try {
        const queryParams = new URLSearchParams();
        if (params.contentType && params.contentType !== 'all') {
            queryParams.append('contentType', params.contentType);
        }
        if (params.search) {
            queryParams.append('search', params.search);
        }
        if (params.limit) {
            queryParams.append('limit', params.limit.toString());
        }
        if (params.offset !== undefined) {
            queryParams.append('offset', params.offset.toString());
        }

        console.log(`📡 [API] Fetching contents: ${API_BASE_URL}/content?${queryParams.toString()}`);
        const response = await fetch(`${API_BASE_URL}/content?${queryParams.toString()}`);
        
        if (!response.ok) {
          console.error(`❌ [API] HTTP ${response.status} when fetching contents`);
          throw new Error(`HTTP ${response.status}: Failed to fetch contents`);
        }

        const result = await response.json();
        console.log(`✅ [API] Successfully fetched ${result.data?.length || 0} contents`);
        return { 
            data: result.data || [], 
            hasMore: result.hasMore,
            total: result.total 
        };
    } catch (error: any) {
        console.error(`❌ [API] Error fetching contents:`, error);
        return { data: [], hasMore: false, total: 0 };
    }
}
