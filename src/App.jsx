import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import { Dashboard } from "./pages/Dashboard";
import { ModalProvider } from "./contexts/ModalContext";
import { DataProvider } from "./contexts/DataContext";
import { Modals } from "./components/ui/Modal";
import { ResourcePageProvider } from "./contexts/ResourcePageContext";
import { Resource } from "./pages/Resource";
import { AIAnalysis } from "./pages/AIAnalysis";

function App() {
  return (
    <DataProvider>
      <ModalProvider>
        <BrowserRouter>
          <ResourcePageProvider>
            <div className="min-h-screen bg-gray-100">
              <Routes>
                <Route path="/dashboard" element={<MainLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="products" element={<Resource />} />
                  <Route path="orders" element={<Resource />} />
                  <Route path="customers" element={<Resource />} />
                  <Route path="ai-analysis" element={<AIAnalysis />} />
                </Route>
              </Routes>
            </div>
            <Modals />
          </ResourcePageProvider>
        </BrowserRouter>
      </ModalProvider>
    </DataProvider>
  );
}

export default App;
