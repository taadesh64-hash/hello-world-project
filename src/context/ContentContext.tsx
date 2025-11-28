'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Content, fetchContents } from '@/lib/api';

interface CachedData {
  [key: string]: Content[];
}

interface ContentContextType {
  // State
  contents: Content[];
  loading: boolean;
  activeTab: string;
  searchQuery: string;
  hasMore: boolean;
  
  // Cache
  cachedContents: CachedData;
  
  // Actions
  setActiveTab: (tab: string) => void;
  setSearchQuery: (query: string) => void;
  loadContents: (tab: string, search: string) => Promise<void>;
  loadMoreContents: () => Promise<void>;
  getCachedKey: (tab: string, search: string) => string;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cachedContents, setCachedContents] = useState<CachedData>({});
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);

  const getCachedKey = useCallback((tab: string, search: string): string => {
    return `${tab}::${search}`;
  }, []);

  const loadContents = useCallback(async (tab: string, search: string) => {
    const cacheKey = getCachedKey(tab, search);

    // Check if data is already cached
    if (cachedContents[cacheKey]) {
      console.log(`📦 [ContentContext] Using cached data for key: ${cacheKey}`);
      setContents(cachedContents[cacheKey]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setOffset(0);
    try {
      console.log(`🔍 [ContentContext] Loading contents: tab=${tab}, search=${search}`);
      const response = await fetchContents({
        contentType: tab,
        search: search,
        limit: 24,
        offset: 0
      });
      const data = response.data || [];
      
      console.log(`✅ [ContentContext] Loaded ${data.length} items, hasMore=${response.hasMore}`);
      
      // Store in cache
      setCachedContents(prev => ({
        ...prev,
        [cacheKey]: data
      }));
      
      setContents(data);
      setHasMore(response.hasMore || false);
      setOffset(data.length);
    } catch (error: any) {
      console.error(`❌ [ContentContext] Error loading contents:`, error);
      setContents([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [cachedContents, getCachedKey]);

  const loadMoreContents = useCallback(async () => {
    if (!hasMore || loading) return;

    setLoading(true);
    try {
      console.log(`🔍 [ContentContext] Loading more contents: tab=${activeTab}, search=${searchQuery}, offset=${offset}`);
      const response = await fetchContents({
        contentType: activeTab,
        search: searchQuery,
        limit: 24,
        offset: offset
      });
      const data = response.data || [];
      
      console.log(`✅ [ContentContext] Loaded ${data.length} more items, hasMore=${response.hasMore}`);
      
      setContents(prev => [...prev, ...data]);
      setHasMore(response.hasMore || false);
      setOffset(prev => prev + data.length);
    } catch (error: any) {
      console.error(`❌ [ContentContext] Error loading more contents:`, error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [activeTab, searchQuery, offset, hasMore, loading]);

  const handleSetActiveTab = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  const handleSetSearchQuery = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const value: ContentContextType = {
    contents,
    loading,
    activeTab,
    searchQuery,
    cachedContents,
    hasMore,
    setActiveTab: handleSetActiveTab,
    setSearchQuery: handleSetSearchQuery,
    loadContents,
    loadMoreContents,
    getCachedKey,
  };

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContentContext = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContentContext must be used within ContentProvider');
  }
  return context;
};
