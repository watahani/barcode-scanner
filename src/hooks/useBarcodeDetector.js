import { useState, useEffect } from 'react';

export const useBarcodeDetector = () => {
  const [isBarcodeDetectorSupported, setIsBarcodeDetectorSupported] = useState(false);
  const [barcodeDetector, setBarcodeDetector] = useState(null);

  useEffect(() => {
    const checkBarcodeDetectorSupport = async () => {
      // Check if BarcodeDetector is supported
      if ('BarcodeDetector' in window) {
        try {
          // Check if the required formats are supported
          const formats = await window.BarcodeDetector.getSupportedFormats();
          const requiredFormats = [
            'ean_13', 'ean_8', 'upc_a', 'upc_e', 
            'code_39', 'code_128', 'itf', 'codabar', 'code_93'
          ];
          
          // Check if at least some of the required formats are supported
          const hasRequiredFormats = requiredFormats.some(format => formats.includes(format));
          
          if (hasRequiredFormats) {
            setIsBarcodeDetectorSupported(true);
            
            // Create a BarcodeDetector instance with all supported formats
            const detector = new window.BarcodeDetector({
              formats: formats.filter(format => requiredFormats.includes(format))
            });
            
            setBarcodeDetector(detector);
          } else {
            console.warn('Required barcode formats are not supported');
          }
        } catch (error) {
          console.error('Error initializing BarcodeDetector:', error);
        }
      } else {
        console.warn('BarcodeDetector API is not supported in this browser');
      }
    };

    checkBarcodeDetectorSupport();
  }, []);

  const detectBarcodes = async (videoElement) => {
    if (!barcodeDetector || !videoElement) {
      return [];
    }

    try {
      return await barcodeDetector.detect(videoElement);
    } catch (error) {
      console.error('Error detecting barcodes:', error);
      return [];
    }
  };

  return {
    isBarcodeDetectorSupported,
    detectBarcodes
  };
};