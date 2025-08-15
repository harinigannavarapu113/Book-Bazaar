import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createBook, getBookById, updateBook, getCategories } from '@/services/api';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Image, Link, Save, ArrowLeft } from 'lucide-react';
import Loader from '@/components/ui/Loader';
import { toast } from 'sonner';

const BookForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [imageTab, setImageTab] = useState('upload');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [currentImage, setCurrentImage] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [customCategory, setCustomCategory] = useState('');
  const [isCustomCategoryMode, setIsCustomCategoryMode] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err: any) {
        console.error('Failed to fetch categories:', err);
        toast.error('Failed to load categories. Please refresh the page.');
      }
    };
    
    fetchCategories();
    
    if (isEditMode) {
      const fetchBook = async () => {
        try {
          setInitialLoading(true);
          const book = await getBookById(id);
          
          setTitle(book.title);
          setAuthor(book.author);
          setPrice(book.price.toString());
          setStock(book.stock.toString());
          setDescription(book.description);
          setCategory(book.category);
          
          if (book.image.startsWith('http')) {
            setImageTab('url');
            setImageUrl(book.image);
          } else {
            setImageTab('upload');
            setCurrentImage(book.image);
          }
        } catch (err: any) {
          console.error('Failed to fetch book:', err);
          setError(err.message || 'Failed to load book details. Please try again.');
        } finally {
          setInitialLoading(false);
        }
      };
      
      fetchBook();
    }
  }, [id, isEditMode]);
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      const selectedCategory = isCustomCategoryMode ? customCategory : category;
      
      const formData = new FormData();
      formData.append('title', title);
      formData.append('author', author);
      formData.append('price', price);
      formData.append('stock', stock);
      formData.append('description', description);
      formData.append('category', selectedCategory);
      
      if (imageTab === 'upload' && imageFile) {
        formData.append('image', imageFile);
      } else if (imageTab === 'url') {
        formData.append('imageUrl', imageUrl);
      }
      
      let response;
      if (isEditMode) {
        response = await updateBook(id, formData);
        toast.success('Book updated successfully!');
      } else {
        response = await createBook(formData);
        toast.success('Book created successfully!');
      }
      
      navigate('/admin/books');
    } catch (err: any) {
      console.error('Form submission error:', err);
      setError(err.message || 'Failed to save book. Please check your inputs and try again.');
      toast.error('Error saving book. Please check the form and try again.');
    } finally {
      setLoading(false);
    }
  };
  
  if (initialLoading) {
    return (
      <div className="flex">
        <div className="flex-1 p-8">
          <Loader message="Loading book data..." />
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex">
      
      <div className="flex-1 p-6 md:p-8 overflow-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/admin/books')}
              className="mb-2 pl-0"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Books
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditMode ? 'Edit Book' : 'Add New Book'}
            </h1>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Book Title"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Author Name"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="stock">Stock</Label>
                    <Input
                      id="stock"
                      type="number"
                      min="0"
                      step="1"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      placeholder="0"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="category">Category</Label>
                  {isCustomCategoryMode ? (
                    <div className="flex space-x-2">
                      <Input
                        id="customCategory"
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        placeholder="New Category"
                        required
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsCustomCategoryMode(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <Select value={category} onValueChange={setCategory} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setIsCustomCategoryMode(true);
                          setCustomCategory('');
                        }}
                      >
                        Add New
                      </Button>
                    </div>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Book description..."
                    rows={6}
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label>Book Cover Image</Label>
                <Tabs defaultValue={imageTab} value={imageTab} onValueChange={setImageTab} className="mt-2">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="upload">
                      <Image className="mr-2 h-4 w-4" />
                      Upload Image
                    </TabsTrigger>
                    <TabsTrigger value="url">
                      <Link className="mr-2 h-4 w-4" />
                      Image URL
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="upload" className="pt-4">
                    <div className="border rounded-md p-4">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="mb-4"
                      />
                      
                      <div className="text-sm text-gray-500 mb-4">
                        {!isEditMode && !imageFile ? (
                          <p>No image selected. JPG, PNG or GIF only (max 5MB).</p>
                        ) : (
                          <p>
                            {imageFile 
                              ? `Selected file: ${imageFile.name}`
                              : 'Upload a new image or keep the existing one.'}
                          </p>
                        )}
                      </div>
                      
                      {/* Image Preview */}
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">Preview:</h4>
                        <div className="border rounded-md p-2 flex items-center justify-center bg-gray-50 h-64">
                          {imageFile ? (
                            <img
                              src={URL.createObjectURL(imageFile)}
                              alt="Preview"
                              className="max-h-full max-w-full object-contain"
                            />
                          ) : currentImage ? (
                            <img
                              src={`http://localhost:5000/uploads/${currentImage}`}
                              alt="Current"
                              className="max-h-full max-w-full object-contain"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://placehold.co/400x600?text=No+Image+Available';
                              }}
                            />
                          ) : (
                            <div className="text-gray-400 flex flex-col items-center">
                              <Image className="h-16 w-16 mb-2" />
                              <span>No image selected</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="url" className="pt-4">
                    <div className="border rounded-md p-4">
                      <Label htmlFor="imageUrl">Image URL</Label>
                      <Input
                        id="imageUrl"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://example.com/book-cover.jpg"
                        className="mb-4"
                      />
                      
                      <div className="text-sm text-gray-500 mb-4">
                        <p>Enter a direct URL to an image (JPG, PNG or GIF).</p>
                      </div>
                      
                      {/* URL Image Preview */}
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">Preview:</h4>
                        <div className="border rounded-md p-2 flex items-center justify-center bg-gray-50 h-64">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt="Preview"
                              className="max-h-full max-w-full object-contain"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://placehold.co/400x600?text=Invalid+URL';
                              }}
                            />
                          ) : (
                            <div className="text-gray-400 flex flex-col items-center">
                              <Link className="h-16 w-16 mb-2" />
                              <span>No URL entered</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end">
              <Button variant="outline" type="button" onClick={() => navigate('/admin/books')} className="mr-2">
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" />
                {isEditMode ? 'Update Book' : 'Save Book'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookForm;
