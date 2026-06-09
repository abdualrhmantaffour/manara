'use client';
import { useRouter } from 'next/navigation';
import { useState, FormEvent } from 'react';

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full">
      <input
        type="text"
        placeholder="ابحث عن مادة أو درس..."
        className="w-full py-2 px-4 rounded-full text-gray-800 focus:outline-none"
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <button type="submit" className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500">
        🔍
      </button>
    </form>
  );
}