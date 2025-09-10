
import React, { useEffect } from "react";

export default function PreviewPage() {
  const pdfUrl = localStorage.getItem("pdfUrl");

  useEffect(() => {
    if (pdfUrl) {
      window.open(pdfUrl, "_blank"); // open PDF in new tab
    }
  }, [pdfUrl]);

  if (!pdfUrl) return <p>No PDF file generated yet</p>;

  return <p>Opening PDF in a new tab...</p>;
}









