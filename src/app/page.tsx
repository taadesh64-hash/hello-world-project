'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Content } from '@/lib/api';
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
    setActiveTab,
    setSearchQuery,
    loadContents,
  } = useContentContext();
  
  const [requestTitle, setRequestTitle] = useState('');
  const [requestVariant, setRequestVariant] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadContents(activeTab, searchQuery);
  }, [activeTab, searchQuery, loadContents]);

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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {contents.map((content) => (
              <Link key={content.id} href={`/content/${content.id}`}>
                <Card 
                  className="group overflow-hidden border-[1.5px] border-border hover:border-orange-500 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20 cursor-pointer rounded-xl"
                >
                {/* Cover Image */}
                <div className="relative aspect-[2/3] overflow-hidden bg-muted">
                  {content.cover_image_url ? (
                    <img
                      src={content.cover_image_url}
                      alt={content.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-4xl">📚</span>
                    </div>
                  )}
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Status Badge */}
                  <Badge 
                    className="absolute top-2 right-2 text-xs font-bold flex items-center justify-center bg-orange-500 text-white border-0"
                    variant={
                      content.status === 'ongoing' ? 'default' :
                      content.status === 'completed' ? 'secondary' :
                      'outline'
                    }
                  >
                    {content.status}
                  </Badge>

                  {/* Type Badge */}
                  <Badge 
                    variant="secondary"
                    className="absolute top-2 left-2 text-xs font-bold uppercase bg-gray-900/90 text-white border-0"
                  >
                    {content.type}
                  </Badge>

                  {/* Rating */}
                  {content.average_rating && content.average_rating > 0 && (
                    <div className="absolute bottom-2 left-2 flex items-center gap-1 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-sm border-0">
                      <Star className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                      <span className="text-white text-xs font-bold">
                        {content.average_rating.toFixed(1)}
                      </span>
                    </div>
                  )}

                  {/* Chapter Count */}
                  {content.chapter_count && content.chapter_count > 0 && (
                    <div className="absolute bottom-2 right-2 flex items-center justify-center">
                      <div className="flex px-1 py-0.5 rounded-full bg-orange-500/90 backdrop-blur-sm border-0">
                        <span className="text-white text-[10px] font-bold whitespace-nowrap px-1 py-1 ">
                          CH {content.chapter_count}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Content Info */}
                <CardContent className="p-4 bg-gradient-to-b from-card to-card/80">
                  <h3 className="font-bold text-sm mb-2 line-clamp-2 text-foreground group-hover:text-orange-500 transition-colors duration-300">
                    {content.title}
                  </h3>
                  
                  {content.author && (
                    <p className="text-xs text-muted-foreground mb-3">
                      {content.author}
                    </p>
                  )}
                  
                  {/* Genres */}
                  {content.genres && content.genres.length > 0 && (
                    <div className="flex flex-wrap gap-2 items-center">
                      {content.genres.slice(0, 2).map((genre: string, idx: number) => (
                        <Badge 
                          key={idx}
                          variant="outline"
                          className="text-xs px-2 py-1 whitespace-nowrap border-orange-500/50 text-foreground hover:bg-orange-500/10 transition-colors"
                        >
                          {genre}
                        </Badge>
                      ))}
                      {content.genres.length > 2 && (
                        <Badge variant="outline" className="text-xs px-2 py-1 whitespace-nowrap border-orange-500/50 text-foreground">
                          +{content.genres.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
              </Link>
            ))}
          </div>
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
