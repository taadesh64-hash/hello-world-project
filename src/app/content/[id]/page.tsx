'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Content } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Star, BookOpen, ChevronRight } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { useToast } from '@/hooks/use-toast';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api';

export default function ContentDetailPage({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const [content, setContent] = useState<Content | null>(null);
  const [chapters, setChapters] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [id, setId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Unwrap params in Next.js 15+
    Promise.resolve(params).then((resolvedParams) => {
      setId(resolvedParams.id);
    });
  }, [params]);

  useEffect(() => {
    const fetchContent = async () => {
      if (!id) {
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch content by ID
        const contentResponse = await fetch(`${API_BASE_URL}/content/${id}`);
        
        if (!contentResponse.ok) {
          throw new Error(`HTTP ${contentResponse.status}: Failed to fetch content`);
        }
        
        const contentData = await contentResponse.json();
        setContent(contentData.data);

        // Fetch chapters for this content
        const chaptersResponse = await fetch(`${API_BASE_URL}/chapters/${id}`);
        
        if (chaptersResponse.ok) {
          const chaptersData = await chaptersResponse.json();
          setChapters(chaptersData.data || []);
        } else {
          setChapters([]);
        }
        
      } catch (err: any) {
        const errorMessage = err?.message || 'Failed to load content';
        setError(errorMessage);
        
        toast({
          title: 'Error Loading Content',
          description: errorMessage,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [id, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <div className="text-center">
            <p className="text-red-500 mb-2 text-lg font-semibold">{error || 'Content not found'}</p>
            <p className="text-muted-foreground text-sm mb-4">The content you're looking for may have been deleted or doesn't exist.</p>
          </div>
          <Link href="/">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white border border-orange-500 rounded cursor-pointer">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const firstChapter = chapters.length > 0 ? chapters[0] : null;
  const lastChapter = chapters.length > 0 ? chapters[chapters.length - 1] : null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 md:py-8">
        <Link href="/">
          <Button className="mb-6 bg-orange-500 hover:bg-orange-600 text-white border border-orange-500 rounded cursor-pointer transition-all duration-200 w-full sm:w-auto">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Cover Image - Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <Card className="overflow-hidden border-border">
                <div className="relative aspect-[2/3] bg-muted">
                  {content.cover_image_url ? (
                    <img
                      src={content.cover_image_url}
                      alt={content.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-6xl">📚</span>
                    </div>
                  )}
                </div>
              </Card>
              
              <div className="space-y-3">
                <Link href={`/read/${id}?chapter=${chapters.length > 0 ? chapters[0].id : ''}`}>
                  <Button 
                    disabled={chapters.length === 0}
                    className={`w-full cursor-pointer text-white transition-all duration-200 ${
                      chapters.length === 0 
                        ? 'bg-gray-500 opacity-50 cursor-not-allowed' 
                        : 'bg-orange-500 hover:bg-orange-600'
                    }`} 
                    size="lg"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    {chapters.length === 0 ? 'No Chapters' : 'Start Reading'}
                  </Button>
                </Link>

                <div className="grid grid-cols-2 gap-3">
                  {chapters.length > 0 ? (
                    <>
                      <Link href={`/read/${id}?chapter=${chapters[0]?.id}`}>
                        <Button 
                          variant="outline"
                          className="w-full cursor-pointer transition-all duration-200 hover:border-orange-500 hover:text-orange-500"
                          size="sm"
                        >
                          Read First
                        </Button>
                      </Link>
                      <Link href={`/read/${id}?chapter=${chapters[chapters.length - 1]?.id}`}>
                        <Button 
                          variant="outline"
                          className="w-full cursor-pointer transition-all duration-200 hover:border-orange-500 hover:text-orange-500"
                          size="sm"
                        >
                          Read Last
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Button 
                        disabled={true}
                        variant="outline"
                        className="w-full opacity-50 cursor-not-allowed"
                        size="sm"
                      >
                        Read First
                      </Button>
                      <Button 
                        disabled={true}
                        variant="outline"
                        className="w-full opacity-50 cursor-not-allowed"
                        size="sm"
                      >
                        Read Last
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Content Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2 break-words">{content.title}</h1>
                {content.author && (
                  <p className="text-base sm:text-lg text-muted-foreground">by {content.author}</p>
                )}
              </div>
              {content.average_rating && content.average_rating > 0 && (
                <div className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-card border border-orange-500 hover:bg-orange-500/10 transition-all whitespace-nowrap">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 fill-orange-500 flex-shrink-0" />
                  <span className="text-foreground text-lg sm:text-xl font-bold">
                    {content.average_rating.toFixed(1)}
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="default" className="uppercase bg-orange-500 hover:bg-orange-600 text-white border-0 cursor-pointer text-xs sm:text-sm">
                {content.type}
              </Badge>
              <Badge 
                variant={content.status === 'ongoing' ? 'default' : 'secondary'}
                className="text-xs sm:text-sm"
              >
                {content.status}
              </Badge>
              {content.genres?.map((genre, idx) => (
                <Badge key={idx} variant="outline" className="cursor-pointer text-xs sm:text-sm">
                  {genre}
                </Badge>
              ))}
            </div>

            <Card>
              <CardContent className="p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-3 sm:mb-4">Synopsis</h2>
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  {content.description}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-4">Details</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground text-xs sm:text-sm">Chapters</p>
                    <p className="text-foreground font-semibold text-base sm:text-lg">{chapters.length}</p>
                  </div>
                  {content.year_published && (
                    <div>
                      <p className="text-muted-foreground text-xs sm:text-sm">Release Year</p>
                      <p className="text-foreground font-semibold text-base sm:text-lg">{content.year_published}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-muted-foreground text-xs sm:text-sm">Status</p>
                    <p className="text-foreground font-semibold text-base sm:text-lg capitalize">{content.status}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs sm:text-sm">Type</p>
                    <p className="text-foreground font-semibold text-base sm:text-lg uppercase">{content.type}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Chapters List */}
            <Card>
              <CardContent className="p-3 sm:p-4">
                <h2 className="text-sm sm:text-base font-semibold text-foreground mb-2">Chapters</h2>
                {chapters.length > 0 ? (
                  <div className="space-y-1 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                    {chapters.map((chapter, idx) => (
                      <Link key={chapter.id} href={`/read/${content.id}?chapter=${chapter.id}`}>
                        <div className="flex items-center justify-between p-2 hover:bg-orange-500/10 rounded transition-colors cursor-pointer border border-transparent hover:border-orange-500">
                          <div className="flex-1 min-w-0">
                            <p className="text-foreground font-medium text-xs sm:text-sm truncate">
                              Ch {chapter.number}
                            </p>
                            {chapter.title && (
                              <p className="text-muted-foreground text-xs truncate">
                                {chapter.title}
                              </p>
                            )}
                          </div>
                          <ChevronRight className="w-3 h-3 text-muted-foreground flex-shrink-0 ml-1" />
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground text-xs sm:text-sm">
                      No chapters available for this content yet.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #f97316;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #ea580c;
        }
      `}</style>
    </div>
  );
}
