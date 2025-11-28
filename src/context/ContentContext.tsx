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
  
  // Cache
  cachedContents: CachedData;
  
  // Actions
  setActiveTab: (tab: string) => void;
  setSearchQuery: (query: string) => void;
  loadContents: (tab: string, search: string) => Promise<void>;
  getCachedKey: (tab: string, search: string) => string;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cachedContents, setCachedContents] = useState<CachedData>({});

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
    try {
      console.log(`🔍 [ContentContext] Loading contents: tab=${tab}, search=${search}`);
      const response = await fetchContents({
        contentType: tab,
        search: search,
        limit: 50
      });
      const data = response.data || [];
      
      console.log(`✅ [ContentContext] Loaded ${data.length} items, caching...`);
      
      // Store in cache
      setCachedContents(prev => ({
        ...prev,
        [cacheKey]: data
      }));
      
      setContents(data);
    } catch (error: any) {
      console.error(`❌ [ContentContext] Error loading contents:`, error);
      setContents([]);
    } finally {
      setLoading(false);
    }
  }, [cachedContents, getCachedKey]);

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
    setActiveTab: handleSetActiveTab,
    setSearchQuery: handleSetSearchQuery,
    loadContents,
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
