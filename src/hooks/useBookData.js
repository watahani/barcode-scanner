import { useState, useEffect } from 'react';

export const useBookData = () => {
  const [books, setBooks] = useState([]);
  const [scannedBooks, setScannedBooks] = useState([]);
  const [unscannedBooks, setUnscannedBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/all_books.json');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch books: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Add a scanned property to each book (default to false)
        const booksWithScannedStatus = data.map(book => ({
          ...book,
          scanned: false
        }));
        
        setBooks(booksWithScannedStatus);
        setUnscannedBooks(booksWithScannedStatus);
        setScannedBooks([]);
      } catch (err) {
        console.error('Error fetching books:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const markBookAsScanned = (bookId) => {
    setBooks(prevBooks => 
      prevBooks.map(book => 
        book.id === bookId ? { ...book, scanned: true } : book
      )
    );
    
    // Update scanned and unscanned lists
    const bookToMove = unscannedBooks.find(book => book.id === bookId);
    
    if (bookToMove) {
      const updatedBook = { ...bookToMove, scanned: true };
      
      setUnscannedBooks(prevUnscanned => 
        prevUnscanned.filter(book => book.id !== bookId)
      );
      
      setScannedBooks(prevScanned => [...prevScanned, updatedBook]);
    }
  };

  return {
    books,
    scannedBooks,
    unscannedBooks,
    isLoading,
    error,
    markBookAsScanned
  };
};