import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronDown, Volume2, VolumeX, BookOpen } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ChapterPage {
  id: string;
  chapter_id: string;
  page_number: number;
  image_url: string;
}

interface Chapter {
  id: string;
  content_id: string;
  number: number;
  title: string;
  pages?: ChapterPage[];
}

interface ActiveChapter {
  chapter: Chapter;
  pages: ChapterPage[];
  isLocked: boolean;
}

export default function ReaderPage() {
  const { id: contentId } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const initialChapterId = searchParams.get('chapter');
  const { toast } = useToast();

  // State management
  const [activeChapters, setActiveChapters] = useState<ActiveChapter[]>([]);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [maxLoadedImageIndex, setMaxLoadedImageIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const fetchedChaptersRef = useRef<Set<string>>(new Set());
  const allChaptersRef = useRef<Chapter[]>([]);

  // Fetch all chapters for the content
  const fetchAllChapters = useCallback(async () => {
    if (!contentId) return [];
    try {
      console.log(`📚 [Reader] Fetching all chapters for content: ${contentId}`);
      const { fetchChapters } = await import('@/lib/api');
      const response = await fetchChapters(contentId);
      console.log(`✅ [Reader] Successfully fetched ${response.data?.length || 0} chapters`);
      return response.data || [];
    } catch (err: any) {
      console.error('❌ [Reader] Error fetching chapters:', err);
      toast({
        title: 'Error Loading Chapters',
        description: err?.message || 'Failed to load chapters',
        variant: 'destructive',
      });
      return [];
    }
  }, [contentId, toast]);

  // Fetch pages for a specific chapter
  const fetchChapterPages = useCallback(async (chapterId: string) => {
    try {
      if (fetchedChaptersRef.current.has(chapterId)) {
        console.log(`📄 [Reader] Chapter ${chapterId} already cached, skipping fetch`);
        return null;
      }

      console.log(`📖 [Reader] Fetching pages for chapter: ${chapterId}`);
      const { fetchChapterPages: getPages } = await import('@/lib/api');
      const response = await fetchChapterPages(chapterId);
      console.log(`✅ [Reader] Successfully fetched ${response.data?.pages?.length || 0} pages for chapter ${chapterId}`);
      
      fetchedChaptersRef.current.add(chapterId);
      
      return response.data?.pages || [];
    } catch (err: any) {
      console.error(`❌ [Reader] Error fetching pages for chapter ${chapterId}:`, err);
      toast({
        title: 'Error Loading Pages',
        description: err?.message || `Failed to load pages for chapter ${chapterId}`,
        variant: 'destructive',
      });
      return [];
    }
  }, [toast]);

  // Initialize with starting chapter
  useEffect(() => {
    const initialize = async () => {
      try {
        console.log(`\n🎬 [Reader] Initializing reader page...`);
        console.log(`📋 [Reader] Content ID: ${contentId}, Initial Chapter: ${initialChapterId}`);
        
        setLoading(true);
        const allChapters = await fetchAllChapters();

        if (allChapters.length === 0) {
          console.error('❌ [Reader] No chapters found');
          setError('No chapters found');
          toast({
            title: 'No Chapters Available',
            description: 'This content has no chapters yet',
            variant: 'destructive',
          });
          setLoading(false);
          return;
        }

        // Store all chapters in ref for later preloading
        allChaptersRef.current = allChapters;
        console.log(`📊 [Reader] Total chapters available: ${allChapters.length}`);

        // Find starting chapter index
        let startIndex = 0;
        if (initialChapterId) {
          const idx = allChapters.findIndex((ch: Chapter) => ch.id === initialChapterId);
          startIndex = idx !== -1 ? idx : 0;
          console.log(`🔍 [Reader] Starting chapter index: ${startIndex}`);
        }

        // Load first chapter and prepare next ones
        const firstChapter = allChapters[startIndex];
        console.log(`📖 [Reader] Loading first chapter: "${firstChapter.title}" (Chapter ${firstChapter.number})`);
        
        const pages = await fetchChapterPages(firstChapter.id);
        console.log(`📄 [Reader] First chapter has ${pages?.length || 0} pages`);

        const newActive: ActiveChapter[] = [
          {
            chapter: firstChapter,
            pages: pages || [],
            isLocked: false,
          },
        ];

        // Preload next chapter if exists
        if (startIndex + 1 < allChapters.length) {
          const nextChapter = allChapters[startIndex + 1];
          console.log(`📚 [Reader] Preloading next chapter: "${nextChapter.title}"`);
          
          const nextPages = await fetchChapterPages(nextChapter.id);
          newActive.push({
            chapter: nextChapter,
            pages: nextPages || [],
            isLocked: true,
          });

          // Preload chapter after that if exists
          if (startIndex + 2 < allChapters.length) {
            const thirdChapter = allChapters[startIndex + 2];
            console.log(`📚 [Reader] Preloading chapter after next: "${thirdChapter.title}"`);
            const thirdPages = await fetchChapterPages(thirdChapter.id);
            newActive.push({
              chapter: thirdChapter,
              pages: thirdPages || [],
              isLocked: true,
            });
          }
        }

        setActiveChapters(newActive);
        setCurrentChapterIndex(0);
        setMaxLoadedImageIndex(0);
        setError(null);
        console.log(`✅ [Reader] Reader initialization complete`);
      } catch (err: any) {
        console.error('❌ [Reader] Initialization error:', err);
        setError('Failed to load chapters');
        toast({
          title: 'Initialization Error',
          description: err?.message || 'Failed to initialize reader',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [contentId, initialChapterId, fetchAllChapters, fetchChapterPages, toast]);

  // Handle image load - only load next image when current completes
  const handleImageLoad = useCallback(() => {
    console.log(`📸 [Reader] Image loaded at index: ${maxLoadedImageIndex + 1}`);
    setMaxLoadedImageIndex((prev) => prev + 1);
  }, [maxLoadedImageIndex]);

  // Handle scroll for hiding/showing header
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDifference = Math.abs(currentScrollY - lastScrollY);
      const scrollThreshold = window.innerHeight * 0.05; // 5% of viewport height

      if (scrollDifference > scrollThreshold) {
        // Scrolling down
        if (currentScrollY > lastScrollY) {
          setShowHeader(false);
        } 
        // Scrolling up
        else {
          setShowHeader(true);
        }
        setLastScrollY(currentScrollY);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Handle chapter navigation without scroll
  const handleReadNextChapterNoScroll = useCallback(async () => {
    try {
      const nextIdx = currentChapterIndex + 1;
      console.log(`➡️ [Reader] Moving to next chapter from index ${currentChapterIndex}`);
      
      setActiveChapters((prev) => {
        const updated = [...prev];
        if (updated[nextIdx]) {
          console.log(`🔓 [Reader] Unlocking chapter: ${updated[nextIdx].chapter.title}`);
          updated[nextIdx].isLocked = false;
        }
        return updated;
      });

      // Preload next chapters if needed
      if (nextIdx + 1 >= activeChapters.length && allChaptersRef.current.length > 0) {
        const nextChapterInAllIdx = allChaptersRef.current.findIndex(
          (ch) => ch.id === activeChapters[nextIdx]?.chapter.id
        );
        
        if (nextChapterInAllIdx !== -1) {
          // Preload chapters ahead
          if (nextChapterInAllIdx + 1 < allChaptersRef.current.length) {
            const chapterToPreload = allChaptersRef.current[nextChapterInAllIdx + 1];
            console.log(`📚 [Reader] Preloading upcoming chapter: "${chapterToPreload.title}"`);
            const preloadedPages = await fetchChapterPages(chapterToPreload.id);
            
            setActiveChapters((prev) => [
              ...prev,
              {
                chapter: chapterToPreload,
                pages: preloadedPages || [],
                isLocked: true,
              },
            ]);
          }
        }
      }

      setCurrentChapterIndex(nextIdx);
      setMaxLoadedImageIndex(0);
    } catch (err: any) {
      console.error('❌ [Reader] Error moving to next chapter:', err);
      toast({
        title: 'Error',
        description: 'Failed to load next chapter',
        variant: 'destructive',
      });
    }
  }, [currentChapterIndex, activeChapters, fetchChapterPages, toast]);

  // Calculate total image index across all chapters
  const getTotalImageIndex = useCallback((chapterIdx: number, pageIdx: number) => {
    try {
      let total = 0;
      for (let i = 0; i < chapterIdx; i++) {
        total += activeChapters[i]?.pages.length || 0;
      }
      return total + pageIdx;
    } catch (err) {
      console.error('❌ [Reader] Error calculating image index:', err);
      return 0;
    }
  }, [activeChapters]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar searchQuery="" onSearchChange={() => {}} />
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Loading chapter...</p>
        </div>
      </div>
    );
  }

  if (error || activeChapters.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar searchQuery="" onSearchChange={() => {}} />
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] gap-4">
          <p className="text-destructive text-lg">{error || 'No chapters available'}</p>
          <Link href={`/content/${contentId}`}>
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Content
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar searchQuery="" onSearchChange={() => {}} />

      {/* Reader Header - hides on scroll */}
      <div className={`sticky top-16 z-40 bg-card/95 backdrop-blur-sm border-b border-border transition-all duration-300 ${
        showHeader ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}>
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            onClick={() => {
              if (currentChapterIndex > 0) {
                setCurrentChapterIndex((prev) => prev - 1);
              }
            }}
            disabled={currentChapterIndex === 0}
            variant="ghost"
            size="sm"
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Prev</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {activeChapters[currentChapterIndex]?.chapter.title || `Ch ${activeChapters[currentChapterIndex]?.chapter.number}`}
                </span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="max-h-96 overflow-y-auto">
              {activeChapters.map((ac, idx) => (
                <DropdownMenuItem
                  key={ac.chapter.id}
                  onClick={() => {
                    setCurrentChapterIndex(idx);
                    setActiveChapters((prev) => {
                      const updated = [...prev];
                      if (updated[idx]) {
                        updated[idx].isLocked = false;
                      }
                      return updated;
                    });
                  }}
                  className={`cursor-pointer ${idx === currentChapterIndex ? 'bg-orange-500/20 text-orange-500' : ''}`}
                >
                  <span>Ch {ac.chapter.number}: {ac.chapter.title || 'Untitled'}</span>
                  {idx === currentChapterIndex && <span className="ml-2">✓</span>}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            onClick={handleReadNextChapterNoScroll}
            disabled={currentChapterIndex >= activeChapters.length - 1}
            variant="ghost"
            size="sm"
            className="gap-2"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronDown className="w-4 h-4 rotate-180" />
          </Button>
        </div>
      </div>

      {/* Reader Container */}
      <div ref={containerRef} className="max-w-4xl mx-auto px-4 py-8">
        {activeChapters.map((activeChapter, chapterIdx) => {
          console.log(`\n📖 [Reader Render] Rendering chapter ${chapterIdx}: "${activeChapter.chapter.title}" (${activeChapter.pages?.length || 0} pages)`);
          
          return (
          <div key={activeChapter.chapter.id} className="mb-12">
            {/* Chapter Header */}
            {chapterIdx > 0 && (
              <div className="text-center mb-8 py-6 border-t border-border">
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  Chapter {activeChapter.chapter.number}
                </h3>
                <p className="text-muted-foreground">{activeChapter.chapter.title}</p>
              </div>
            )}

            {/* Chapter Images */}
            <div
              className={`${
                activeChapter.isLocked ? 'relative' : ''
              }`}
            >
              {/* Blur overlay for locked chapters */}
              {activeChapter.isLocked && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-md rounded-xl z-50 flex items-center justify-center min-h-[400px]">
                  <div className="text-center space-y-4">
                    <div className="text-6xl mb-4">🔒</div>
                    <h3 className="text-2xl font-bold text-white">Chapter Locked</h3>
                    <p className="text-gray-300 max-w-sm mx-auto">This chapter is loading. Click below to unlock and start reading.</p>
                    <Button
                      onClick={handleReadNextChapterNoScroll}
                      className="gap-2 bg-orange-500 hover:bg-orange-600 text-white"
                      size="lg"
                    >
                      Read Chapter {activeChapter.chapter.number}
                      <ChevronDown className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Images */}
              {activeChapter.pages && activeChapter.pages.length > 0 ? (
                activeChapter.pages.map((page, pageIdx) => {
                  try {
                    const totalImageIndex = getTotalImageIndex(chapterIdx, pageIdx);
                    const shouldRender = totalImageIndex <= maxLoadedImageIndex;

                    console.log(`  📄 [Page ${pageIdx + 1}] URL: ${page.image_url?.substring(0, 50)}... | Index: ${totalImageIndex} | Should Render: ${shouldRender}`);

                    return (
                      <div
                        key={page.id}
                        className="relative bg-muted overflow-hidden"
                      >
                        {shouldRender && page.image_url ? (
                          <img
                            src={page.image_url}
                            alt={`Page ${page.page_number}`}
                            className="w-full h-auto"
                            onLoad={handleImageLoad}
                            onError={(err) => {
                              console.error(`❌ [Reader] Failed to load image for page ${page.page_number}:`, err);
                              toast({
                                title: 'Image Load Error',
                                description: `Failed to load page ${page.page_number}`,
                                variant: 'destructive',
                              });
                            }}
                          />
                        ) : (
                          <div className="aspect-[2/3] bg-card flex items-center justify-center border border-border rounded-lg">
                            <div className="text-center space-y-2">
                              <div className="animate-pulse">
                                <div className="w-8 h-8 bg-muted rounded-full mx-auto mb-2"></div>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Page {page.page_number}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  } catch (err) {
                    console.error(`❌ [Reader] Error rendering page ${pageIdx}:`, err);
                    return (
                      <div key={page.id} className="text-center py-8 text-destructive">
                        Failed to load page {page.page_number}
                      </div>
                    );
                  }
                })
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  ⚠️ No pages found for this chapter
                </div>
              )}
            </div>

            {/* Advertisement between chapters */}
            {chapterIdx < activeChapters.length - 1 && (
              <div className="my-12 py-8 border-y border-border">
                <div className="bg-card border border-border rounded-lg p-8 text-center">
                  <div className="text-xs text-muted-foreground mb-4 uppercase tracking-wide">
                    Advertisement
                  </div>
                  <div className="bg-muted rounded aspect-video flex items-center justify-center">
                    <p className="text-muted-foreground">Ad Space</p>
                  </div>
                </div>
              </div>
            )}

            {/* Next Chapter Button - only show at end of chapter */}
            {chapterIdx === currentChapterIndex && (
              <div className="mt-8 text-center py-8">
                <p className="text-muted-foreground">End of chapter. Use header buttons to navigate.</p>
              </div>
            )}
          </div>
          );
        })}

        {/* End of content */}
        <div className="mt-12 py-8 text-center border-t border-border">
          <p className="text-muted-foreground mb-4">You've reached the end of available chapters</p>
          <Link href={`/content/${contentId}`}>
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Content
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
