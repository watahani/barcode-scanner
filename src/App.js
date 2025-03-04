import React, { useState } from 'react';
import styled from 'styled-components';
import BarcodeScanner from './components/BarcodeScanner';
import BookList from './components/BookList';
import TabNavigation from './components/TabNavigation';
import { useBarcodeDetector } from './hooks/useBarcodeDetector';
import { useBookData } from './hooks/useBookData';

const AppContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 10px;
`;

const App = () => {
  const [activeTab, setActiveTab] = useState('unscanned');
  const { scannedBooks, unscannedBooks, markBookAsScanned } = useBookData();
  const { isBarcodeDetectorSupported } = useBarcodeDetector();

  const handleBarcodeDetected = (barcode) => {
    const matchedBook = unscannedBooks.find(book => 
      book.jan === barcode || 
      book.isbn.replace(/-/g, '') === barcode || 
      book.material_cd === barcode
    );
    
    if (matchedBook) {
      markBookAsScanned(matchedBook.id);
      return matchedBook;
    }
    
    return null;
  };

  return (
    <AppContainer>
      <Header>
        <Title>Barcode Scanner</Title>
      </Header>
      
      {!isBarcodeDetectorSupported && (
        <div style={{ color: 'red', textAlign: 'center', marginBottom: '20px' }}>
          BarcodeDetector API is not supported in your browser. Please use a modern browser like Chrome.
        </div>
      )}
      
      <BarcodeScanner onBarcodeDetected={handleBarcodeDetected} />
      
      <TabNavigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        unscannedCount={unscannedBooks.length}
      />
      
      <BookList 
        books={activeTab === 'scanned' ? scannedBooks : unscannedBooks} 
        type={activeTab}
      />
    </AppContainer>
  );
};

export default App;