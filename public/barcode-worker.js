// This is a service worker that will handle barcode detection
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('message', async (event) => {
  if (event.data.type === 'DETECT_BARCODE' && event.data.imageData) {
    try {
      // Check if BarcodeDetector is supported
      if ('BarcodeDetector' in self) {
        const formats = await self.BarcodeDetector.getSupportedFormats();
        const supportedFormats = [
          'ean_13', 'ean_8', 'upc_a', 'upc_e', 
          'code_39', 'code_128', 'itf', 'codabar', 'code_93'
        ].filter(format => formats.includes(format));
        
        if (supportedFormats.length > 0) {
          const barcodeDetector = new self.BarcodeDetector({ formats: supportedFormats });
          const barcodes = await barcodeDetector.detect(event.data.imageData);
          
          // Send the detected barcodes back to the main thread
          event.source.postMessage({
            type: 'BARCODE_DETECTED',
            barcodes: barcodes
          });
          return;
        }
      }
      
      // If BarcodeDetector is not supported or no supported formats
      event.source.postMessage({
        type: 'BARCODE_ERROR',
        error: 'BarcodeDetector not supported in this worker'
      });
    } catch (error) {
      event.source.postMessage({
        type: 'BARCODE_ERROR',
        error: error.message
      });
    }
  }
});