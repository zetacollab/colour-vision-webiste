import React from "react";
import styles from "./PalettePage.module.css";
import logoPart2 from "../assets/images/logo_part2.png";

export default function PalettePage({ data }) {
  const paletteData = data || JSON.parse(localStorage.getItem("paletteData"));
  if (!paletteData) return <p>Loading...</p>;

  const palettes = paletteData.metadata || paletteData.palettes || [];
  const heading = paletteData.heading || "Modern Villa";
  const subheading =
    paletteData.subheading || "Elegant colour palette for contemporary living";
  const imageSrc =
    paletteData.image ||
    paletteData.original_building_url ||
    paletteData.filename ||
    "/assets/default.jpg";

  return (
    <div className={styles.mainBox}>
      {/* Logo */}
      <div className={styles.logoContainer}>
        <img src={logoPart2} alt="Logo" className={styles.logoPart} />
      </div>

      {/* Heading */}
      <div className={styles.headingBlock}>
        <h1>{heading}</h1>
      </div>

      {/* Subheading */}
      <div className={styles.subheadingBlock}>
        <p>{subheading}</p>
      </div>

      {/* Hero Image */}
      <div className={styles.heroSection}>
        <div className={styles.imageBox}>
          <img src={imageSrc} alt="Design" />
        </div>
      </div>

      {/* Palette Section */}
      <div className={styles.paletteSection}>
        {palettes.map((item, idx) => {
          const winner = item.winner || item;
          const rgb =
            winner.rgb && winner.rgb.length === 3
              ? winner.rgb
              : [200, 200, 200];

          return (
            <div className={styles.elevatedBox} key={idx}>
              {/* Circle inside card */}
              <div
                className={styles.colorBox}
                style={{ backgroundColor: `rgb(${rgb.join(",")})` }}
              />
              {/* Text info inside same card */}
              <div className={styles.paletteInfo}>
                <h3>{winner.name || "Unknown"}</h3>
                <p>Code: {winner.code || "N/A"}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info Box */}
      <div className={styles.infoBox}>
        <p className={styles.infoText}>
          ℹ️ Colors shown are indicative only. Please refer to the Berger Colour
          Catalogue or fan deck for exact shades.
        </p>
      </div>
    </div>
  );
}
