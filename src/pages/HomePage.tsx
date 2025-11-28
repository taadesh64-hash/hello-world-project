import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Content } from '@/data/mockContent';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, Search } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { useToast } from '@/hooks/use-toast';
import { useContentContext } from '@/context/ContentContext';

const contentTypes = [
  { id: 'all', label: 'All' },
  { id: 'manga', label: 'Manga' },
  { id: 'manhwa', label: 'Manhwa' },
  { id: 'anime', label: 'Anime' },
  { id: 'novel', label: 'Novel' },
  { id: 'manhua', label: 'Manhua' },
];

export default function HomePage() {
  const {
    contents,
    loading,
    activeTab,
    searchQuery,
    hasMore,
    setActiveTab,
    setSearchQuery,
    loadContents,
    loadMoreContents,
  } = useContentContext();
  
  const [requestTitle, setRequestTitle] = useState('');
  const [requestVariant, setRequestVariant] = useState('');
  const { toast } = useToast();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    loadContents(activeTab, searchQuery);
  }, [activeTab, searchQuery, loadContents]);

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMoreContents();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loading, loadMoreContents]);

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestTitle || !requestVariant) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Request Submitted",
      description: `Your request for "${requestTitle}" has been submitted!`,
    });
    
    setRequestTitle('');
    setRequestVariant('');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {/* Tab Navigation */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap gap-2">
            {contentTypes.map((type) => (
              <Button
                key={type.id}
                onClick={() => setActiveTab(type.id)}
                variant={activeTab === type.id ? 'default' : 'outline'}
                size="lg"
                className={`min-w-[100px] cursor-pointer ${
                  activeTab === type.id ? 'bg-orange-500 hover:bg-orange-600 text-white' : ''
                }`}
              >
                {type.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Content Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
            <p className="mt-4 text-muted-foreground">Loading content...</p>
          </div>
        ) : contents.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {contents.map((content) => (
                <Link key={content.id} href={`/content/${content.id}`}>
                  <Card 
                    className="group overflow-hidden border-[1.5px] border-border hover:border-orange-500 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20 cursor-pointer rounded-xl"
                  >
...
                  </Card>
                </Link>
              ))}
            </div>
            
            {/* Infinite scroll trigger */}
            <div ref={loadMoreRef} className="flex justify-center py-8">
              {hasMore && loading && (
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <div className="mb-4">
              <Search className="w-16 h-16 mx-auto text-muted-foreground opacity-50" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">
              No content found
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              {searchQuery 
                ? `We couldn't find any results for "${searchQuery}". Try adjusting your search.`
                : 'No content available in this category yet. Check back soon!'}
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-20 bg-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h4 className="text-xl font-semibold text-foreground mb-6 text-center">
              Request Content
            </h4>
            <form onSubmit={handleRequestSubmit} className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="title" className="text-foreground">Title</Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="Enter content title..."
                    value={requestTitle}
                    onChange={(e) => setRequestTitle(e.target.value)}
                    className="mt-1 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="email" className="text-foreground">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email..."
                    className="mt-1 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="variant" className="text-foreground">Variant</Label>
                  <Select value={requestVariant} onValueChange={setRequestVariant}>
                    <SelectTrigger className="mt-1 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all">
                      <SelectValue placeholder="Select variant..." />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="manga">Manga</SelectItem>
                      <SelectItem value="manhwa">Manhwa</SelectItem>
                      <SelectItem value="manhua">Manhua</SelectItem>
                      <SelectItem value="anime">Anime</SelectItem>
                      <SelectItem value="novel">Novel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button type="submit" className="w-full cursor-pointer bg-orange-500 hover:bg-orange-600 text-white" size="lg">
                Submit Request
              </Button>
            </form>
          </div>
          
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-foreground mb-2">
              AniVerseHub
            </h3>
            <p className="text-muted-foreground text-sm">
              Discover • Read • Enjoy
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
