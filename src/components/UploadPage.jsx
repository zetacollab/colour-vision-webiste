import React, { useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import PalettePage from "./PalettePage";
import styles from "./UploadPage.module.css";

const page01 = new URL("../assets/images/page_01.jpg", import.meta.url).href;
const page03 = new URL("../assets/images/page_03.jpg", import.meta.url).href;
const page04 = new URL("../assets/images/page_04.jpg", import.meta.url).href;
const page05 = new URL("../assets/images/page_05.jpg", import.meta.url).href;

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paletteData, setPaletteData] = useState(null);
  const hiddenRef = useRef();

  const handleUpload = async () => {
    if (!file) return alert("Please select an image first!");

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);

    try {
      console.log("Uploading file:", file);

      const res = await fetch(
        "https://berger-paints-poc-1.onrender.com/process-image/",
        { method: "POST", body: formData }
      );

      if (!res.ok) {
        const text = await res.text();
        console.error("Server returned error:", res.status, text);
        throw new Error(`Server returned ${res.status}`);
      }

      const json = await res.json();
      console.log("JSON received from server:", json);

      setPaletteData(json);

      // Wait for PalettePage to render
      await new Promise((resolve) => setTimeout(resolve, 300));

      if (!hiddenRef.current)
        throw new Error("Hidden PalettePage not rendered yet");

      const canvas = await html2canvas(hiddenRef.current, {
        useCORS: true,
        backgroundColor: null,
        scale: 5,
      });

      const paletteImg = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidthMM = pdf.internal.pageSize.getWidth();
      const pdfHeightMM = pdf.internal.pageSize.getHeight();

      const loadImage = (src) =>
        new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.src = src;
          img.onload = () => resolve(img);
          img.onerror = reject;
        });

      const p1 = await loadImage(page01);
      pdf.addImage(p1, "JPEG", 0, 0, pdfWidthMM, pdfHeightMM);

      pdf.addPage();
      pdf.addImage(paletteImg, "PNG", 0, 0, pdfWidthMM, pdfHeightMM);

      const pages = [page03, page04, page05];
      for (const src of pages) {
        const img = await loadImage(src);
        pdf.addPage();
        pdf.addImage(img, "JPEG", 0, 0, pdfWidthMM, pdfHeightMM);
      }

      const pdfBlob = pdf.output("blob");
      const pdfUrl = URL.createObjectURL(pdfBlob);
      localStorage.setItem("pdfUrl", pdfUrl);

      // Open PDF only once process is fully done
      window.open(pdfUrl, "_blank");

      // Clear file after successful processing
      setFile(null);
    } catch (err) {
      console.error("Upload failed:", err);
      alert(`❌ Upload failed! See console for details.`);
    } finally {
      setLoading(false); // only reset once everything (including PDF opening) is done
    }
  };

  return (
    <div className={styles.mainBox}>
      <div className={styles.heroText}>
        <h1>Upload Your Image</h1>
        <p>Select a photo and extract its colour palette</p>
      </div>

      <div className={styles.heroSection}>
        <div className={styles.fileInputWrapper}>
          <input
            type="file"
            id="fileUpload"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            disabled={loading}
          />
          <label
            htmlFor="fileUpload"
            className={`${styles.fileLabel} ${
              loading ? styles.disabledLabel : ""
            }`}
          >
            Choose File
          </label>

          <span className={styles.fileName}>
            {file ? file.name : "No file chosen"}
          </span>
        </div>
        <button onClick={handleUpload} disabled={loading}>
          {loading ? "Processing…" : "Submit"}
        </button>
      </div>

      <div className={styles.infoBox}>
        <p className={styles.infoText}>
          ℹ️ Upload a clear image to get the most accurate palette results.
        </p>
      </div>

      {paletteData && (
        <div className={styles.hiddenWrapper}>
          <div ref={hiddenRef}>
            <PalettePage data={paletteData} />
          </div>
        </div>
      )}
    </div>
  );
}
