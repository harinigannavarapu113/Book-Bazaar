
import React, { useState, useEffect } from 'react';
import BookCard from '@/components/ui/BookCard';
import BookFilter from '@/components/ui/BookFilter';
import { BookSkeletonGrid } from '@/components/ui/BookSkeleton';
import { getBooks } from '@/services/api';

interface FilterState {
  category: string;
  minPrice: string;
  maxPrice: string;
  search: string;
}

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    category: '',
    minPrice: '',
    maxPrice: '',
    search: ''
  });

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const data = await getBooks();
        setBooks(data);
        setFilteredBooks(data);
      } catch (error) {
        console.error('Failed to fetch books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const applyFilters = (currentFilters: FilterState) => {
    let result = [...books];

    // Apply category filter - updated to handle 'all' value
    if (currentFilters.category && currentFilters.category !== 'all') {
      result = result.filter(book => book.category === currentFilters.category);
    }

    // Apply price filters
    if (currentFilters.minPrice) {
      result = result.filter(book => book.price >= parseFloat(currentFilters.minPrice));
    }

    if (currentFilters.maxPrice) {
      result = result.filter(book => book.price <= parseFloat(currentFilters.maxPrice));
    }

    // Apply search filter
    if (currentFilters.search) {
      const searchLower = currentFilters.search.toLowerCase();
      result = result.filter(
        book =>
          book.title.toLowerCase().includes(searchLower) ||
          book.author.toLowerCase().includes(searchLower)
      );
    }

    setFilteredBooks(result);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">All Books</h1>
      
      <BookFilter onFilterChange={handleFilterChange} />
      
      {loading ? (
        <BookSkeletonGrid count={8} />
      ) : (
        <>
          <p className="mb-4 text-gray-600">{filteredBooks.length} books found</p>
          
          {filteredBooks.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-gray-800 mb-2">No books found</h3>
              <p className="text-gray-600">
                Try adjusting your filters or search criteria
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredBooks.map(book => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BookList;
