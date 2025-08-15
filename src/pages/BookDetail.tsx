import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { getBookById } from '@/services/api';
import Loader from '@/components/ui/Loader';

const BookDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getBookById(id);
        setBook(data);
      } catch (err) {
        console.error('Failed to fetch book:', err);
        setError('Failed to load book details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBook();
    }
  }, [id]);

  const handleAddToCart = () => {
    addToCart(book);
    alert(`${book.title} added to cart!`);
  };

  if (loading) {
    return <Loader fullPage />;
  }

  if (error || !book) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
        <p className="text-gray-700 mb-6">{error || 'Book not found'}</p>
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3 p-4">
            <img
              src={book.image.startsWith('http') 
                ? book.image 
                : `http://localhost:5000/uploads/${book.image}`
              }
              alt={book.title}
              className="w-full h-auto object-cover rounded"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://placehold.co/400x600?text=No+Image+Available';
              }}
            />
          </div>
          
          <div className="md:w-2/3 p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
              <p className="text-lg text-gray-600 mb-2">by {book.author}</p>
              <div className="flex items-center mb-4">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                  {book.category}
                </span>
              </div>
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Description</h2>
              <p className="text-gray-700 whitespace-pre-line">{book.description}</p>
            </div>
            
            <div className="flex flex-wrap items-center justify-between mt-8">
              <div>
                <p className="text-2xl font-bold text-blue-600">${book.price.toFixed(2)}</p>
                <p className="text-gray-600 mt-1">
                  {book.stock > 0 
                    ? `${book.stock} in stock` 
                    : 'Out of stock'
                  }
                </p>
              </div>
              
              <div className="flex space-x-4 mt-4 md:mt-0">
                {isAdmin ? (
                  <button
                    onClick={() => navigate(`/admin/books/edit/${book._id}`)}
                    className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-2 rounded"
                  >
                    Edit Book
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleAddToCart}
                      disabled={book.stock <= 0}
                      className={`px-6 py-2 rounded ${
                        book.stock > 0
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {book.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                    <button
                      onClick={() => {
                        addToCart(book);
                        navigate('/cart');
                      }}
                      disabled={book.stock <= 0}
                      className={`px-6 py-2 rounded ${
                        book.stock > 0
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Buy Now
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
