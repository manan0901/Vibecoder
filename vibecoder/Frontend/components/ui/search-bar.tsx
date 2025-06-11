'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, TrendingUp } from 'lucide-react';
import { Button } from './button';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  showTrendingKeywords?: boolean;
  className?: string;
}

export function SearchBar({ 
  onSearch, 
  placeholder = "Search for projects, templates, APIs...",
  showTrendingKeywords = true,
  className = ""
}: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const trendingKeywords = [
    'React Dashboard', 'Next.js SaaS', 'Node.js API', 'Mobile App',
    'AI Integration', 'E-commerce', 'Portfolio', 'Admin Panel'
  ];

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearch?.(searchQuery.trim());
      // Default behavior - redirect to search page
      window.location.href = `/projects?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleTrendingClick = (keyword: string) => {
    setSearchQuery(keyword);
    onSearch?.(keyword);
    window.location.href = `/projects?search=${encodeURIComponent(keyword)}`;
  };

  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      {/* Main Search Bar */}
      <motion.div
        className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="flex items-center gap-4">
          <div className="flex-1 flex items-center gap-3 px-4">
            <Search className="h-6 w-6 text-gray-400" />
            <input
              type="text"
              placeholder={placeholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsExpanded(true)}
              onBlur={() => setTimeout(() => setIsExpanded(false), 200)}
              className="flex-1 bg-transparent text-lg placeholder-gray-500 focus:outline-none"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-vibecoder-600"
            >
              <Filter className="h-5 w-5" />
            </Button>
            <Button
              variant="vibecoder"
              size="lg"
              onClick={handleSearch}
              className="px-8"
            >
              Search
            </Button>
          </div>
        </div>

        {/* Search Suggestions Dropdown */}
        {isExpanded && searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-50"
          >
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-2">Search suggestions</p>
              <div className="space-y-2">
                {trendingKeywords
                  .filter(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()))
                  .slice(0, 3)
                  .map((keyword, index) => (
                    <button
                      key={index}
                      onClick={() => handleTrendingClick(keyword)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Search className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-700">{keyword}</span>
                    </button>
                  ))}
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Trending Keywords */}
      {showTrendingKeywords && (
        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <TrendingUp className="h-4 w-4 text-vibecoder-600" />
            <span className="text-sm font-medium text-gray-600">Trending Searches</span>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {trendingKeywords.map((keyword, index) => (
              <motion.button
                key={keyword}
                onClick={() => handleTrendingClick(keyword)}
                className="px-4 py-2 bg-white/60 backdrop-blur-sm border border-white/40 rounded-full text-sm font-medium text-gray-700 hover:bg-vibecoder-50 hover:text-vibecoder-700 hover:border-vibecoder-200 transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
              >
                {keyword}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
