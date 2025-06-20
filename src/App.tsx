import { Toaster } from "./components/ui/toaster";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { useTranslation } from 'react-i18next';
import './i18n';
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import VideoAnalysisAdvanced from "./pages/VideoAnalysisAdvanced";
import ScriptGenerator from "./pages/ScriptGenerator";
import Login from "./pages/Login";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Pricing from "./pages/Pricing";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import FinetuningOnboarding from "./pages/FinetuningOnboarding";

function App() {
  const { t } = useTranslation();
  
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/video-analysis" element={<VideoAnalysisAdvanced />} />
              <Route path="/script-generator" element={<ScriptGenerator />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/finetuning" element={<FinetuningOnboarding />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="*" element={<div className="flex items-center justify-center min-h-screen"><div className="text-center"><h1 className="text-2xl font-bold mb-4">{t('home.page_not_found')}</h1><p>{t('home.page_not_found_desc')}</p></div></div>} />
            </Routes>
            <Toaster />
          </Router>
        </AuthProvider>
      </ThemeProvider>
    );
  }

export default App;

