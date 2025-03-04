# Barcode scanner app

Prompt:

```
You are front-end engineer and specialist of React and web design. Please create barcode reader app with React SPA (server less). 

**Functional Requirements:**

1.  **Barcode Scanning:**
    *   The application should use the device's camera (preferably the environment-facing camera) to scan barcodes.
    *   It should utilize the BarcodeDetector API for barcode detection.
    *   It should support the following barcode formats: EAN-13, EAN-8, UPC-A, UPC-E, Code 39, Code 128, ITF, Codabar, Code 93.
    *   Scanning should be initiated and stopped by a button.
    *   A visual indicator (e.g., a highlighted frame) should show when scanning is active.
    *   A scan area should be displayed on top of the video feed.

2.  **Book Matching:**
    *   The application should load a list of books from all_books.json.
    *   Upon successful barcode detection, the application should attempt to match the scanned barcode with a book in the list.
    *   Matching should be performed against the jan, isbn (without hyphens), and material_cd fields of each book.

3.  **Book List Management:**
    *   The application should maintain two lists of books: "Scanned" and "Unscanned".
    *   When a book is successfully scanned, it should be moved from the "Unscanned" list to the "Scanned" list.
    *   The number of "Unscanned" books should be displayed and updated dynamically.
    *   If the number of unscanned books is 5 or less, the count should have a visual indicator (pulsing animation).

4.  **User Feedback:**
    *   Upon successful scan:
        *   A success sound should be played.
        *   A visual indicator (e.g., a thumbs-up icon) should be displayed briefly.
        *   The camera feed should be briefly highlighted in green.
    *   Log messages should be displayed to the user, showing scanned barcodes and matched book titles.

5. **Tabbed Interface**:
    * The UI should have two tabs: "Scanned" and "Unscanned"
    * Clicking on a tab should display the corresponding list of books.

**Non-Functional Requirements:**

1.  **Performance:** Barcode detection and UI updates should be fast and responsive.
2.  **Usability:** The UI should be intuitive and easy to use.
3.  **Accessibility:** The application should be accessible to users with disabilities (consider ARIA attributes, keyboard navigation, etc.).
4.  **Maintainability:** The code should be well-structured, readable, and easy to maintain.
5. **Modern UI**: The application should be refactored using React, and modern UI.

**Other notes**

1. book data can be get from all_books.json in web root. You can find sample json in /public folder.
2. all_books.json contains an array of book objects. Each book object has the following relevant fields:

*   title: The title of the book.
*   jan: The JAN code (Japanese Article Number) of the book.
*   isbn: The ISBN (International Standard Book Number) of the book.
*   material_cd: A material code for the book.
*   scanned: This field doesn't exist in the JSON data, it is added dynamically by mainScript.js.

3. BarcodeDetector can be only use in service worker.

**Development steps**

​As the initial development step, we will create a TypeScript template application using create-react-app. After confirming that it runs correctly, we will proceed to develop the application to meet the aforementioned requirements.
```
