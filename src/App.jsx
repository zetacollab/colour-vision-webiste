import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UploadPage from "./components/UploadPage";
import PalettePage from "./components/PalettePage";
import PreviewPage from "./components/PreviewPage";   // ✅ new

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UploadPage />} />
        <Route path="/palette" element={<PalettePage />} />
        <Route path="/preview" element={<PreviewPage />} />   {/* ✅ new */}
      </Routes>
    </Router>
  );
}
