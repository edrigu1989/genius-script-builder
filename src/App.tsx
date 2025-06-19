import { Toaster } from "./components/ui/toaster";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Dashboard from "./pages/Dashboard";
import VideoAnalysisAdvanced from "./pages/VideoAnalysisAdvanced";
import ScriptGenerator from "./pages/ScriptGenerator";
import Login from "./pages/Login";
import WebhookSettings from "./pages/WebhookSettings";
import MyScripts from "./pages/MyScripts";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import WordPressGenerator from "./pages/WordPressGenerator";
import PlatformConnections from "./pages/PlatformConnections";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Dashboard />} />
              <Route path="/video-analysis" element={<VideoAnalysisAdvanced />} />
              <Route path="/script-generator" element={<ScriptGenerator />} />
              <Route path="/webhook-settings" element={<WebhookSettings />} />
              <Route path="/my-scripts" element={<MyScripts />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/wordpress-generator" element={<WordPressGenerator />} />
              <Route path="/connections" element={<PlatformConnections />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </Router>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;

