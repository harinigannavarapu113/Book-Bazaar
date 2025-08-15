import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getBooks, deleteBook } from '@/services/api';
import { BookOpen, Edit, Trash2, Plus, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Loader from '@/components/ui/Loader';
import { toast } from 'sonner';

const AdminBooksList = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredBooks(books);
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredBooks(
        books.filter((book: any) => 
          book.title.toLowerCase().includes(term) || 
          book.author.toLowerCase().includes(term) ||
          book.category.toLowerCase().includes(term)
        )
      );
    }
  }, [searchTerm, books]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getBooks();
      setBooks(data);
      setFilteredBooks(data);
    } catch (err: any) {
      console.error('Failed to fetch books:', err);
      setError(err.message || 'Failed to load books. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBook = async (id: string) => {
    try {
      await deleteBook(id);
      setBooks(books.filter((book: any) => book._id !== id));
      toast.success('Book deleted successfully!');
    } catch (err: any) {
      console.error('Failed to delete book:', err);
      toast.error(err.message || 'Failed to delete book. Please try again.');
    }
  };

  return (
    <div className="flex-1 p-6 md:p-8 overflow-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">Books Management</h1>
        
        <Button onClick={() => navigate('/admin/books/add')}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Book
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by title, author or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full max-w-md"
            />
          </div>
        </div>
        
        {loading ? (
          <div className="p-8 text-center">
            <Loader />
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-red-500">{error}</p>
            <Button variant="outline" onClick={fetchBooks} className="mt-4">
              Try Again
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-center">Stock</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBooks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      {books.length === 0 ? (
                        <>
                          <p className="text-gray-500 mb-2">No books available.</p>
                          <Button variant="outline" asChild>
                            <Link to="/admin/books/add">
                              <Plus className="mr-2 h-4 w-4" />
                              Add your first book
                            </Link>
                          </Button>
                        </>
                      ) : (
                        <p className="text-gray-500">No books match your search criteria.</p>
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBooks.map((book: any) => (
                    <TableRow key={book._id}>
                      <TableCell>
                        <img
                          src={book.image.startsWith('http') 
                            ? book.image 
                            : `http://localhost:5000/uploads/${book.image}`
                          }
                          alt={book.title}
                          className="w-12 h-16 object-cover rounded"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://placehold.co/60x80?text=No+Image';
                          }}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{book.title}</TableCell>
                      <TableCell>{book.author}</TableCell>
                      <TableCell>
                        <span className="inline-block px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                          {book.category}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">${book.price.toFixed(2)}</TableCell>
                      <TableCell className="text-center">
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                          book.stock === 0 ? 'bg-red-100 text-red-800' :
                          book.stock < 5 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {book.stock}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="icon" asChild>
                            <Link to={`/books/${book._id}`}>
                              <BookOpen className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" asChild>
                            <Link to={`/admin/books/edit/${book._id}`}>
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Link>
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-red-600">
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete "{book.title}" and cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDeleteBook(book._id)}
                                  className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBooksList;
