import { useQuery } from '@tanstack/react-query';
import { breakingNewsApi } from '../../lib/api';
import { useState, useEffect } from 'react';

interface BreakingNewsItem {
  id: string;
  title: string;
  url: string;
  priority: number;
  isActive: boolean;
  expiresAt?: string;
}

export default function BreakingNewsBanner() {
  const { data: news } = useQuery({
    queryKey: ['breaking-news'],
    queryFn: breakingNewsApi.getActive,
    refetchInterval: 30000, // تحديث كل 30 ثانية
  });

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!news || news.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % news.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [news]);

  if (!news || news.length === 0) return null;

  const currentNews = news[currentIndex];

  return (
    <div className="bg-red-600 text-white py-2 px-4 flex items-center justify-between animate-pulse">
      <div className="flex items-center gap-3">
        <span className="bg-white text-red-600 px-3 py-1 rounded font-bold text-sm">
          عاجل
        </span>
        <a
          href={currentNews.url}
          className="hover:underline font-medium"
          target="_blank"
          rel="noopener noreferrer"
        >
          {currentNews.title}
        </a>
      </div>
      {news.length > 1 && (
        <div className="flex gap-1">
          {news.map((_: any, index: number) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full ${
                index === currentIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
