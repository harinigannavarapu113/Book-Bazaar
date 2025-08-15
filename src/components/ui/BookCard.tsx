import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Eye } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';

interface Book {
  _id: string;
  title: string;
  author: string;
  price: number;
  image: string;
  category: string;
  stock: number;
}

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(book);
    toast.success(`Added to cart: ${book.title}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:scale-[1.02]">
      <Link to={`/books/${book._id}`} className="block relative aspect-[3/4] overflow-hidden">
        <img
          src={book.image.startsWith('http') 
            ? book.image 
            : `http://localhost:5000/uploads/${book.image}`}
          alt={book.title}
          className="w-full h-full object-cover transition-all duration-300 hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://placehold.co/300x400?text=No+Image';
          }}
        />
        <div className="absolute top-2 right-2">
          <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
            {book.category}
          </span>
        </div>
      </Link>
      
      <div className="p-4">
        <Link to={`/books/${book._id}`}>
          <h3 className="text-lg font-medium text-gray-900 mb-1 line-clamp-1">{book.title}</h3>
        </Link>
        <p className="text-sm text-gray-500 mb-2">{book.author}</p>
        
        <div className="flex justify-between items-center mt-3">
          <span className="text-blue-600 font-bold">${book.price.toFixed(2)}</span>
          
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              variant="outline"
              asChild
            >
              <Link to={`/books/${book._id}`}>
                <Eye className="h-4 w-4 mr-1" />
                View
              </Link>
            </Button>
            
            <Button 
              size="sm"
              onClick={handleAddToCart}
              disabled={book.stock <= 0}
              className={book.stock <= 0 ? 'opacity-50 cursor-not-allowed' : ''}
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              {book.stock > 0 ? 'Add' : 'Out of Stock'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
