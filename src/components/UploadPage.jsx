
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import PalettePage from "./PalettePage"; // hidden render for PDF

// ✅ Correct image URLs (JPG)
const page01 = new URL("../assets/images/page_01.jpg", import.meta.url).href;
const page03 = new URL("../assets/images/page_03.jpg", import.meta.url).href;
const page04 = new URL("../assets/images/page_04.jpg", import.meta.url).href;
const page05 = new URL("../assets/images/page_05.jpg", import.meta.url).href;

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paletteData, setPaletteData] = useState(null); // hidden PalettePage render
  const hiddenRef = useRef();
  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!file) return alert("Please select an image first!");

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);

    try {
      // Send image to server
      const res = await fetch(
        "https://berger-paints-poc-1.onrender.com/process-image/",
        { method: "POST", body: formData }
      );

      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const json = await res.json();

      setPaletteData(json); // trigger hidden PalettePage render

      // Wait for hidden PalettePage to render
      setTimeout(async () => {
        if (!hiddenRef.current) throw new Error("Hidden PalettePage not rendered yet");

        // ✅ html2canvas with fix
        const canvas = await html2canvas(hiddenRef.current, { 
          useCORS: true, 
          backgroundColor: null, // preserves UI background
          scale: 2 // ensures sharpness
        });

        const paletteImg = canvas.toDataURL("image/png");

        const pdf = new jsPDF("p", "mm", "a4");
        const width = pdf.internal.pageSize.getWidth();
        const height = pdf.internal.pageSize.getHeight();

        // Helper to load images
        const loadImage = (src) =>
          new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "anonymous"; // allow CORS
            img.src = src;
            img.onload = () => resolve(img);
            img.onerror = reject;
          });

        // page 1
        const p1 = await loadImage(page01);
        pdf.addImage(p1, "JPEG", 0, 0, width, height);

        // palette page
        pdf.addPage();
        pdf.addImage(paletteImg, "PNG", 0, 0, width, height);

        // page 3
        const p3 = await loadImage(page03);
        pdf.addPage();
        pdf.addImage(p3, "JPEG", 0, 0, width, height);

        // page 4
        const p4 = await loadImage(page04);
        pdf.addPage();
        pdf.addImage(p4, "JPEG", 0, 0, width, height);

        // page 5
        const p5 = await loadImage(page05);
        pdf.addPage();
        pdf.addImage(p5, "JPEG", 0, 0, width, height);

        // Save PDF blob URL
        const pdfBlob = pdf.output("blob");
        const pdfUrl = URL.createObjectURL(pdfBlob);
        localStorage.setItem("pdfUrl", pdfUrl);

        navigate("/preview"); // go to preview page
      }, 500); // slight delay for hidden render
    } catch (err) {
      console.error("Upload failed:", err);
      alert("❌ Upload failed! Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="pageWrapper">
      <div id="mainBox">
        <div className="hero-text">
          <h1>Upload Your Image</h1>
          <p>Select a photo and extract its colour palette</p>
        </div>

        <div className="hero-section">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button onClick={handleUpload} disabled={loading}>
            {loading ? "Processing…" : "Submit"}
          </button>
        </div>

        <div id="infoBox">
          <p id="infoText">
            ℹ️ Upload a clear image to get the most accurate palette results.
          </p>
        </div>
      </div>

      {/* Hidden PalettePage for PDF generation */}
      {paletteData && (
        <div style={{ position: "absolute", top: "-9999px", left: "-9999px" }}>
          <div ref={hiddenRef}>
            <PalettePage data={paletteData} />
          </div>
        </div>
      )}
    </div>
  );
}
