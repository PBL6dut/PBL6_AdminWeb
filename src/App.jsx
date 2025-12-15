import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import { Dashboard } from "./pages/Dashboard";
import { ModalProvider } from "./contexts/ModalContext";
import { DataProvider } from "./contexts/DataContext";
import { Modals } from "./components/ui/modal/Modal";
import { ResourcePageProvider } from "./contexts/ResourcePageContext";
import { Resource } from "./pages/Resource";
import { AIAnalysis } from "./pages/AIAnalysis";
import { Login } from "./components/ui/Login";
import { AuthLayout } from "./layouts/AuthLayout";
import { Register } from "./components/ui/Register";
import { AuthProvider } from "./contexts/AuthContext";
import { RootRedirect } from "./components/RootRedirect";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ToastProvider } from "./components/ui/Toast";
// import { ProductForm } from "./components/ui/Form";
// import { FormModal } from "./components/ui/modal/form/FormModal";

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>
          <Route path="/dashboard" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Resource />} />
            <Route path="orders" element={<Resource />} />
            <Route path="customers" element={<Resource />} />
            <Route path="ai-analysis" element={<AIAnalysis />} />
          </Route>
        </Routes>
      </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
