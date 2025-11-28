import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ContentProvider } from "./context/ContentContext";
import { ToasterProvider } from "./components/ui/toaster-provider";
import HomePage from "./pages/HomePage";
import ContentDetailPage from "./pages/ContentDetailPage";
import ReaderPage from "./pages/ReaderPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <Router>
      <ContentProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/content/:id" element={<ContentDetailPage />} />
          <Route path="/read/:id" element={<ReaderPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <ToasterProvider />
      </ContentProvider>
    </Router>
  );
}

export default App;
