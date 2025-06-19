import { Toaster } from "./components/ui/toaster";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import VideoAnalysisAdvanced from "./pages/VideoAnalysisAdvanced";
import ScriptGenerator from "./pages/ScriptGenerator";
import Login from "./pages/Login";
import Analytics from "./pages/Analytics";

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/video-analysis" element={<VideoAnalysisAdvanced />} />
              <Route path="/script-generator" element={<ScriptGenerator />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="*" element={<div className="flex items-center justify-center min-h-screen"><div className="text-center"><h1 className="text-2xl font-bold mb-4">Página no encontrada</h1><p>La página que buscas no existe.</p></div></div>} />
            </Routes>
            <Toaster />
          </Router>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;

