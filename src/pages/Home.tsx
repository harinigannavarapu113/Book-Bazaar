
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BookCard from '@/components/ui/BookCard';
import { BookSkeletonGrid } from '@/components/ui/BookSkeleton';
import { getBooks, getCategories } from '@/services/api';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight, BookOpen, Store, UserPlus } from 'lucide-react';

const Home = () => {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch books
        const booksData = await getBooks();
        
        // Sort by creation date (newest first)
        const sortedBooks = [...booksData].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
        // Get featured books (first 8)
        setFeaturedBooks(sortedBooks.slice(0, 8));
        
        // Get new arrivals (newest 4)
        setNewArrivals(sortedBooks.slice(0, 4));
        
        // Fetch categories
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to fetch homepage data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const filterBooksByCategory = (category) => {
    if (category === 'all') {
      return featuredBooks;
    }
    return featuredBooks.filter(book => book.category === category);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Discover Your Next Favorite Book
            </h1>
            <p className="text-xl mb-8">
              Explore our vast collection of books across different genres at competitive prices
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-gray-100">
                <Link to="/books">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Browse Books
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white bg-blue-600">
                <Link to="/register-seller">
                  <Store className="mr-2 h-5 w-5" />
                  Sell Your Books
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Featured Books</h2>
            <Link to="/books" className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium">
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
            <div className="mb-6 overflow-x-auto">
              <TabsList className="inline-flex h-10 w-auto">
                <TabsTrigger value="all">All</TabsTrigger>
                {categories.slice(0, 6).map((category) => (
                  <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
                ))}
              </TabsList>
            </div>
            
            <TabsContent value={activeCategory}>
              {loading ? (
                <BookSkeletonGrid count={8} />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filterBooksByCategory(activeCategory).map((book) => (
                    <BookCard key={book._id} book={book} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      {/* Seller CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Become a Seller Today</h2>
            <p className="text-xl text-gray-300 mb-8">
              Start selling your books on our platform and reach thousands of customers
            </p>
            <Button asChild size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
              <Link to="/register-seller">
                <Store className="mr-2 h-5 w-5" />
                Register as Seller
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* New Arrivals */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">New Arrivals</h2>
            <Link to="/books" className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium">
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          {loading ? (
            <BookSkeletonGrid count={4} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {newArrivals.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Customer CTA */}
      <section className="py-12 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Join Our Community</h2>
              <p className="text-gray-600">
                Create an account to get personalized recommendations, track orders, and more
              </p>
            </div>
            <div className="flex space-x-4">
              <Button asChild variant="outline">
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link to="/register">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create Account
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
