import React, { useState, useEffect } from 'react';
import { getCategories } from '@/services/api';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, RefreshCw } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BookFilterProps {
  onFilterChange: (filters: {
    category: string;
    minPrice: string;
    maxPrice: string;
    search: string;
  }) => void;
}

const BookFilter: React.FC<BookFilterProps> = ({ onFilterChange }) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({
      category,
      minPrice,
      maxPrice,
      search,
    });
  };

  const handleReset = () => {
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
    setSearch('');
    onFilterChange({
      category: '',
      minPrice: '',
      maxPrice: '',
      search: '',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Filter Books</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="minPrice">Min Price ($)</Label>
            <Input
              id="minPrice"
              type="number"
              placeholder="Min"
              min="0"
              step="0.01"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="maxPrice">Max Price ($)</Label>
            <Input
              id="maxPrice"
              type="number"
              placeholder="Max"
              min="0"
              step="0.01"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <div className="relative">
              <Input
                id="search"
                type="text"
                placeholder="Title or Author"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pr-10"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
        
        <div className="flex mt-6 space-x-4">
          <Button type="submit" className="flex-1 md:flex-none">
            Apply Filters
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            className="flex-1 md:flex-none"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset Filters
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BookFilter;
