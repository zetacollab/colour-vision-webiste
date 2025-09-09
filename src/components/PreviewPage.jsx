// import React, { useState } from "react";
// import { Document, Page, pdfjs } from "react-pdf";

// // Vite-friendly worker setup
// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   "pdfjs-dist/build/pdf.worker.min.js",
//   import.meta.url
// ).href;

// export default function PreviewPage() {
//   const [numPages, setNumPages] = useState(null);

//   const pdfUrl = localStorage.getItem("pdfUrl"); // ✅ read from localStorage

//   const onDocumentLoadSuccess = ({ numPages }) => {
//     setNumPages(numPages);
//   };

//   if (!pdfUrl) return <p>No PDF file selected</p>;

//   return (
//     <div style={{ width: "100%", textAlign: "center" }}>
//       <Document
//         file={pdfUrl}
//         onLoadSuccess={onDocumentLoadSuccess}
//         onLoadError={(err) => console.error("PDF load error:", err)}
//       >
//         {Array.from(new Array(numPages), (_, index) => (
//           <Page key={index} pageNumber={index + 1} width={600} />
//         ))}
//       </Document>
//     </div>
//   );
// }
import React from "react";

export default function PreviewPage() {
  const pdfUrl = localStorage.getItem("pdfUrl");

  if (!pdfUrl) return <p>No PDF file generated yet</p>;

  return (
    <div style={{ width: "100%", height: "100vh", textAlign: "center" }}>
      <iframe
        src={pdfUrl}
        width="100%"
        height="100%"
        style={{ border: "none" }}
        title="PDF Preview"
      />
    </div>
  );
}


